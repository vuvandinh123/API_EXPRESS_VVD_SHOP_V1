const { OK, CREATED } = require("../core/success.response")
const DiscountService = require("../service/discount.service")
const { getParamsPagination } = require("../utils")


class DiscountController {

    // user
    static getAllDiscountCodeByProductId = async (req, res) => {
        const productId = req.params.productId
        const shopId = req.query.shop
        console.log(productId, shopId);
        const data = await DiscountService.getAllDiscountCodeByProductId({ productId, shopId })
        new OK({
            message: "Get all discount code on shop successfully",
            data,
        }).send(res)
    }
    static getAllDiscountCodeTypeAll = async (req, res) => {
        const { shopId } = req.params
        const data = await DiscountService.getAllDiscountCodeTypeAll({ shopId })
        new OK({
            message: "Get all discount code on shop successfully",
            data,
        }).send(res)
    }
    static async usedCodeAndVerify(req, res) {
        const { code, shop_id } = req.body
        const discount = await DiscountService.usedCodeAndVerify({ code, shop_id }, req.user)
        new OK({
            message: "success",
            data: discount
        }).send(res)
    }
    static async createDiscountCode(req, res) {
        const body = req.body
        const discount = await DiscountService.createDiscountCode(body, req.user)
        new CREATED({
            message: "Create discount code successfully",
            data: discount
        }).send(res)
    }
    // update
    static async updateDiscountCode(req, res) {
        const id = req.params.discountId
        const body = req.body
        const discount = await DiscountService.updateDiscountCode(id, body, req.user)
        new OK({
            message: "Update discount code successfully",
            data: discount
        }).send(res)
    }
    // get all discount code on shop
    static async getAllDiscountCodeOnShop(req, res) {
        const { limit, offset, page } = getParamsPagination(req);
        const { search, active, sortBy, status } = req.query
        const { data, total } = await DiscountService.getAllDiscountCodeOnShop({ shopId: req.user.id, limit, offset, search, active, sortBy, status })

        // Calculate total number of pages
        const totalPage = Math.ceil(total / limit);
        // Construct options object
        const options = {
            countProduct: total,
            pagination: {
                totalPage,
                page,
                limit
            }
        };
        new OK({
            message: "Get all discount code on shop successfully",
            data,
            options
        }).send(res)
    }
    static async getAllDiscountTrashCodeOnShop(req, res) {
        const { limit, offset, page } = getParamsPagination(req);
        const { data, total } = await DiscountService.getAllDiscountTrashCodeOnShop({ shopId: req.user.id, limit, offset, search: req.query.search })

        // Calculate total number of pages
        const totalPage = Math.ceil(total / limit);
        // Construct options object
        const options = {
            countProduct: total,
            pagination: {
                totalPage,
                page,
                limit
            }
        };
        new OK({
            message: "Get all trash discount code on shop successfully",
            data,
            options
        }).send(res)
    }
    // delete product ids to discount
    static async deleteDiscountToTrash(req, res) {
        const id = req.params.discountId
        const discount = await DiscountService.deleteDiscountToTrash(id)
        new OK({
            message: "Delete product ids to discount successfully",
            data: discount
        }).send(res)
    }
    static async deleteDiscount(req, res) {
        const id = req.params.discountId
        const discount = await DiscountService.deleteDiscount(id)
        new OK({
            message: "Delete discount successfully",
            data: discount
        }).send(res)
    }
    // patch discount active
    static async patchDiscountActive(req, res) {
        const id = req.params.discountId
        const discount = await DiscountService.patchDiscountActive(id)
        new OK({
            message: "Patch discount active successfully",
            data: discount
        }).send(res)
    }
    // patch discount unactive
    static async patchDiscountUnActive(req, res) {
        const id = req.params.discountId
        const discount = await DiscountService.patchDiscountUnActive(id)
        new OK({
            message: "Patch discount unactive successfully",
            data: discount
        }).send(res)
    }
    //patch discount restore
    static async patchDiscountRestore(req, res) {
        const id = req.params.discountId
        const discount = await DiscountService.patchDiscountRestore(id)
        new OK({
            message: "Patch discount restore successfully",
            data: discount
        }).send(res)
    }
    static async getDiscountByIdOnShop(req, res) {
        const id = req.params.discountId
        const discount = await DiscountService.getDiscountByIdOnShop({ id, shopId: req.user.id })
        new OK({
            message: "Get discount by id on shop successfully",
            data: discount
        }).send(res)
    }
    static async getCountStatusDiscountCode(req, res) {
        const discount = await DiscountService.getCountStatusDiscountCode({ shopId: req.user.id })
        new OK({
            message: "Get count status discount code successfully",
            data: discount
        }).send(res)
    }
    static async changeStatusDiscount(req, res) {
        const { listId, value } = req.body
        const discount = await DiscountService.changeStatusDiscount({ listId, value, shopId: req.user.id })
        new OK({
            message: "Change status discount code successfully",
            data: discount
        }).send(res)
    }
    static async deleteToTrashDiscount(req, res) {
        const { listId, value } = req.body
        const discount = await DiscountService.deleteToTrashDiscount({ listId, shopId: req.user.id })
        new OK({
            message: "Change status discount code successfully",
            data: discount
        }).send(res)
    }
}
module.exports = DiscountController