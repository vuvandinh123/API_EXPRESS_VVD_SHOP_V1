"use strict";

const FollowsRepository = require("../models/repositories/follows.repo");


class FollowsService {
  static async getUserFollowShopNew({ shopId,limit,offset }) {
    const shop = await FollowsRepository.getUserFollowShopNew({ shopId,limit,offset });
    return shop
  }

}
module.exports = FollowsService;
