const { OK } = require("../core/success.response")
const BrandService = require("../service/brand.service")
const FollowsService = require("../service/follows.service")
const { getParamsPagination } = require("../utils")


class FollowsController {

    static async getUserFollowShopNew(req, res) {
        const { page, limit = 5, offset } = getParamsPagination(req)
        const follows = await FollowsService.getUserFollowShopNew({ shopId: req.user.id, limit, offset })
        new OK({
            message: "Get all follows successfully",
            data: follows
        }).send(res)
    }
}
module.exports = FollowsController