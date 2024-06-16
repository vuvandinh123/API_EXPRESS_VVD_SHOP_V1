"use strict";

const firebase = require("../configs/firebase.config");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const InventoryLogRepository = require("../models/repositories/inventoryLog.repo");
const ProductRepository = require("../models/repositories/product.repo");
const admin = require('firebase-admin');

class InventoryLogService {
  /**
   * 
   * {
   * 
   *  product:[
   *  {
   *  id:1,
   *  quantity:1,
   * total:1000 
   * } 
   * ]
   * }
   */
  static async createInventoryLog(data, user) {
    try {
      // tinh tiền và số lượng sản phẩm trong inventory log;
      data.total = data.product?.reduce((total, item) => total + Number(item.import_price) * Number(item.quantity), 0)
      if (data.total === undefined) {
        throw new BadRequestError("Product list in inventory log must not be null")
      }
      data.quantity = data.product?.reduce((total, item) => total + Number(item.quantity), 0)
      if (data.quantity === undefined) {
        throw new BadRequestError("Product list in inventory log must not be null")
      }
      // tạo inventory log
      const inventory = await InventoryLogRepository.createInventoryLog(data, user);

      await Promise.all(data.product?.map(async (item) => {
        // tìm product
        const isProduct = await ProductRepository.getSimpleProduct(item.product_id)
        if (isProduct === null) {
          throw new BadRequestError(`Product with id ${item.product_id} not found`)
        }
        const newQty = Number(isProduct.quantity) + Number(item.quantity);
        await ProductRepository.patchProductQuantity(item.product_id, newQty)

        const amount = Number(item.import_price) * Number(item.quantity)
        if (item.variant?.code) {
          const variantDoc = await InventoryLogRepository.getVariantFirebaseById(item.product_id);
          if (variantDoc.exists) {
            const variantData = variantDoc.data();
            const index = variantData.productVariants.findIndex(item2 => item2.code === item.variant.code)
            if (index !== -1) {
              variantData.productVariants[index].stock = Number(variantData.productVariants[index].stock) + Number(item.quantity);
              // cập nhật trên firebase
              await firebase.collection("variant").doc(item.product_id.toString()).update(variantData, { merge: true });
            }
          }
        }
        // taoj product inventory;
        await InventoryLogRepository.createProductInventoryLog({
          product_id: item.product_id,
          quantity: item.quantity,
          import_price: item.import_price,
          amount: amount,
          inventory_id: inventory[0],
          code: item.variant?.code ?? ""
        })
      }))
      return inventory
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      } else {
        console.error(error);
        throw new InternalServerError("Internal server error");
      }
    }
  }
  static async getAllInventoryLog({ limit, offset, month }, user,type) {
    return InventoryLogRepository.getAllInventoryLog({ limit, offset, month }, user,type);
  }
  static async getAllOutInventoryLog({ limit, offset, month }, user) {
    return InventoryLogRepository.getAllInventoryLog({ limit, offset, month }, user, "OUT");
  }
  static async getVariantFirebaseById(id) {
    const variantDoc = await InventoryLogRepository.getVariantFirebaseById(id);
    const data = [];
    if (variantDoc.exists) {
      const variantData = variantDoc.data();
      variantData.productVariants.map(item2 => {
        if (item2.isActive) {
          data.push({
            "id": variantData.productId,
            "name": variantData.productName,
            "thumbnail": variantData.thumbnail,
            "code": item2.code,
            "price": item2.price,
            "stock": item2.stock
          })
        }
        return {}
      })
      console.log(data);
      return data
    } else {
      throw new NotFoundError("Variant not found")
    }
  }
  static async getInventoryLogById(id,user) {
    return InventoryLogRepository.getInventoryLogById(id,user);
  }
  static async getTotalAmountInventoryLog(type,user) {
    return InventoryLogRepository.getTotalAmountInventoryLog(type,user);
  }
  static async getInventoryStats(userId,compareWith = 'week') {
    return InventoryLogRepository.getInventoryStats(userId, compareWith);
  }
}
module.exports = InventoryLogService;
