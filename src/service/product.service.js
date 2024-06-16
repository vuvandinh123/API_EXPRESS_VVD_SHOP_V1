"use strict";

const firebase = require("../configs/firebase.config");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const knex = require("../database/database");
const ImageRepository = require("../models/repositories/image.repo");
const ProductRepository = require("../models/repositories/product.repo");
const SpecRepository = require("../models/repositories/spec.repo");
const { converProductsToResponse, deleteDocuments } = require("../utils");
const SpecService = require("./Spec.service");

class ProductService {


  // user
  static async getAllProductByCategory({ categoryId, offset, limit, sortBy, price, search, stars, province }) {
    const products = await ProductRepository.getAllProductByCategory({ categoryId, offset, limit, sortBy, price, search, stars, province })
    const response = converProductsToResponse(products.data)
    return {
      data: response,
      total: products.total
    }
  }
  static async searchProducts({ categoryId, search }) {
    const products = await ProductRepository.searchProducts({ categoryId, search })
    const response = converProductsToResponse(products)
    return {
      data: response,
    }
  }
  static async getDailyDiscoverProducts() {
    const products = await ProductRepository.getDailyDiscoverProducts()
    const response = converProductsToResponse(products)

    return response
  }
  static async getProductsRandom() {
    const products = await ProductRepository.getProductsRandom()
    const response = converProductsToResponse(products)
    return response
  }
  static async getCategoryHot({ categoryId }) {
    const products = await ProductRepository.getCategoryHot({ categoryId })
    const response = converProductsToResponse(products)
    return response
  }
  static async getHotSaleProducts() {
    const products = await ProductRepository.getHotSaleProducts()

    const response = converProductsToResponse(products)
    return response
  }
  static async getProductUserShop(shopId, params) {
    const products = await ProductRepository.getProductUserShop(shopId, params)
    const response = converProductsToResponse(products.data)
    return {
      data: response,
      countProduct: products.countProduct
    }
  }
  // shop
  static async getAllProductsByShop({ limit, offset, categoryId, filter, price, sortBy, active, search }, user) {
    const products = await ProductRepository.getAllProductsByShop({ limit, offset, categoryId, filter, price, sortBy, active, search }, user)

    const response = converProductsToResponse(products.data)
    return {
      data: response,
      total: products.total
    };
  }
  static async getProductByShopWithId(id) {
    const [product, spec, variantDoc] = await Promise.all([
      ProductRepository.findProductById(id),
      SpecService.getSpecByProductId(id),
      firebase.collection("variant").doc(id).get()
    ]);
    if (!product) {
      throw new NotFoundError("Product not found")
    }
    product.imageUrls = product.imageUrls.split(",");
    if (spec) {
      product.spec = spec
    }
    if (variantDoc.exists) {
      try {
        const variantData = variantDoc.data();
        product.variant = variantData;
      } catch (error) {
        console.log(error);
      }

    }
    return product;
  }
  static async getProductById(id) {
    const [product, spec, variantDoc] = await Promise.all([
      ProductRepository.findProductById(id),
      SpecService.getSpecByProductId(id),
      firebase.collection("variant").doc(id).get()
    ]);
    if (!product) {
      throw new NotFoundError("Product not found")
    }
    product.imageUrls = product.imageUrls.split(",");
    if (spec) {
      product.spec = spec
    }
    if (variantDoc.exists) {
      try {
        const variantData = variantDoc.data();
        const productVariantsNew = variantData.productVariants.filter((item) => {
          return item.stock > 0 && item.isActive
        })
        variantData.productVariants = productVariantsNew
        product.variant = variantData;
      } catch (error) {
        console.log(error);
      }

    }
    return product;
  }
  // Lấy tất cả variant 
  static async getInventory() {
    let query = firebase.collection("variant")
    const querySnapshot = await query.get();
    const variants = [];

    querySnapshot.forEach(doc => {
      variants.push(doc.data());
    });
    const data = [];
    const newVariant = variants.map(item => (
      item.productVariants.map(item2 => {
        if (item2.isActive) {
          data.push({
            "id": item.productId,
            "name": item.productName,
            "thumbnail": item.thumbnail,
            "code": item2.code,
            "price": item2.price,
            "stock": item2.stock
          })
        }
        return {}
      })
    ))
    return data;
  }

  static async getProductsTrashByShop({ limit, offset, sortBy, search }, user) {
    try {
      const products = await ProductRepository.getProductsTrashByShop({ limit, offset, sortBy, search }, user)
      const response = converProductsToResponse(products)

      return response
    } catch (error) {
      throw new BadRequestError("Failed to get products" + error);
    }
  }
  static async editProductByShop(id, product, user) {
    try {
      if (product.type === "multiple") {
        if (product.variant) {
          product.variant.productName = product.name;
          product.variant.productId = id;
          product.variant.shopId = user.id;
          product.variant.thumbnail = product.thumbnail;
          await firebase.collection("variant").doc(id.toString()).set(product.variant, { merge: true })
        }
        product.quantity = product.variant.productVariants.reduce((total, item) => total + Number(item.stock), 0);
      }
      await ProductRepository.editProductByShop(id, product);
      if (product.files.length > 0) {
        const images = []
        for (let file of product.files) {
          images.push({
            product_id: id,
            image_path: file.url,
            name: file.name
          })
        }
        await ImageRepository.createImages(images)
      }
      await SpecRepository.removeSpecProductId(id)
      const specs = [];
      if (product.spec.length > 0) {
        for (let spec of product.spec) {
          specs.push({
            product_id: id,
            name: spec.name,
            value: spec.value
          })
        }
        await SpecRepository.createSpec(specs)
      }
      return product
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Failed to edit product" + error);
    }
  }
  static async getProductsByCategory({ limit, offset, categoryId, filter, price, sortBy }) {

    try {
      const products = await ProductRepository.getProductsByCategory({ limit, offset, categoryId, filter, price, sortBy })
      const response = converProductsToResponse(products)

      return response
    } catch (error) {
      throw new BadRequestError("Failed to get products" + error);

    }
  }

  static async createProducts(product, user) {

    if (product.type === "multiple") {
      product.quantity = product.variant.productVariants.reduce((total, item) => total + Number(item.stock), 0);
    }
    const newProduct = await ProductRepository.createProduct(product, user);
    if (!newProduct[0]) throw new BadRequestError("Failed to create product");
    // upload image
    const images = []
    if (product.files?.length > 0) {
      for (let file of product.files) {
        images.push({
          product_id: newProduct[0],
          image_path: file.url,
          name: file.name
        })
      }
      await ImageRepository.createImages(images)
    }
    const specs = [];
    if (product.spec?.length > 0) {
      for (let spec of product.spec) {
        specs.push({
          product_id: newProduct[0],
          name: spec.name,
          value: spec.value
        })
      }
      await SpecRepository.createSpec(specs)
    }
    if (product.type === "multiple") {
      // upload variant
      if (product.variant) {
        product.variant.productName = product.name;
        product.variant.productId = newProduct[0];
        product.variant.shopId = user.id;
        product.variant.thumbnail = images[0].image_path;
        const newDocRef = firebase.collection("variant").doc(newProduct[0].toString());
        await newDocRef.set(product.variant);
      }
    }

    return newProduct;
  }
  static async deleteProducts(id, user) {
    const product = await ProductRepository.deleteProduct(id, user)
    firebase.collection("variant").doc(id).delete()
    return product
  }

  // xóa sản phẩm khỏi shop 
  static async patchProductToDelete(listId, user) {
    const product = await ProductRepository.patchProductToDelete(listId, user)
    deleteDocuments(listId)
    return product
  }
  // đến số lượng các trạng thái sản phẩm của shop
  static async getCountStatusProduct(user) {
    const product = await ProductRepository.getCountStatusProduct(user)
    return product
  }
  // thay đổi trạng thái sane phẩm
  static async changeStatusProduct(listId, value, user) {
    const product = await ProductRepository.changeStatusProduct(listId, value, user)
    return product
  }

  static async getAllProductAndVariant({ shopId, search, }) {
    const products = await ProductRepository.getAllProductAndVariant({ shopId, search })
    return products
  }
}
module.exports = ProductService;
