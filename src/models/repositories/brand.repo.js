const knex = require("../../database/database");

class BrandRepository {
    static async getAllBrand() {
      const brands = knex.select("id", "name").from("brands")
      return brands
    }
    static async getBrandByCategoryId(categoryId) {
      const brands = knex.select("id", "name").from("brands").where("category_id", categoryId)
      return brands
    }
}
module.exports = BrandRepository