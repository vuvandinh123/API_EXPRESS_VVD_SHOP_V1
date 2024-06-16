const knex = require("../../database/database");

class OderDetailRepository {

  
  static async addOrderDetailByUser({ data, userId }) {
    const order = await knex("order_details").insert(data)
    return order
  }
  static async getOrderDetailByOrderId({ orderId }) {
    const order = await knex("order_details")
    .select([
      "order_details.id",
      "products.name",
      "products.thumbnail",
      "products.slug",
      "order_details.code",
      "order_details.quantity",
      "order_details.product_price as price",
    ])
    .where("order_id", orderId)
    .join("products", "order_details.product_id", "products.id")
    .orderBy("order_details.id")
    return order
  }

}
module.exports = OderDetailRepository