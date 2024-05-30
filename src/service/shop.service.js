"use strict"

const ShopRepository = require("../models/repositories/shop.repo")
const UserRepository = require("../models/repositories/user.repo")

class ShopService {


    // shops
    static async createShop(data) {
        const newUser = {
            firstName: data.user_first_name,
            lastName: data.user_last_name,
            email: data.user_email,
            phone: data.user_phone,
            role_id: 3,
            type_login: "signup",
        }
        const userId = await UserRepository.createUser(newUser)
        return await ShopRepository.createShop(data,userId[0])
    }

    // user
    static async getShopById(shopId) {
        return await ShopRepository.getShopById(shopId)
    }
    static async toggleFollowShop({ shopId, userId }) {

        return await ShopRepository.toggleFollowShop({ shopId, userId })
    }
    static async getIsFollowShop({ shopId, userId }) {
        return await ShopRepository.getIsFollowShop({ shopId, userId })
    }
    static async getShopByUserId(userId) {
        return await ShopRepository.getShopByUserId(userId)
    }
}
module.exports = ShopService