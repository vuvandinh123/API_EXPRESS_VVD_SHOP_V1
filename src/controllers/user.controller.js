const { OK } = require("../core/success.response")
const BrandService = require("../service/brand.service")
const UserService = require("../service/user.service")


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
}
module.exports = UserController