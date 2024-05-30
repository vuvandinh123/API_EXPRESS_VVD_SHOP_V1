'use strict';

const knex = require("../../database/database");

class RoleRepository {
    static async getRole() {
        const role = await knex('roles').select('*')
        return role
    }

    static async getRoleById(roleId) {
        const role = await knex('roles').select('*').where('id', roleId).first()
        return role
    }
}
module.exports = RoleRepository