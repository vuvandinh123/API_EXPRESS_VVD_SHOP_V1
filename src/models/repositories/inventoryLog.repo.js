const moment = require("moment");
const firebase = require("../../configs/firebase.config");
const knex = require("../../database/database");

class InventoryLogRepository {

  static async createInventoryLog(data, user) {
    const inven = {
      shop_id: user.id,
      note: data.note,
      quantity: data.quantity,
      total: data.total,
    }
    const inventory = await knex("inventory_log").insert(inven)
    return inventory
  }
  static async getAllInventoryLog({ limit, offset, month }, user) {
    const currentYearMonth = moment().format('YYYY-MM');
    const [year, month2] = month ? month.split('-') : currentYearMonth.split('-');

    // Truy vấn lấy dữ liệu chi tiết
    let dataQuery = knex.from("inventory_log").where("shop_id", user.id);
    if (year && month2) {
      dataQuery = dataQuery.whereRaw('YEAR(created_at) = ? AND MONTH(created_at) = ?', [year, month2]);
    }

    const inventory = await dataQuery
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    // Truy vấn để đếm tổng số hàng
    let countQuery = knex.from("inventory_log").where("shop_id", user.id);
    if (year && month2) {
      countQuery = countQuery.whereRaw('YEAR(created_at) = ? AND MONTH(created_at) = ?', [year, month2]);
    }
    const totalInven = await countQuery.count("id as total");
    return {
      total: totalInven[0].total,
      data: inventory
    };
  }
  static async getTotalAmountInventoryLog(user) {
    const results = await knex('inventory_log')
      .select(
        knex.raw(`
                SUM(CASE WHEN DATE(created_at) = CURDATE() THEN total ELSE 0 END) AS total_by_day,
                SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) THEN total ELSE 0 END) AS total_by_week,
                SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE()) THEN total ELSE 0 END) AS total_by_month,
                SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN total ELSE 0 END) AS total_by_year
            `)
      )
      .where("shop_id", user.id)
      .first();
    return results
  }
  static async getInventoryLogById(id, user) {
    const inventory = await knex("inventory_log").where("id", id).where("shop_id", user.id).first()
    const product = await knex("product_inventory")
      .where("inventory_id", id)
      .select("products.name", "products.thumbnail","products.slug", "product_inventory.*")
      .join("products", "product_inventory.product_id", "products.id")
    // .groupBy("products.name", "products.thumbnail", "product_inventory.*")
    return { ...inventory, product }
  }

  static async createProductInventoryLog(data) {
    const inventory = await knex("product_inventory").insert(data)
    return inventory
  }

  static async getVariantFirebaseById(id) {
    const variant = await firebase.collection("variant").doc(id.toString()).get()
    return variant
  }

}
module.exports = InventoryLogRepository