"use strict"

const knex = require("../database/database");
const DiscountRepository = require("../models/repositories/Discount.repo");
const CartRepository = require("../models/repositories/cart.repo")
const { converProductsToResponse } = require("../utils")
class CartService {
    static async getCart(userId) {
        const products = await CartRepository.getCart(userId)
        return products;
    }
    static async updateCart({ productIds, userId, code, shopId }) {
        const discount = await DiscountRepository.getDiscountByCode(code, shopId)
        const res = await knex("cart_items").update({ discount_id: discount?.id, is_check: 1 }).whereIn("product_id", productIds).join("carts", "carts.id", "cart_items.cart_id").where("carts.user_id", userId)
        return discount
    }
    static async addToCart({ productId, quantity, code }, userId) {
        return await CartRepository.addToCart({ productId, quantity, code }, userId)
    }
    static async removeCartItem(cart_item_id) {
        return await CartRepository.removeToCart(cart_item_id)
    }
    static async changeQuantity(cart_item_id, quantity) {
        return await CartRepository.changeQuantity(cart_item_id, quantity)
    }
}
module.exports = CartService