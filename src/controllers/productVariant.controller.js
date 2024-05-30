const { OK } = require("../core/success.response")
const ProductVariantService = require("../service/productVariant.service")



class ProductVariantController {
    
    static async createProductVariant(req, res) {
        const variant = req.body
        const variants = await ProductVariantService.createProductVariant(variant)
        new OK({
            message: "Create variant successfully",
            data: variants
        }).send(res)
    }
    static async deleteProductVariant(req,res){
        const variantId = req.params.variantId
        const variants = await ProductVariantService.deleteProductVariant(variantId)
        new OK({
            message: "Delete variant successfully",
            data: variants
        }).send(res)
    }
}
module.exports = ProductVariantController