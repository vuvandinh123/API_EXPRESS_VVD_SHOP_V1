const knex = require('../database/database');
class Product {
    static async getAll() {
        return knex.select('*').from("products")
    }
    static async countProducts() {
        const total = await knex.from("products").count('* as total')
        return total[0].total
    }
    static async countProductsByCategory(categoryId) {
        return knex.from("products").count('* as total').where("category_id", categoryId)
    }
}
module.exports = Product