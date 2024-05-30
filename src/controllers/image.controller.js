const { OK } = require("../core/success.response")
const BrandService = require("../service/brand.service")
const ImageService = require("../service/image.service")


class ImageController {

    static async getImages(req, res) {
        const productId = req.params.productId
        const brands = await ImageService.getImages(productId)
        new OK({
            message: "Get images by products successfully",
            data: brands
        }).send(res)
    }
    static async getAllImages(req, res) {
        const images = await ImageService.getAllImages()
        new OK({
            message: "Get all images successfully",
            data: images
        }).send(res)
    }
    static async deleteImages(req, res) {
        const images = req.body
        const brands = await ImageService.deleteImages(images)
        new OK({
            message: "Delete images by products successfully",
            data: brands
        }).send(res)
    }
}
module.exports = ImageController