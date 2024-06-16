"use strict";

const UserFollowRepository = require("../models/repositories/user_follow.repo");


class UserFollowService {
  static async countUserFollowShopStats({ shopId }) {
    const count = await UserFollowRepository.countUserFollowShopStats({ shopId });
    return count
  }

}
module.exports = UserFollowService;
