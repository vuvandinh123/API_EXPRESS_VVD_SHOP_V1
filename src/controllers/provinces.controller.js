const { OK } = require("../core/success.response")
const BrandService = require("../service/brand.service")
const NationService = require("../service/nation.service")
const ProvincesService = require("../service/provinces.service")


class ProvincesController {

    static async getAllProvinces(req, res) {
        const { nationId } = req.params
        const provinces = await ProvincesService.getAllProvinces({ nationId })
        new OK({
            message: "Get all provinces successfully",
            data: provinces
        }).send(res)
    }
}
module.exports = ProvincesController