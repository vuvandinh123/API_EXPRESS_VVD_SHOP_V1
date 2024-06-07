const { OK, CREATED } = require("../core/success.response")
const UserAddressOrderService = require("../service/userAddressOrder.service")


class UserAddressOrderController {

    static async getAllAddressByUser(req, res) {
        const address = await UserAddressOrderService.getAllAddressByUser({
            userId: req.user.id
        })
        new OK({
            message: "Get all address successfully",
            data: address
        }).send(res)
    }
    static async createAddressOrder(req, res) {
        const address = await UserAddressOrderService.createAddressOrderByUser({
            data: req.body,
            userId: req.user.id
        })
        new CREATED({   
            message: "Create address successfully",
            data: address
        }).send(res)
    }
}
module.exports = UserAddressOrderController