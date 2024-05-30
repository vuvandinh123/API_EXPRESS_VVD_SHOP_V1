'use strict'

const knex = require("../../database/database")

class ImageRepository {
    static async createImages(data) {
        const image = await knex('product_images').insert(data)
        return image
    }
    static async getImages(productId){
        const images = await knex('product_images').where('product_id', productId)
        return images
    }
    static async deleteImages(images){
        const image = await knex('product_images').whereIn('id', images).del()
        return image
    }
}
module.exports =  ImageRepository