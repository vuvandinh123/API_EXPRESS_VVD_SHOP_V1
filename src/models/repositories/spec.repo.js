const { BadRequestError } = require("../../core/error.response");
const knex = require("../../database/database");

class SpecRepository {
  static async createSpec(spec) {
    try {
      const newSpec = await knex("product_spec").insert(spec)
      return newSpec
    } catch (error) {
      throw BadRequestError("Failed to create spec")
    }
  }
  static async removeSpecProductId(id) {
    try {
      const data = await knex("product_spec").where("product_id", id).del()
      return data
    } catch (error) {
      throw BadRequestError("Failed to remove spec")
    }
  }
  static async getSpecByProductId(id) {
    try {
      const data = await knex.from("product_spec").where("product_id", id)
      return data
    } catch (error) {
      throw BadRequestError("Failed to get spec")
    }
  }
}
module.exports = SpecRepository