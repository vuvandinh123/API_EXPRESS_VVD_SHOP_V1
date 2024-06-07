"use strict";

const knex = require("../../database/database");

class DeliveryRepository {

    // nations
    static async getAllDelivery() {
        return await knex("delivery_methods").select("*")
    }
}

module.exports = DeliveryRepository