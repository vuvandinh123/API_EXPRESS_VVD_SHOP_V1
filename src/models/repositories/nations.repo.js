"use strict";

const knex = require("../../database/database");
const { converProductsToResponse2 } = require("../../utils");

class NationRepository {

    // nations
    static async getAllNations() {
        return await knex("nations").select("*")
    }
}

module.exports = NationRepository