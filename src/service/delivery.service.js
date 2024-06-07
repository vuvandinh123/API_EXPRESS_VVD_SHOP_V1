"use strict";

const DeliveryRepository = require("../models/repositories/delivery.repo");


class DeliveryService {
  static async getAllDelivery() {
    const delivery = await DeliveryRepository.getAllDelivery();
    return delivery
  }

}
module.exports = DeliveryService;
