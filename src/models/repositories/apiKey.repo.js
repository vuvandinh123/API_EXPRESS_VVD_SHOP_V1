const knex = require("../../database/database")

class ApiKeyRepository {
    static async getApiKey(key){
        const data = await knex.from("api_keys").where("_key", key).where("status", 1).first()
        return data
    }
    static async createApiKey(apiKey) {
        const data = {
            key: apiKey
        }
        const insert = knex.from("api_keys").insert(data)
        return insert
    }
}
module.exports = ApiKeyRepository