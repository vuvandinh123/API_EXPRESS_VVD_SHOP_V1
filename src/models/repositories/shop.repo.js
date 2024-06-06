"use strict"

const knex = require("../../database/database")

class ShopRepository {


    // shop
    static async getShopByUserId(userId) {
        return await knex.from(
            "shops",
        ).select(
            "shops.email as shop_email",
            "shops.phone as shop_phone",
            "shops.username as shop_username",
            "shops.name as shop_name",
            "shops.logo as shop_logo",
            "shops.country as shop_country",
            "shops.province	 as shop_province",
            "shops.address	 as shop_address",
            "shops.created_at	 as shop_created_at",
            "shops.website	 as shop_website",
            "shops.description as shop_description",
            "shops.CCCD as shop_cccd",
            "users.email as user_email",
            "users.phone as user_phone",
            "users.firstName as user_first_name",
            "users.lastName as user_last_name",
        ).where("shops.user_id", userId).join("users", "users.id", "shops.user_id").
            groupBy("shops.id", "users.email", "users.firstName", "users.lastName").first()
    }
    static async findUserByUsername(username) {
        return await knex.from("shops").where({ username }).first()
    }
    static async createShop(data, userId) {
        const newShop = {
            name: data.shop_name,
            email: data.shop_email,
            phone: data.shop_phone,
            username: data.shop_username,
            country: data.shop_country,
            province: data.shop_province,
            address: data.shop_address,
            website: data.shop_website,
            description: data.shop_description,
            cccd: data.shop_cccd,
            user_id: userId,
            logo: data.shop_logo,
            is_active: 0,
            status: "pending",
        }

        return await knex("shops").insert(newShop)
    }
    static async verifyEmailRegisterShop(email) {
        return await knex("users").where({ email }).update({ email_verified: 1 })
    }
    // user
    static async getShopById(shopId) {
        return await knex.from(
            "shops",
        ).select(
            "shops.*",
            "users.email as email",
            "users.firstName as firstName",
            "users.lastName as lastName",
            knex.raw(
                `(select count(id) from products where shop_id = shops.id and is_active = 2 and is_delete = 0) as total_product`
            )
        )
        .where("shops.user_id", shopId).join("users", "users.id", "shops.user_id")
        .groupBy("shops.id", "users.email", "users.firstName", "users.lastName").first()
    }
    static async getIsFollowShop({ shopId, userId }) {
        const isFollowing = await knex.from("follows").where({ shop_id: shopId, user_id: userId }).first()
        if (isFollowing) {
            return true
        }
        return false
    }
    static async toggleFollowShop({ shopId, userId }) {
        const isFollowing = await knex("follows")
            .where({ shop_id: shopId, user_id: userId })
            .first();

        if (isFollowing) {
            await knex("follows")
                .where({ shop_id: shopId, user_id: userId })
                .del();

        } else {
            await knex("follows").insert({ shop_id: shopId, user_id: userId });
        }

        return true;
    }
}
module.exports = ShopRepository