const knex = require("../../database/database");

class OderDetailRepository {

  
  static async addOrderDetailByUser({ data, userId }) {
    const brands = await knex("order_details").insert(data)
    return brands
  }

}
module.exports = OderDetailRepository