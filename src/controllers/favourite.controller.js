"use strict"

const { OK } = require("../core/success.response")
const FavouriteService = require("../service/favourite.service")
const { getParamsPagination } = require("../utils")

class FavouriteController {

    static async getFavourite(req, res) {
        const { user } = req
        const { limit = 10, offset = 0 } = getParamsPagination(req)
        const favourite = await FavouriteService.getFavourite(user.id, { limit, offset })
        new OK({
            message: "Get all favourite successfully",
            data: favourite
        }).send(res)
    }
    static async addToFavourite(req, res) {
        const { user } = req
        const { productId } = req.body
        const cart = await FavouriteService.addToFavourite({ productId }, user.id)
        new OK({
            message: "Add to fav successfully",
            data: cart
        }).send(res)
    }
    static async removeToFavourite(req, res) {
        const { productId } = req.params
        const cart = await FavouriteService.removeToFavourite(productId)
        new OK({
            message: "Remove fav item successfully",
            data: cart
        }).send(res)
    }
}

module.exports = FavouriteController