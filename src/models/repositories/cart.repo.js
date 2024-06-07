"use strict";

const knex = require("../../database/database");
const { converProductsToResponse2 } = require("../../utils");

class CartRepository {

    // carts
    static async getCart(userId) {
        // lấy ra cart của người dùng
        const cart = await knex.from("carts").where("user_id", userId).first();
        if (!cart) {
            return null;
        }
        const cartItems = await knex.from("cart_items")
            .where("cart_id", cart.id)
            .leftJoin("products", "products.id", "cart_items.product_id")
            .leftJoin("promotions", "products.id", "promotions.product_id")
            .leftJoin("discounts", "discounts.id", "cart_items.discount_id")
            // .where("promotions.end_date", ">=", knex.fn.now())
            // .where("promotions.start_date", "<=", knex.fn.now())
            .select(
                "products.id",
                "cart_items.id as cart_item_id",
                "cart_items.is_check",
                "products.name",
                "products.price",
                "products.thumbnail",
                "products.slug",
                "products.shop_id",
                "cart_items.quantity",
                "cart_items.code",
                "promotions.price_sale",
                "promotions.type_price"
            )
            .orderBy("cart_items.id");
        const newCartItems = await converProductsToResponse2(cartItems)
        const shopProducts = newCartItems.reduce((acc, item) => {
            const shopId = item.shop_id;
            if (!acc[shopId]) {
                acc[shopId] = {
                    id: shopId,
                    cartId: cart.id,
                    products: [],
                };
            }
            acc[shopId].products.push({
                id: item.id,
                name: item.name,
                price: item.price,
                price_sale: item.price_sale,
                fix_price: item.fix_price,
                thumbnail: item.thumbnail,
                slug: item.slug,
                is_check: item.is_check,
                quantity: item.quantity,
                code: item.code,
                cart_item_id: item.cart_item_id,
                amount: item.price * item.quantity
            });
            return acc;
        }, {});
        const formathdata = await Promise.all(Object.values(shopProducts).map(async item => {
            const shop = await knex.from("shops").where("user_id", item.id).select("id", "name", "logo", "username").first();
            return {
                ...item,
                name: shop.name,
                logo: shop.logo,
                username: shop.username,
                products: [...item.products]
            }
        }))
        return formathdata;

    }
    static async updateCart(productIds, code) {

    }
    static async createCart(userId) {
        const data = {
            user_id: userId
        }
        return await knex("carts").insert(data)
    }
    static async addToCart({ productId, quantity, code }, userId) {
        let cart = await knex("carts")
            .where({ user_id: userId })
            .first();
        if (!cart) {
            let response = await knex("carts")
                .insert({ user_id: userId })
                .returning("id")
            cart = {
                id: response[0]
            }
        }
        const query = knex("cart_items")
            .where({ cart_id: cart.id, product_id: productId })
            .first();
        if (code) {
            query.where({ code: code })
        }
        const cartItem = await query;
        if (cartItem) {
            await knex("cart_items")
                .where({ cart_id: cart.id, product_id: productId })
                .update({ quantity: cartItem.quantity + quantity });
        } else {
            await knex("cart_items")
                .insert({ cart_id: cart.id, product_id: productId, quantity, code: code });
        }
        return cart
    }
    static async removeToCart(cart_item_id) {
        return await knex("cart_items").where("id", cart_item_id).del()
    }
    static async changeQuantity(cart_item_id, quantity) {
        return await knex("cart_items")
            .where("id", cart_item_id)
            .update({ quantity: quantity })
    }

}

module.exports = CartRepository