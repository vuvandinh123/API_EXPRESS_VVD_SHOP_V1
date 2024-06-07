"use strict";

const knex = require("../../database/database");

class ProvincesRepository {

    static async getAllProvinces({ nationId }) {
        return await knex("provinces").select("*").where("nation_id", nationId)
    }
}

module.exports = ProvincesRepository