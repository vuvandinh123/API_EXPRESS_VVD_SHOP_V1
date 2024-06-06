"use strict";

const knex = require("../../database/database");

class FavouriteRepository {

    // carts
    static async getFavourite(userId, { limit = 10, offset = 0 }) {
        // lấy ra fav của người dùng
        const res = await knex.table("favourite_items")
            .select("products.id", "products.name", "products.price", "products.thumbnail", "products.slug", "products.shop_id", "products.sold", "favourite_items.id as fav_item_id")
            .join("products", "products.id", "favourite_items.product_id")
            .join("favourites", "favourites.id", "favourite_items.favourite_id")
            .where("favourites.user_id", userId)
            .orderBy("favourite_items.created_at", "desc")
            .limit(limit).offset(offset)
            .groupBy("products.id", "products.name", "products.price", "products.thumbnail", "products.slug", "products.shop_id", "products.sold", "favourite_items.id");
        return res
    }
    static async createFavourite(userId) {
        const data = {
            user_id: userId
        }
        return await knex("favourites").insert(data)
    }
    static async addToFavourite({ productId }, userId) {
        let fav = await knex("favourites")
            .where({ user_id: userId })
            .first();
        if (!fav) {
            let response = this.createFavourite(userId)
            fav = {
                id: response[0]
            }
        }
        await knex("favourite_items")
            .insert({ favourite_id: fav.id, product_id: productId });
        return fav
    }
    static async removeToFavourite(productId) {
        return await knex("favourite_items").where("product_id", productId).del()
    }

}

module.exports = FavouriteRepository