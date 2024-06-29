const { OK, CREATED } = require("../core/success.response")
const BrandService = require("../service/brand.service")
const { getParamsPagination } = require("../utils")


class BrandController {

    static async getBrandByCategoryId(req, res) {
        const categoryId = req.params.categoryId
        const brands = await BrandService.getBrandByCategoryId(categoryId)
        new OK({
            message: "Get all brands successfully",
            data: brands
        }).send(res)
    }
    static async getAllBrand(req, res) {
        const { page, offset, limit } = getParamsPagination(req)
        const { search, active, sortBy } = req.query
        const { data, total } = await BrandService.getAllBrand({ limit, offset, search, active, sortBy })
        const totalPage = Math.ceil(total / limit);
        const options = {
            count: total,
            pagination: {
                totalPage,
                page,
                limit
            }
        };
        new OK({
            message: "Get all brands successfully",
            data,
            options
        }).send(res)
    }
    static async changeStatusBrand(req, res) {
        const { listId, value } = req.body
        const brand = await BrandService.changeStatusBrand({ listId, value })
        new OK({
            message: "Change status brand code successfully",
            data: brand
        }).send(res)
    }
    static async getCountStatusBrand(req, res) {
        const count = await BrandService.getCountStatusBrand()
        new OK({
            message: "Get count status brand successfully",
            data: count
        }).send(res)
    }
    static async deleteBrand(req, res) {
        const { listId } = req.body
        const brand = await BrandService.deleteBrand({ listId })
        new OK({
            message: "Delete brand successfully",
            data: brand
        }).send(res)
    }
    static async createBrand(req, res) {
        const data = req.body
        const brand = await BrandService.createBrand({ data })
        new CREATED({
            message: "Create brand successfully",
            data: brand
        }).send(res)
    }
}
module.exports = BrandController