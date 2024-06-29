const { OK } = require("../core/success.response")
const BrandService = require("../service/brand.service")
const UserService = require("../service/user.service")
const { getParamsPagination } = require("../utils")


class UserController {

    static async getUserByIdEdit(req, res) {
        const user = await UserService.getUserByIdEdit({ userId: req.user.id })
        new OK({
            message: "Get all user successfully",
            data: user
        }).send(res)
    }
    static async updateUser(req, res) {
        const data = req.body
        const user = await UserService.updateByUser(req.user.id, data)
        new OK({
            message: "Update user successfully",
            data: user
        }).send(res)
    }
    static async getChatsUserShop(req, res) {
        const { userIds } = req.body
        const user = await UserService.getChatsUserShop(userIds)
        new OK({
            message: "Update user successfully",
            data: user
        }).send(res)
    }
    static async getUserChatById(req, res) {
        const { id } = req.params
        const user = await UserService.getUserChatById(id)
        new OK({
            message: "Update user successfully",
            data: user
        }).send(res)
    }
    static async changePassword(req, res) {
        const data = req.body
        const user = await UserService.changePassword(req.user.id, data)
        new OK({
            message: "Update password successfully",
            data: user
        }).send(res)
    }
    static async getUserSignupNewAdmin(req, res) {
        const user = await UserService.getUserSignupNewAdmin()
        new OK({
            message: "Get all user successfully",
            data: user
        }).send(res)
    }
    static async getAllUserByAdmin(req, res) {
        const { offset, limit, page } = getParamsPagination(req)
        const { search } = req.query
        const { data, total } = await UserService.getAllUserByAdmin({ offset, limit, page, search })
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
            message: "Get all user successfully",
            data: data,
            options
        }).send(res)
    }
}
module.exports = UserController