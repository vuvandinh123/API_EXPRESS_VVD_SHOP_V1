'use strict'
const knex = require("../../database/database");

class UserRepository {

    // get user by email
    static async findUserByEmail(email) {
        return await knex.from("users").where({ email }).first()
    }
    static async findUserById(id) {
        return await knex.from("users").where({ id }).first()
    }
    // create email
    static async createUser({ firstName, lastName, email, password, image, type_login = "signup", email_verified = 0, role_id = 1,is_active = 1 }) {
        return await knex("users").insert({ firstName, lastName, email, type_login, password, role_id, image, email_verified,is_active, created_at: new Date() })
    }
    static async checkRoleUserId(userId) {
        const user = await knex.from("users").select("users.id", "users.email", "users.firstName", "users.lastName", "roles.name as role", "roles.permissions").join("roles", "users.role_id", "roles.id").where("users.id", userId).first()
        return user
    }
    static async patchActiveUser(userId) {
        return await knex("users").where("id", userId).update({ is_active: 1 })
    }
    static async patchEmailVerifiedUser(userId) {
        return await knex("users").where("id", userId).update({ email_verified: 1 })
    }
    static async updateUser(userId, data) {
        return await knex("users").where("id", userId).update(data)
    }
    static async patchPasswordUser({email, password}) {
        return await knex("users").where("email", email).update({ password })
    }
}
module.exports = UserRepository