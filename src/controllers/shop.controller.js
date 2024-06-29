"use strict"

const ShopService = require("../service/shop.service")
const { OK, CREATED } = require("../core/success.response")
const { getParamsPagination } = require("../utils")
class ShopController {
    static async getShopById(req, res) {
        const shopId = req.params.shopId
        const shop = await ShopService.getShopById(shopId)
        new OK({
            message: "Get shop successfully",
            data: shop
        }).send(res)

    }
    static async changePasswordByShop(req, res) {
        const { newPassword } = req.body
        console.log(newPassword);
        const shop = await ShopService.changePasswordByShop({ shopId: req.user.id, newPassword })
        new OK({
            message: "Change password successfully",
            data: shop
        }).send(res)
    }
    static async toggleFollowShop(req, res) {
        const shopId = req.params.shopId
        const shop = await ShopService.toggleFollowShop({ shopId, userId: req.user.id })
        new OK({
            message: "Change follow shop successfully",
            data: shop
        }).send(res)
    }
    static async getIsFollowShop(req, res) {
        const shopId = req.params.shopId
        const shop = await ShopService.getIsFollowShop({ shopId, userId: req.user.id ?? null })
        new OK({
            message: "Change follow shop successfully",
            data: shop
        }).send(res)
    }
    static async getShopByUserId(req, res) {
        const userId = req.params.userId
        const shop = await ShopService.getShopByUserId(userId)
        new OK({
            message: "Get shop successfully",
            data: shop
        }).send(res)
    }
    // shops
    static async createShop(req, res) {
        const data = req.body
        const shop = await ShopService.createShop(data)
        new CREATED({
            message: "Create shop successfully",
            data: shop
        }).send(res)
    }
    static async verifyEmailRegisterShop(req, res) {
        const { email, token } = req.body
        const shop = await ShopService.verifyEmailRegisterShop({ email, token })
        new OK({
            message: "Verify email successfully",
            data: shop
        }).send(res)
    }
    // admin
    static async getAllShopByAdmin(req, res) {
        const { limit, page, offset } = getParamsPagination(req)
        const { search, active, sortBy } = req.query
        const { data, count } = await ShopService.getAllShopByAdmin({ limit, offset, search, active, sortBy })
        const totalPagte = Math.ceil(count / limit)
        const options = {
            count: count,
            pagination: {
                totalPage: totalPagte,
                page: page,
                limit
            }
        }
        new OK({
            message: "Get all shop successfully",
            data,
            options
        }).send(res)
    }
    static async changeStatusShop(req, res) {
        const { shopId, status } = req.body
        const shop = await ShopService.changeStatusShop({ shopId, status })
        new OK({
            message: "Change status shop successfully",
            data: shop
        }).send(res)
    }
    static async getShopId(req, res) {
        const shopId = req.params.shopId
        const shop = await ShopService.getShopId(shopId)
        new OK({
            message: "Get shop successfully",
            data: shop
        }).send(res)
    }
    static async getShopChatsByIds(req, res) {
        const { shopIds } = req.body
        const shop = await ShopService.getShopChatsByIds({ shopIds })
        new OK({
            message: "Get shop successfully",
            data: shop
        }).send(res)
    }
    static async getCountStatusShop(req, res) {
        const shop = await ShopService.getCountStatusShop()
        new OK({
            message: "Get count status shop successfully",
            data: shop
        }).send(res)
    }
}
module.exports = ShopController