"use strict";

const knex = require("../../database/database");

class UserAddressOrderRepository {

    static async getAllAddressByUser({ userId }) {
        return await knex("user_address_orders")
        .select("user_address_orders.*", "provinces.name as province_name", "nations.name as nation_name")
        .where("user_id", userId)
        .join("provinces", "user_address_orders.province_id", "provinces.id")
        .join("nations", "user_address_orders.nation_id", "nations.id")
    }
    static async createAddressOrderByUser({ data, userId }) {
        const formathData = {
            user_id: userId,
            province_id: data.province_id,
            nation_id: data.nation_id,
            address_detail: data.address_detail,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            is_default: data.is_default || 0
        }
        return await knex("user_address_orders").insert(formathData)
    }
}

module.exports = UserAddressOrderRepository