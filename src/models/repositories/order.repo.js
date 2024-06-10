const knex = require("../../database/database");

class OrderRepository {
  static async addOrderByUser({ data, userId }) {
    const payment = knex("orders").insert(data)
    return payment
  }
  static async getOrderByUser({ user, type = "ALL", search }) {
    const query = knex
      .from("orders")
      .select(
        "orders.order_date",
        "orders.id as order_id",
        "orders.discount_id",
        "orders.shop_id",
        "orders.payment_method",
        "orders.status",
        "orders.total_amount",
        "orders.payment_status",
        "orders.request_id",
        "order_details.product_id",
        "order_details.code",
        "order_details.quantity",
        "order_details.product_price",
        "products.name as product_name",
        "products.thumbnail",
        "products.slug",
        "products.quantity as product_quantity"
      )
      .where("orders.user_id", user.id)
      .join("order_details", "orders.id", "order_details.order_id")
      .join("products", "order_details.product_id", "products.id")
      .orderBy("orders.id", "desc")
      .offset(0).limit(10)
      ;
    if (type && type !== "ALL") {
      query.where("orders.status", type)
    }
    const order = await query
    const converData = order.reduce((acc, item) => {
      const shopId = item.shop_id
      const requestId = item.request_id + "-" + shopId
      if (!acc[requestId] || acc[requestId].id !== shopId) {
        acc[requestId] = {
          id: shopId,
          order_id: item.order_id,
          status: item.status,
          total_amount: item.total_amount,
          products: [],
        };
      }
      acc[requestId].products.push(item)
      return acc
    }, {})
    const formathdata = await Promise.all(Object.values(converData).map(async item => {
      const shop = await knex.from("shops").where("user_id", item.id).select("id", "name", "logo", "username").first();
      return {
        ...item,
        name: shop.name,
        logo: shop.logo,
        username: shop.username,
        products: [...item.products]
      }
    }))
    return formathdata
  }
  static async getOrderByRequestId({ orderId }) {
    const order = await knex
      .from("orders")
      .select("users.email", "orders.*")
      .where("orders.request_id", orderId)
      .join("users", "users.id", "orders.user_id")
      .first()
    return order
  }
  static async updateStatusPaymentSuccess({ orderId }) {
    const payment = knex
      .from("orders")
      .where("request_id	", orderId)
      .update({ payment_status: "paid" })
    return payment;
  }
  static async getOrderDiscount({ discountId, orderId }) {
    const orderDetail = await knex("order_details")
      .select(
        "products.id as product_id",
        "order_details.code",
        "order_details.quantity",
        "products.name",
        "products.thumbnail",
        "products.slug",
        knex.raw(`
        CASE
        WHEN promotions.type_price = 'fixed_price' THEN 
          CASE
            WHEN NOW() BETWEEN promotions.start_date AND promotions.end_date THEN products.price - promotions.price_sale
            ELSE products.price
          END
        WHEN promotions.type_price = 'percent' THEN 
          CASE
            WHEN NOW() BETWEEN promotions.start_date AND promotions.end_date THEN products.price * (1 - promotions.price_sale / 100)
            ELSE products.price
          END
        ELSE products.price
      END AS price
    `)
      )
      .join("products", "products.id", "order_details.product_id")
      .leftJoin("promotions", "promotions.product_id", "products.id")
      .whereIn("order_details.order_id", orderId)
      .orderBy("order_details.id")
      .groupBy(
        "products.id",
        "order_details.code",
        "order_details.id",
        "order_details.quantity",
        "products.name",
        "products.thumbnail",
        "products.slug",
        "promotions.type_price",
        "promotions.price_sale",
        "promotions.start_date",
        "promotions.end_date",
        "products.price"
      );

    // truy vấn lấy ra khuyến mại
    const discount = await knex("discounts")
      .leftJoin("discount_products", "discounts.id", "discount_products.discount_id")
      .whereIn("discounts.id", discountId)
      .select("discounts.id", "discounts.value", "discounts.type_price", "discount_products.product_id", "discounts.applies_to")
      .groupBy("discount_products.product_id", "discounts.id", "discounts.value", "discounts.type_price")
    // tinhs tôngri khuyen mai
    let totalDiscount = 0;
    let distCountShipping = 0;

    for (const discountItem of discount) {
      if (discountItem.applies_to === "all") {
        totalDiscount += discountItem.value
      }
      else {
        for (const orderItem of orderDetail) {
          if (discountItem.product_id === orderItem.product_id) {
            const amount = orderItem.price * orderItem.quantity;
            if (discountItem.type === "shipping") {
              discountItem.type_price === "percent"
                ? (distCountShipping += amount * (discountItem.value / 100))
                : (distCountShipping += discountItem.value);
            } else {
              discountItem.type_price === "percent"
                ? (totalDiscount += amount * (discountItem.value / 100))
                : (totalDiscount += discountItem.value);
            }
          }
        }
      }

    }
    return { totalDiscount, distCountShipping, orderDetail };
  }

}
module.exports = OrderRepository