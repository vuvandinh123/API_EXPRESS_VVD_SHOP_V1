const { BadRequestError } = require("../../core/error.response");
const knex = require("../../database/database");
const moment = require("moment")
class UserFollowRepository {
    static async countUserFollowShopStats({ shopId }) {
        const startDate = moment().startOf('day').toDate(); // Bắt đầu từ 00:00:00 của ngày hiện tại
        const endDate = moment().endOf('day').toDate(); // Kết thúc vào 23:59:59 của ngày hiện tại
        const follows = await knex("follows")
            .where("shop_id", shopId)
            .where("created_at", ">=", startDate)
            .andWhere("created_at", "<", endDate)
            .count("id as count").first()
        return follows
    }

}
module.exports = UserFollowRepository