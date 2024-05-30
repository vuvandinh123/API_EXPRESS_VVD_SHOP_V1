const { OK } = require("../core/success.response")
const BrandService = require("../service/brand.service")


class BrandController {

    static async getBrandByCategoryId(req, res) {
        const categoryId = req.params.categoryId
        const brands = await BrandService.getBrandByCategoryId(categoryId)
        new OK({
            message: "Get all brands successfully",
            data: brands
        }).send(res)
    }
}
module.exports = BrandController