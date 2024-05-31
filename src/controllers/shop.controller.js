"use strict"

const ShopService = require("../service/shop.service")
const { OK, CREATED } = require("../core/success.response")
class ShopController {
    static async getShopById(req, res) {
        const shopId = req.params.shopId
        const shop = await ShopService.getShopById(shopId)
        new OK({
            message: "Get shop successfully",
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
}
module.exports = ShopController