"use strict"

const { OK } = require("../core/success.response")
const CartService = require("../service/cart.service")

class CartController {

    static async getCart(req, res) {
        const { user } = req
        const cart = await CartService.getCart(user.id)
        new OK({
            message: "Get all cart successfully",
            data: cart
        }).send(res)
    }
    static async addToCart(req, res) {
        const { user } = req
        const { productId, quantity = 1, code } = req.body
        const cart = await CartService.addToCart({ productId, quantity, code }, user.id)
        new OK({
            message: "Add to cart successfully",
            data: cart
        }).send(res)
    }
    static async changeQuantityCartItem(req, res) {
        const { cart_item_id, quantity } = req.body
        const cart = await CartService.changeQuantity(cart_item_id, quantity)
        new OK({
            message: "Change quantity cart item successfully",
            data: cart
        }).send(res)
    }
    static async removeCartItem(req, res) {
        const { cart_item_id } = req.params
        const cart = await CartService.removeCartItem(cart_item_id)
        new OK({
            message: "Remove cart item successfully",
            data: cart
        }).send(res)
    }
    static async updateCart(req, res) {
        const { user } = req
        const { productIds, code, shop_id } = req.body
        const cart = await CartService.updateCart({ productIds, userId: user.id, code, shopId: shop_id })
        new OK({
            message: "Update cart successfully",
            data: cart
        }).send(res)
    }
}

module.exports = CartController