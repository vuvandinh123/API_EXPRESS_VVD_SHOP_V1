"use strict"
const { OK, CREATED } = require("../core/success.response")
const PromotionService = require("../service/promotion.service");
const { getParamsPagination } = require("../utils");


class PromotionController {

    static async getAllpromotion(req, res) {
        const { limit, offset, page } = getParamsPagination(req);
        const { search, active, sortBy, status } = req.query
        const { data, total } = await PromotionService.getAllPromotion({ shopId: req.user.id, search, active, sortBy, status, limit, offset })
        const totalPage = Math.ceil(total / limit);
        const options = {
            countProduct: total,
            pagination: {
                totalPage,
                page,
                limit
            }
        };
        new OK({
            message: "Get all promotions successfully",
            data: data,
            options: options
        }).send(res)
    }
    static async createPromotion(req, res) {
        const promotion = req.body
        const promotions = await PromotionService.createPromotion(promotion, req.user.id)
        new CREATED({
            message: "Create promotion successfully",
            data: promotions
        }).send(res)
    }
    static async getAllProductsOnPromotion(req, res) {
        const { limit, offset, page } = getParamsPagination(req);
        const { search } = req.query
        const { data, total } = await PromotionService.getAllProductsOnPromotion({ shopId: req.user.id, search, limit, offset })
        new OK({
            message: "Get all products on promotion successfully",
            data: data,
            options: {

            }
        }).send(res)
    }
    static async changeStatusPromotion(req, res) {
        const { listId, value } = req.body
        const Promotion = await PromotionService.changeStatusPromotion({ listId, value, shopId: req.user.id })
        new OK({
            message: "Change status Promotion code successfully",
            data: Promotion
        }).send(res)
    }
    static async deleteToTrashPromotion(req, res) {
        const { listId } = req.body
        const Promotion = await PromotionService.deleteToTrashPromotion({ listId, shopId: req.user.id })
        new OK({
            message: "Delete status Promotion code successfully",
            data: Promotion
        }).send(res)
    }
    static async getCountStatusPromotion(req, res) {
        const promotion = await PromotionService.getCountStatusPromotion({ shopId: req.user.id })
        new OK({
            message: "Get count status Promotion code successfully",
            data: promotion
        }).send(res)
    }
    static async getPromotionById(req, res) {
        const { promotionId } = req.params
        const promotion = await PromotionService.getPromotionById({ id: promotionId, shopId: req.user.id })
        new OK({
            message: "Get promotion successfully",
            data: promotion
        }).send(res)
    }
    static async updatePromotion(req, res) {
        const { promotionId } = req.params
        const data = req.body
        console.log(data);
        const promotions = await PromotionService.updatePromotion({ id: promotionId, data, shopId: req.user.id })
        new OK({
            message: "Update promotion successfully",
            data: promotions
        }).send(res)
    }
}
module.exports = PromotionController