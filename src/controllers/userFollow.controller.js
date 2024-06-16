const { OK } = require("../core/success.response")
const UserFollowService = require("../service/userFollow.service")


class UserFollowController {

    static async countUserFollowShopStats(req, res) {
        const follow = await UserFollowService.countUserFollowShopStats({ shopId: req.user.id })
        new OK({
            message: "Get count follow successfully",
            data: follow
        }).send(res)
    }
}
module.exports = UserFollowController