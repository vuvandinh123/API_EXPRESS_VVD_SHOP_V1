"use strict";

const PromotionRepository = require("../models/repositories/promotions.repo");


class PromotionService {
  static async getAllPromotion({ shopId, search, active, sortBy, status, limit, offset }) {
    const promotions = await PromotionRepository.getAllPromition({ shopId, search, active, sortBy, status, limit, offset });
    return promotions
  }
  static async createPromotion(data, shopId) {
    const promotion = await PromotionRepository.createPromotion(data, shopId);
    return promotion
  }
  static async getAllProductsOnPromotion({ shopId, search, limit, offset }) {
    const promotions = await PromotionRepository.getAllProductsOnPromotion({ shopId, search, limit, offset });
    return promotions
  }
  static async changeStatusPromotion({ listId, value, shopId }) {
    return await PromotionRepository.changeStatusPromotion({ listId, value, shopId })
  }
  static async deleteToTrashPromotion({ listId, shopId }) {
    return await PromotionRepository.deleteToTrashPromotion({ listId, shopId })
  }
  static async getCountStatusPromotion({ shopId }) {
    const discount = await PromotionRepository.getCountStatusPromotion({ shopId })
    return discount
  }
  static async getPromotionById({id,shopId}) {
    const promotion = await PromotionRepository.getPromotionById({id,shopId});
    return promotion
  }
  static async updatePromotion({id,data,shopId}) {
    const promotion = await PromotionRepository.updatePromotion({id,data,shopId});
    return promotion
  }
}
module.exports = PromotionService;
