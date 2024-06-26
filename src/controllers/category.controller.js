const { OK, CREATED } = require("../core/success.response");
const CategoryService = require("../service/category.service")
const { getParamsPagination } = require("../utils")


class CategoryController {


    // user

    static async getAllCategory(req, res) {
        const categories = await CategoryService.getAllCategory()
        new OK({
            message: "Get all categories successfully",
            data: categories
        }).send(res)
    }
    static async getCategoryFilter(req, res) {
        const { categoryId } = req.params
        const categories = await CategoryService.getCategoryFilter({ categoryId })
        new OK({
            message: "Get all categories successfully",
            data: categories
        }).send(res)
    }
    static async getAllCategoryShow(req, res) {
        const categories = await CategoryService.getAllCategoryShow()
        new OK({
            message: "Get all categories successfully",
            data: categories
        }).send(res)
    }
    static async getCategoryById(req, res) {
        const { categoryId } = req.params
        const categories = await CategoryService.getCategoryById({ categoryId })
        new OK({
            message: "Get all categories successfully",
            data: categories
        }).send(res)
    }
    static async getCategoryInShop(req, res) {
        const { shopId } = req.params
        const categories = await CategoryService.getCategoryInShop({ shopId: shopId })
        new OK({
            message: "Get all categories successfully",
            data: categories
        }).send(res)
    }



    // lấy tất cả danh mục và phân trang 
    static async getAllCategoryOnShop(req, res) {
        const { limit, offset, page } = getParamsPagination(req);
        const { search, active, sortBy } = req.query
        const { data, total } = await CategoryService.getAllCategoryOnShop({ shopId: req.user.id, limit, offset, search, active, sortBy })

        // Calculate total number of pages
        const totalPage = Math.ceil(total / limit);
        // Construct options object
        const options = {
            count: total,
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
    // lấy tất cả danh mục để hiển thị chức năng select chọn trên trên các liên kết đến như sản phẩm
    static async getAllCategorySelect(req, res) {
        const categories = await CategoryService.getAllCategorySelect({ shopId: req.user.id })
        new OK({
            message: "Get all categories successfully",
            data: categories
        }).send(res)
    }
    static async getCategoryIdByShop(req, res) {
        const categoryId = req.params.categoryId
        const category = await CategoryService.getCategoryIdByShop({ categoryId })
        new OK({
            message: "Get category successfully",
            data: category
        }).send(res)
    }
    static async getCountStatusCategory(req, res) {
        const count = await CategoryService.getCountStatusCategory()
        new OK({
            message: "Get count status category successfully",
            data: count
        }).send(res)
    }
    static async getAllCategoryAdminSelect(req, res) {
        const categories = await CategoryService.getAllCategoryAdminSelect()
        new OK({
            message: "Get all categories successfully",
            data: categories
        }).send(res)
    }
    static async createCategory(req, res) {
        const category = await CategoryService.createCategory(req.body, req.user.id)
        new CREATED({
            message: "Create category successfully",
            data: category
        }).send(res)
    }
    static async updateCategory(req, res) {
        const categoryId = req.params.categoryId
        const category = await CategoryService.updateCategory(categoryId, req.body)
        new OK({
            message: "Update category successfully",
            data: category
        }).send(res)
    }
    static async changeStatusCategory(req, res) {
        const { listId, value } = req.body
        const category = await CategoryService.changeStatusCategory({ listId, value })
        new OK({
            message: "Change status category code successfully",
            data: category
        }).send(res)
    }
    static async deleteCategory(req, res) {
        const { listId } = req.body
        const category = await CategoryService.deleteCategory({ listId })
        new OK({
            message: "Delete category successfully",
            data: category
        }).send(res)
    }
    static async getAllCategoryWithParentId(req, res) {
        const categoryId = req.params.categoryId
        const category = await CategoryService.getAllCategoryWithParentId({ categoryId })
        new OK({
            message: "Get all category with parent id successfully",
            data: category
        }).send(res)
    }
    static async getAllCategoryByAdmin(req, res) {
        const { limit, offset, page } = getParamsPagination(req);
        const { search, active, sortBy } = req.query
        const { data, total } = await CategoryService.getAllCategoryByAdmin({ limit, offset, search, active, sortBy })
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
            message: "Get all categories successfully",
            data: data,
            options
        }).send(res)
    }


}

module.exports = CategoryController