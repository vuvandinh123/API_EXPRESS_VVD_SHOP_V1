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
            "shops.nation_id as shop_nation",
            "shops.province_id	 as shop_province",
            "shops.address	 as shop_address",
            "shops.created_at	 as shop_created_at",
            "shops.website	 as shop_website",
            "shops.description as shop_description",
            "shops.CCCD as shop_cccd",
            "users.email as user_email",
            "users.phone as user_phone",
            "shops.status as shop_status",
            "users.firstName as user_first_name",
            "users.lastName as user_last_name",
        ).where("shops.user_id", userId)
            .join("users", "users.id", "shops.user_id")
            .groupBy("shops.id", "users.email", "users.firstName", "users.lastName").first()
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
            nation_id: data.shop_nation_id,
            province_id: data.shop_province_id,
            address: data.shop_address,
            website: data.shop_website,
            description: data.shop_description,
            cccd: data.shop_cccd,
            user_id: userId,
            logo: data.shop_logo,
            is_active: 0,
            status: "pending",
        }
        console.log(newShop);
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
            "provinces.name as province_name",
            knex.raw(
                `(select count(id) from products where shop_id = shops.user_id and is_active = 2 and is_delete = 0) as total_product`
            )
        )
            .where("shops.user_id", shopId).join("users", "users.id", "shops.user_id")
            .join("provinces", "provinces.id", "shops.province_id")
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
    // admin
    static async getAllShopByAdmin({ limit, offset, search, active, sortBy }) {
        const query = knex.from(
            "shops",
        ).select(
            "shops.*",
            knex.raw(
                `(select count(id) from products where shop_id = users.id and is_active = 2 and is_delete = 0) as total_product`
            )
        ).join("users", "users.id", "shops.user_id")
            .groupBy("shops.id")
            .orderBy("created_at", "desc")
        const query2 = knex.from(
            "shops",
        ).count("id as count")
        if (search) {
            query.where("shops.name", "like", `%${search}%`)
            query2.where("shops.name", "like", `%${search}%`)
        }
        if (active !== "all") {
            query.where("shops.status", active)
            query2.where("shops.status", active)
        }
        const [data, count] = await Promise.all([query.offset(offset).limit(limit), query2])
        return {
            data,
            count: count[0].count
        }
    }
    static async changeStatusShop({ shopId, status }) {
        return await knex("shops").where({ user_id: shopId }).update({ status })
    }
    static async getShopId(shopId) {
        return await knex.from("shops").where({ user_id: shopId }).first()
    }
    static async getShopChatsByIds({ shopIds }) {
        return await knex.from("shops").whereIn("user_id", shopIds)
            .select("id", "name", "logo", "user_id")
    }
    static async getCountStatusShop() {
        const response = await knex('shops')
            .select(
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM shops
            ) AS countTotal`
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM shops
                WHERE status = 'active'
            ) AS countActive`
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM shops
                 WHERE status = 'pending'
            ) AS countPending`
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM shops
                 WHERE status = 'cancel'
            ) AS countCancel`
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM shops
                 WHERE status = 'blocked'
            ) AS countBlock`
                )
            )
            .first();
        return response
    }
    static async changePasswordByShop({ shopId, newPassword }) {
        return await knex("users").where({ id: shopId }).update({ password: newPassword, first_login: 0 })
    }
}
module.exports = ShopRepository