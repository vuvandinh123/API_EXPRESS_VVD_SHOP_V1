const { OK } = require("../core/success.response")
const BrandService = require("../service/brand.service")
const DeliveryService = require("../service/delivery.service")
const NationService = require("../service/nation.service")


class DeliveryController {

    static async getAllDelivery(req, res) {
        const delivery = await DeliveryService.getAllDelivery()
        new OK({
            message: "Get all delivery successfully",
            data: delivery
        }).send(res)
    }
}
module.exports = DeliveryController