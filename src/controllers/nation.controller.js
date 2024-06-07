const { OK } = require("../core/success.response")
const BrandService = require("../service/brand.service")
const NationService = require("../service/nation.service")


class NationController {

    static async getAllNation(req, res) {
        const nations = await NationService.getAllNations()
        new OK({
            message: "Get all nations successfully",
            data: nations
        }).send(res)
    }
}
module.exports = NationController