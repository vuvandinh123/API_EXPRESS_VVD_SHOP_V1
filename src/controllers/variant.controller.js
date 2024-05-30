'use strict'

const { OK } = require("../core/success.response")
const VariantService = require("../service/variant.service")

class VariantController {

    static async getAllVariants(req,res){
        const variants = await VariantService.getAllVariants()
        new OK({
            message: "Get all variants successfully",
            data: variants
        }).send(res)
    }
    static async getVariantByCategory(req,res){
        const categoryId = req.params.categoryId
        const variants = await VariantService.getVariantByCategory(categoryId)
        new OK({
            message: "Get variants by category successfully",
            data: variants
        }).send(res)
    }
    static async getVariantByProduct(req,res){
        const productId = req.params.productId
        const variants = await VariantService.getVariantByProduct(productId)
        new OK({
            message: "Get variants by product successfully",
            data: variants
        }).send(res)
    }
    static async getVariants(req,res){
        const id = req.params.id
        const variants = await VariantService.getVariants(id)
        new OK({
            message: "Get variants successfully",
            data: variants
        }).send(res)
    }
    static async createVariant(req,res){
        const variant = req.body
        const variants = await VariantService.createVariant(variant)
        new OK({
            message: "Create variant successfully",
            data: variants
        }).send(res)
    }
    static async updateVariant(req,res){
        const variantId = req.params.variantId
        const variant = req.body
        const variants = await VariantService.updateVariant(variantId,variant)
        new OK({
            message: "Update variant successfully",
            data: variants
        }).send(res)
    }
    static async deleteVariant(req,res){
        const variantId = req.params.variantId
        const variants = await VariantService.deleteVariant(variantId)
        new OK({
            message: "Delete variant successfully",
            data: variants
        }).send(res)
    }
}
module.exports = VariantController