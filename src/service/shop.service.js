"use strict"
const crypto = require('crypto');

const ShopRepository = require("../models/repositories/shop.repo")
const UserRepository = require("../models/repositories/user.repo")
const { renderVerifyEmailShop } = require("../utils/VerifyEmail");
const NodeCache = require('node-cache');
const { sendNodemail } = require('../utils');
const knex = require('../database/database');
const cache = new NodeCache();
const bcrypt = require("bcrypt");
const { NotFoundError } = require('../core/error.response');

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
            first_login: 1
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

    // admin
    static async getAllShopByAdmin({ limit, offset, search, active, sortBy }) {
        return await ShopRepository.getAllShopByAdmin({ limit, offset, search, active, sortBy })
    }
    static async getShopId(shopId) {
        return await ShopRepository.getShopId(shopId)
    }
    static async changeStatusShop({ shopId, status }) {
        const res = await ShopRepository.changeStatusShop({ shopId, status })
        const shop = await knex.from("shops").where("shops.user_id", shopId)
            .join("users", "users.id", "shops.user_id")
            .select("shops.*", "users.email", "users.firstName", "users.lastName")
            .first()
        if (status === "active") {
            const password = crypto.randomBytes(6).toString('hex');
            const passwordHast = await bcrypt.hash(password, 10)
            await knex("users").where({ id: shop.user_id }).update({ password: passwordHast })
            let html = `
                    <p>Tài khoản ${shop.name} của bạn đã được xác nhận với VVD SHOP  </p>
                    <p>Email: ${shop.email}</p>
                    <p>Mật khẩu: ${password}</p>
                    `
            sendNodemail({ email: shop.email, title: "Vu Dinh Shop - TÀI KHOẢN BÁN HÀNG CỦA BẠN ĐÃ ĐƯỢC XÁC NHẬN", html: html })
        } else if (status === "cancel") {
            sendNodemail({ email: shop.email, title: "Vu Dinh Shop - TÀI KHOẢN BÁN HÀNG CỦA BẠN ĐĂNG KÝ KHÔNG ĐẠT YÊU CẦU CỦA CHÚNG TÔI", html: "<p>Xin lỗi nhưng cửa hàng của bạn đăng ký không thành công vui lòng liên hệ để biết thêm chi tiết !!</p>" })
        }

    }
    static async getShopChatsByIds({ shopIds }) {
        return await ShopRepository.getShopChatsByIds({ shopIds })
    }
    static async getCountStatusShop() {
        return await ShopRepository.getCountStatusShop()
    }
    static async changePasswordByShop({ shopId, newPassword }) {
        const shop = await ShopRepository.getShopId(shopId)
        if (!shop) throw new NotFoundError("Shop not found")
        if (shop.first_login === 1) {
            return 0
        }
        const passwordHast = await bcrypt.hash(newPassword, 10)
        return await ShopRepository.changePasswordByShop({ shopId, newPassword: passwordHast })
    }
}
module.exports = ShopService