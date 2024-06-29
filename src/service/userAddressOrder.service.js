"use strict";

const BrandRepository = require("../models/repositories/brand.repo");
const NationRepository = require("../models/repositories/nations.repo");
const UserAddressOrderRepository = require("../models/repositories/user_address_order.repo");


class UserAddressOrderService {
  static async getAllAddressByUser({ userId }) {
    const nations = await UserAddressOrderRepository.getAllAddressByUser({ userId });
    return nations
  }
  static async createAddressOrderByUser({ data, userId }) {
    const address = await UserAddressOrderRepository.createAddressOrderByUser({ data, userId });
    return address
  }

  static async deleteAddressOrderByUser({ id }) {
    const address = await UserAddressOrderRepository.deleteAddressByUser({ id });
    return address
  }

  static async updateAddressOrderByUser({ id, data }) {
    const address = await UserAddressOrderRepository.updateAddressByUser({ id, data });
    return address
  }

}
module.exports = UserAddressOrderService;
