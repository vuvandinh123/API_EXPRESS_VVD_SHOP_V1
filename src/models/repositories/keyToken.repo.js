'use strict'

const knex = require("../../database/database")

class KeyTokenService{

    static async createKeyToken(data){
        return await knex.from("key_tokens").insert(data)
    }
    static async updateKeyToken(userId,data){
        return await knex.from("key_tokens").where("user_id",userId).update(data)
    }
    static async findKeyTokenByUserId(userId){
        return await knex.from("key_tokens").where("user_id",userId).first()
    }
    static async deleteKeyToken(id){
        return await knex.from("key_tokens").where("id",id).del()
    }
}
module.exports = KeyTokenService