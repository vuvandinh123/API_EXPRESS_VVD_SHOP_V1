const knex = require("../../database/database");

class FollowsRepository {
  static async getUserFollowShopNew({ shopId, limit = 5 }) {
    const follow = knex.select([
      "users.id",
      "users.firstName",
      "users.lastName",
      "users.email",
      "users.phone",
      "users.image",
      "users.created_at",
    ]).from("follows")
      .join("users", "users.id", "follows.user_id")
      .where("follows.shop_id", shopId)
      .orderBy("follows.created_at", "desc").limit(limit)
    return follow
  }
  static async getBrandByCategoryId(categoryId) {
    const brands = knex.select("id", "name").from("brands").where("category_id", categoryId)
    return brands
  }
}
module.exports = FollowsRepository