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
      type: data.type || "IN",
    }
    const inventory = await knex("inventory_log").insert(inven)
    return inventory
  }
  static async getAllInventoryLog({ limit, offset, month }, user, type = "IN") {
    const currentYearMonth = moment().format('YYYY-MM');
    const [year, month2] = month ? month.split('-') : currentYearMonth.split('-');

    // Truy vấn lấy dữ liệu chi tiết
    let dataQuery = knex.from("inventory_log").where("shop_id", user.id).where("type", type);
    if (year && month2) {
      dataQuery = dataQuery.whereRaw('YEAR(created_at) = ? AND MONTH(created_at) = ?', [year, month2]);
    }

    const inventory = await dataQuery
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    // Truy vấn để đếm tổng số hàng
    let countQuery = knex.from("inventory_log").where("shop_id", user.id).where("type", type);;
    if (year && month2) {
      countQuery = countQuery.whereRaw('YEAR(created_at) = ? AND MONTH(created_at) = ?', [year, month2]);
    }
    const totalInven = await countQuery.count("id as total");
    return {
      total: totalInven[0].total,
      data: inventory
    };
  }
  static async getTotalAmountInventoryLog(type = "IN", user) {
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
      .where("type", type)
      .first();
    return results
  }
  static async getInventoryStats(shopId, compareWith = 'week') {
    const now = moment();
    let year = now.year();
    let month = now.month();
    let week = now.week();
    const query = knex('inventory_log')
      .where('shop_id', shopId)
      .select(
        knex.raw('SUM(CASE WHEN type = "IN" THEN total ELSE 0 END) AS totalIncome'),
        knex.raw('SUM(CASE WHEN type = "OUT" THEN total ELSE 0 END) AS totalExpense')
      );
    const queryPrev = knex('inventory_log')
      .where('shop_id', shopId)
      .select(
        knex.raw('SUM(CASE WHEN type = "IN" THEN total ELSE 0 END) AS totalIncome'),
        knex.raw('SUM(CASE WHEN type = "OUT" THEN total ELSE 0 END) AS totalExpense')
      );
    if (compareWith === 'week') {
      query.whereRaw('YEARWEEK(created_at, 1) = ?', [week]);
      queryPrev.whereRaw('YEARWEEK(created_at, 1) = ?', [week - 1]);
    } else if (compareWith === 'month') {
      query.whereRaw('YEAR(created_at) = ? AND MONTH(created_at) = ?', [year, month + 1]);
      queryPrev.whereRaw('YEAR(created_at) = ? AND MONTH(created_at) = ?', [year, month]);
    } else { // year
      query.whereRaw('YEAR(created_at) = ?', [year]);
      queryPrev.whereRaw('YEAR(created_at) = ?', [year - 1]);
    }

    const results = await query;
    const resultsPrev = await queryPrev;
    //  tổng sản phẩm trong kho
    const totalProductIventory = await knex("products").select(knex.raw("SUM(quantity) as total"),knex.raw("SUM(quantity * price) as total_price")).where("shop_id", shopId).where("is_delete", 0);
    // current
    const totalIncome = results[0].totalIncome || 0;
    const totalExpense = results[0].totalExpense || 0;
    const estimatedProfit = totalExpense - totalIncome

    // previous
    const totalIncomePrev = resultsPrev[0].totalIncome
    const totalExpensePrev = resultsPrev[0].totalExpense
    const estimatedProfitPrev = totalExpensePrev - totalIncomePrev

    // calculate percent change
    const totalIncomeChange = this.calculatePercentChange(totalIncome, totalIncomePrev)
    const totalExpenseChange = this.calculatePercentChange(totalExpense, totalExpensePrev)
    const estimatedProfitChange = this.calculatePercentChange(estimatedProfit, estimatedProfitPrev)

    const data = {
      totalIncome: {
        value: totalIncome,
        change: totalIncomeChange
      },
      totalExpense: {
        value: totalExpense,
        change: totalExpenseChange
      },
      estimatedProfit: {
        value: estimatedProfit,
        change: estimatedProfitChange
      },
      totalProductIventory: totalProductIventory[0].total,
      totalPriceProductIventory: totalProductIventory[0].total_price
    }
    return data
  }

  static calculatePercentChange(currentValue, previousValue) {
    if (previousValue === 0) {
      return currentValue === 0 ? 0 : Infinity;
    }
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  // Các hàm lấy thống kê cho tuần, tháng, năm trước
  static async getStats(startOfPeriod, endOfPeriod, shopId) {
    const results = await knex('inventory_log')
      .where('shop_id', shopId)
      .whereBetween('created_at', [startOfPeriod, endOfPeriod])
      .select(
        knex.raw('SUM(CASE WHEN type = "IN" THEN total ELSE 0 END) AS totalIncome'),
        knex.raw('SUM(CASE WHEN type = "OUT" THEN total ELSE 0 END) AS totalExpense')
      );
    return results
  }
  static async getInventoryLogById(id, user) {
    const inventory = await knex("inventory_log").where("id", id).where("shop_id", user.id).first()
    const product = await knex("product_inventory")
      .where("inventory_id", id)
      .select("products.name", "products.thumbnail", "products.slug", "product_inventory.*")
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