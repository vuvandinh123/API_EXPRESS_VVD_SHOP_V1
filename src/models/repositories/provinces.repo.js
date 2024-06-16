"use strict";

const knex = require("../../database/database");

class ProvincesRepository {

    static async getAllProvinces({ nationId }) {
        return await knex("provinces").select("*").where("nation_id", nationId)
    }
    static async getProvinceProducts({ nationId = 1 }) {
        const res = await knex("provinces")
            .select(
                "provinces.*",
                knex.raw(`(
            SELECT COUNT(DISTINCT products.id)
            FROM shops
            LEFT JOIN products ON products.shop_id = shops.user_id
            WHERE shops.province_id = provinces.id
              AND products.is_active = 2
              AND products.is_delete = 0
          ) as total_product`)
            )
            .groupBy("provinces.id").where("nation_id", nationId);

        return res

    }
}

module.exports = ProvincesRepository