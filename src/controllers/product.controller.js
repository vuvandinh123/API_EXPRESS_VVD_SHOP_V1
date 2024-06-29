const { BadRequestError } = require("../core/error.response")
const { OK } = require("../core/success.response")
const Product = require("../models/product.model")
const ProductService = require("../service/product.service")

const getParamsProduct = (req) => {
    // get params
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const offset = (page - 1) * limit
    return { limit, page, offset }
}

class ProductController {

    /**
     * ROLE -----> user
     */
    static async getProductsByCategory(req, res) {
        const { categoryId } = req.params
        const { limit, offset, page } = getParamsProduct(req);
        const { sortBy, price, search, stars, province } = req.query
        const { data, total } = await ProductService.getAllProductByCategory({ categoryId, limit, offset, sortBy, price, search, stars, province })
        const options = {
            count: total,
            pagination: {
                totalPage: Math.ceil(total / limit),
                page: page,
                limit
            }
        }
        new OK({
            message: "Get daily discover products successfully",
            data: data,
            options
        }).send(res)
    }
    static async getCategoryHot(req, res) {
        const { categoryId } = req.query
        const products = await ProductService.getCategoryHot({ categoryId })
        new OK({
            message: "Get category hot successfully",
            data: products
        }).send(res)
    }
    static async searchProducts(req, res) {
        // get params
        const { limit, offset, page } = getParamsProduct(req);
        const { categoryId = "ALL", search, sortBy, price, stars, province } = req.query
        const { data, total } = await ProductService.getAllProductByCategory({ categoryId, search, sortBy, price, stars, province, limit, offset })
        const options = {
            count: total,
            pagination: {
                totalPage: Math.ceil(total / limit),
                page: page,
                limit
            }
        }
        new OK({
            message: "search products successfully",
            data: data,
            options
        }).send(res)
    }
    static async getDailyDiscoverProducts(req, res) {
        const products = await ProductService.getDailyDiscoverProducts()
        new OK({
            message: "Get daily discover products successfully",
            data: products
        }).send(res)
    }
    static async getProductsRandom(req, res) {
        const products = await ProductService.getProductsRandom()
        new OK({
            message: "Get products random successfully",
            data: products
        }).send(res)
    }
    static async getHotSaleProducts(req, res) {
        const products = await ProductService.getHotSaleProducts()
        new OK({
            message: "Get hot sale products successfully",
            data: products
        }).send(res)
    }
    static async getProductUserShop(req, res) {
        const { shopId } = req.params
        const { limit, offset } = getParamsProduct(req);
        const { category, search, sortBy } = req.query
        const { data, countProduct } = await ProductService.getProductUserShop(shopId, { limit, offset, category, search, sortBy })
        const totalPage = Math.ceil(countProduct / limit);
        // Construct options object
        const options = {
            countProduct: countProduct,
            pagination: {
                totalPage,
                page: req.query.page,
                limit
            }
        };
        new OK({
            message: "Get product user shop successfully",
            data: data,
            options
        }).send(res)
    }
    /**
     * ROLE -----> SHOP
     * Retrieves a list of products by shop based on the provided query parameters.
     * 
     */
    static async getProductsByShop(req, res) {
        // Extract query parameters
        const { limit, offset } = getParamsProduct(req);

        const {
            filter,
            search,
            min,
            max,
            active,
            sortBy,
            categoryId
        } = req.query;

        // Construct price object
        const price = { min, max };

        // Retrieve products from service
        const { data, total } = await ProductService.getAllProductsByShop({
            limit,
            offset,
            categoryId,
            filter,
            price,
            sortBy,
            active,
            search
        }, req.user);

        // Calculate total number of pages
        const totalPage = Math.ceil(total / limit);

        // Construct options object
        const options = {
            countProduct: total,
            pagination: {
                totalPage,
                page: req.query.page,
                limit
            }
        };

        // Send success response
        new OK({
            message: "Get products successfully",
            data,
            options
        }).send(res);
    }
    static async getProductById(req, res) {
        const id = req.params.productId
        const product = await ProductService.getProductById(id)
        new OK({
            message: "Get product successfully",
            data: product
        }).send(res)
    }
    static async getProductByShopWithId(req, res) {
        const id = req.params.productId
        const product = await ProductService.getProductByShopWithId(id)
        new OK({
            message: "Get product successfully",
            data: product
        }).send(res)
    }
    static async getInventory(req, res) {
        const inventory = await ProductService.getInventory({ shopId: req.user.id })
        new OK({
            message: "Get inventory successfully",
            data: inventory
        }).send(res)
    }
    // edit product
    static async editProductByShop(req, res) {
        const id = req.params.productId
        const product = req.body
        const products = await ProductService.editProductByShop(id, product, req.user)
        new OK({
            message: "Update product successfully",
            data: products
        }).send(res)
    }

    // get trash product by shop
    static async getProductsTrashByShop(req, res) {
        try {
            // Extract query parameters
            const { limit, page, offset } = getParamsProduct(req);
            const { search, sortBy, categoryId } = req.query;

            // Retrieve products from service
            const { data, total } = await ProductService.getProductsTrashByShop({ limit, offset, categoryId, sortBy, search }, req.user);

            // Calculate total number of pages
            const totalPage = Math.ceil(total / limit);

            // Construct options object
            const options = {
                countProduct: total,
                pagination: {
                    totalPage,
                    page,
                    limit
                }
            };

            // Send success response
            new OK({
                message: "Get products successfully",
                data,
                options
            }).send(res);
        } catch (error) {
            // Throw error if retrieval fails
            throw new BadRequestError(error.message);
        }
    }
    // remove product to trash
    static async patchProductToDelete(req, res) {
        const listId = req.body.listId
        const product = await ProductService.patchProductToDelete(listId, req.user)
        new OK({
            message: "Update product successfully",
            data: product
        }).send(res)
    }
    static async createProducts(req, res) {
        const product = req.body
        const products = await ProductService.createProducts(product, req.user)
        new OK({
            message: "Create product successfully",
            data: products
        }).send(res)
    }

    static async deleteProducts(req, res) {
        const id = req.params.id
        const products = await ProductService.deleteProducts(id, req.user)
        new OK({
            message: "Delete product successfully",
            data: products
        }).send(res)
    }
    // Đếm số lượng sản phẩm theo trạng thái {}
    static async getCountStatusProduct(req, res) {
        const count = await ProductService.getCountStatusProduct(req.user)
        new OK({
            message: "Get count status product successfully",
            data: count
        }).send(res)
    }
    // thay đổi trạng thái sản phẩm
    static async changeStatusProduct(req, res) {
        const listId = req.body.listId
        const value = req.body.value
        const products = await ProductService.changeStatusProduct(listId, value, req.user)
        new OK({
            message: "Change status product successfully",
            data: products
        }).send(res)
    }

    static async getAllProductAndVariant(req, res) {
        const { limit, page, offset } = getParamsProduct(req);
        const { search } = req.query
        const products = await ProductService.getAllProductAndVariant({
            shopId: req.user.id,
            limit,
            offset,
            search
        })
        new OK({
            message: "Get all product and variant successfully",
            data: products
        }).send(res)
    }
    // end shop
    // create is shop

    /**
     * ROLE -----> ADMIN
     */

    static async getAllProductsByAdmin(req, res) {
        const { limit, offset } = getParamsProduct(req);

        const {
            filter,
            search,
            min,
            max,
            active,
            sortBy,
            categoryId
        } = req.query;

        // Construct price object
        const price = { min, max };

        // Retrieve products from service
        const { data, total } = await ProductService.getAllProductsByAdmin({
            limit,
            offset,
            categoryId,
            filter,
            price,
            sortBy,
            active,
            search
        }, req.user);

        // Calculate total number of pages
        const totalPage = Math.ceil(total / limit);

        // Construct options object
        const options = {
            countProduct: total,
            pagination: {
                totalPage,
                page: req.query.page,
                limit
            }
        };

        // Send success response
        new OK({
            message: "Get products successfully",
            data,
            options
        }).send(res);
    }


}
module.exports = ProductController