"use strict"
const crypto = require('crypto');

const ShopRepository = require("../models/repositories/shop.repo")
const UserRepository = require("../models/repositories/user.repo")
const { renderVerifyEmailShop } = require("../utils/VerifyEmail");
const NodeCache = require('node-cache');
const { sendNodemail } = require('../utils');
const cache = new NodeCache();

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
        const newShop = await ShopRepository.createShop(data, userId[0])
        // send email validation
        const verificationCode = crypto.randomBytes(20).toString('hex');
        cache.set(data.user_email, verificationCode, 60 * 5);
        sendNodemail({ email: data.user_email, title: "VVD SHOP - Verify Email", html: renderVerifyEmailShop({ email: data.user_email, token: verificationCode, name: newUser.firstName }) })
        return newShop
    }
    static verifyEmailRegisterShop = async ({ email, token }) => {
        if (!token) return false
        const cacheCode = cache.get(email)
        if (cacheCode === token) {
            await ShopRepository.verifyEmailRegisterShop(email)
            cache.del(email)
            return true
        }
        return false
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