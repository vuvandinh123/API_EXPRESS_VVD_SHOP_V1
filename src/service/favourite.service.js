"use strict"

const FavouriteRepository = require("../models/repositories/favourite.repo")

class FavouriteService {
    static async getFavourite(userId, { limit, offset }) {
        return await FavouriteRepository.getFavourite(userId, { limit, offset })
    }
    static async addToFavourite({ productId }, userId) {
        return await FavouriteRepository.addToFavourite({ productId }, userId)
    }
    static async removeToFavourite(productId) {
        return await FavouriteRepository.removeToFavourite(productId)
    }

}
module.exports = FavouriteService