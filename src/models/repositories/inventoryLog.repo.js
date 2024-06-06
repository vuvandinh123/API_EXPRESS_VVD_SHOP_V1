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
    const currentDate = moment();
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month();
    const currentWeek = currentDate.isoWeek();

    const calculateSums = (query) =>
      query
        .select(
          knex.raw('SUM(CASE WHEN type = "IN" THEN total ELSE 0 END) AS totalIncome'),
          knex.raw('SUM(CASE WHEN type = "OUT" THEN total ELSE 0 END) AS totalExpense')
        )
        .first();

    const query = knex('inventory_log').where('shop_id', shopId);
    const prevQuery = knex('inventory_log').where('shop_id', shopId);

    switch (compareWith) {
      case 'week':
        query.whereRaw('WEEK(created_at, 1) = ?', [currentWeek]);
        prevQuery.whereRaw('WEEK(created_at, 1) = ?', [currentWeek - 1]);
        break;
      case 'month':
        query.whereRaw('YEAR(created_at) = ? AND MONTH(created_at) = ?', [currentYear, currentMonth + 1]);
        prevQuery.whereRaw('YEAR(created_at) = ? AND MONTH(created_at) = ?', [currentYear, currentMonth]);
        break;
      default: // year
        query.whereRaw('YEAR(created_at) = ?', [currentYear]);
        prevQuery.whereRaw('YEAR(created_at) = ?', [currentYear - 1]);
    }

    const { totalIncome, totalExpense } = await calculateSums(query);
    const { totalIncome: prevTotalIncome, totalExpense: prevTotalExpense } = await calculateSums(prevQuery);

    const totalProductIventory = await knex('products')
      .where('shop_id', shopId)
      .where('is_delete', 0)
      .select(
        knex.raw('SUM(quantity) as total'),
        knex.raw('SUM(quantity * price) as total_price')
      )
      .first();

    const estimatedProfit = totalExpense - totalIncome;
    const estimatedProfitPrev = prevTotalExpense - prevTotalIncome;

    const calculatePercentChange = (currentValue, previousValue) =>
      previousValue === 0
        ? currentValue === 0 ? 0 : Infinity
        : ((currentValue - previousValue) / previousValue) * 100;

    return {
      totalIncome: {
        value: totalIncome,
        change: calculatePercentChange(totalIncome, prevTotalIncome)
      },
      totalExpense: {
        value: totalExpense,
        change: calculatePercentChange(totalExpense, prevTotalExpense)
      },
      estimatedProfit: {
        value: estimatedProfit,
        change: calculatePercentChange(estimatedProfit, estimatedProfitPrev)
      },
      totalProductIventory: totalProductIventory.total,
      totalPriceProductIventory: totalProductIventory.total_price
    };
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