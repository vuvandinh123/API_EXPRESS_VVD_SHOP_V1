const knex = require("../../database/database");
const moment = require("moment");
const OderDetailRepository = require("./order_detail.repo");
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
        "order_details.id as order_detail_id",
        "order_details.product_price",
        "order_details.is_review",
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
          is_review: item.is_review,
          total_amount: item.total_amount,
          order_detail_id: item.order_detail_id,
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
  static async getOrderDiscount({ discountId, orderId, amount = 0 }) {
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
      .where("order_details.order_id", orderId)
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
      .where("discounts.id", discountId)
      .select("discounts.id", "discounts.value", "discounts.type_price", "discount_products.product_id", "discounts.applies_to")
      .groupBy("discount_products.product_id", "discounts.id", "discounts.value", "discounts.type_price").first();
    // tinhs tôngri khuyen mai
    console.log(discount);
    let totalDiscount = 0;
    let distCountShipping = 0;
    if (discount) {
      if (discount.applies_to === "all") {
        if (discount.type_price === "percent") {
          totalDiscount = amount * (discount.value / 100);
        } else {
          totalDiscount += discount.value
        }
      }
      else {
        for (const orderItem of orderDetail) {
          if (discount.product_id === orderItem.product_id) {
            const amount = orderItem.price * orderItem.quantity;
            if (discount.type === "shipping") {
              discount.type_price === "percent"
                ? (distCountShipping += amount * (discount.value / 100))
                : (distCountShipping += discount.value);
            } else {
              discount.type_price === "percent"
                ? (totalDiscount += amount * (discount.value / 100))
                : (totalDiscount += discount.value);
            }
          }
        }
      }
    }
    console.log(totalDiscount, distCountShipping, "hjj");

    return { totalDiscount, distCountShipping, orderDetail };
  }

  // shop
  static async getDashboradShop({ shopId }) {
    // Xác định thời gian bắt đầu và kết thúc của ngày
    const startDate = moment().startOf('day').toDate(); // Bắt đầu từ 00:00:00 của ngày hiện tại
    const endDate = moment().endOf('day').toDate(); // Kết thúc vào 23:59:59 của ngày hiện tại

    const results = await knex("orders")
      .select(
        knex.raw('COUNT(*) AS total_orders'),
        knex.raw('SUM(CASE WHEN status = "SUCCESS" THEN amount ELSE 0  END) AS total_success'),
        knex.raw('SUM(CASE WHEN status = "PENDING" THEN amount ELSE 0 END) AS total_pending'),
        knex.raw('COUNT(CASE WHEN status = "PENDING" THEN 1 END) AS new_orders_pending'),
        knex.raw('COUNT(CASE WHEN status = "SUCCESS" THEN 1 END) AS successful_orders')
      )
      .where("shop_id", shopId)
      .andWhere("order_date", ">=", startDate)
      .andWhere("order_date", "<=", endDate)
      .first();

    return results
  }
  static async getNewOrderIsPending({ shopId }) {
    const results = await OrderRepository.getOrder(shopId, { status: "PENDING" }).limit(5)
    return results
  }
  static getOrder(shopId, { status = "ALL" }) {
    const query = knex("orders")
      .select("orders.*", "discounts.value", "discounts.type_price")
      .where("orders.shop_id", shopId)
      .orderBy("orders.order_date", "desc")
      .leftJoin("discounts", "orders.discount_id", "discounts.id")
      .groupBy("orders.id", "discounts.value", "discounts.type_price");
    if (status !== "ALL")
      query.where("orders.status", status);
    return query
  }
  static async getAllOrderByShop({ shopId, offset, limit, ...params }) {
    const query1 = OrderRepository.getOrder(shopId, params).limit(limit).offset(offset);
    const query2 = OrderRepository.getOrder(shopId, params).count("orders.id as total").first();
    const result = await query1
    const countOrder = await query2
    return {
      data: result,
      total: countOrder?.total
    }
  }
  static async getOrderByIdShop({ shopId, orderId }) {
    const order = await knex("orders")
      .select([
        "users.firstName",
        "users.lastName",
        "users.email",
        "delivery_methods.description as delivery_methods",
        "delivery_methods.cost as delivery_cost",
        "orders.*",
        "discounts.value",
        "discounts.type_price",
        "discounts.applies_to",

      ])
      .where("orders.shop_id", shopId)
      .andWhere("orders.id", orderId)
      .join("delivery_methods", "orders.delivery_method_id", "delivery_methods.id")
      .join("users", "orders.user_id", "users.id")
      .leftJoin("discounts", "orders.discount_id", "discounts.id")
      .groupBy("orders.id", "users.firstName", "users.lastName", "users.email", "delivery_methods.description", "delivery_cost")
      .first();
    return order
  }

  static async updateStatusOrder({ orderId, shopId, status }) {
    const order = await knex
      .from("orders")
      .where("id", orderId)
      .andWhere("shop_id", shopId)
      .update({ status });
    return order
  }
  // admin
  static async getAllOrderByAdmin({ offset, limit, status, ...params }) {
    const query = knex("orders")
      .select("orders.*", "users.email", "users.firstName", "users.lastName", "shops.name as shop_name", "delivery_methods.cost as cost")
      .orderBy("order_date", "desc")
      .join("users", "orders.user_id", "users.id")
      .join("shops", "orders.shop_id", "shops.user_id")
      .join("delivery_methods", "orders.delivery_method_id", "delivery_methods.id")
      .limit(limit)
      .offset(offset)
      .groupBy("orders.id", "users.email", "users.firstName", "users.lastName", "shops.name", "delivery_methods.cost");
    const query2 = knex("orders").count("id as total")
    if (status !== "ALL") {
      query.where("orders.status", status);
      query2.where("orders.status", status);
    }
    const result = await query
    const countOrder = await query2.first();
    return {
      data: result,
      total: countOrder.total
    }
  }
  static async getOrderIdAdmin({ orderId }) {
    const order = await knex
      .from("orders")
      .select(
        "orders.*",
        "users.email",
        "user_address_orders.first_name",
        "user_address_orders.last_name",
        "users.image as logo_customer",
        "shops.name as shop_name",
        "shops.logo as shop_logo",
        "shops.rating as shop_rating",
        "shops.email as shop_email",
        "delivery_methods.cost as cost",
        "delivery_methods.description as deliver_name",
        "delivery_methods.estimated_time as estimated_time",
        "user_address_orders.address_detail",
        "nations.name as nation",
        "provinces.name as province",
        "user_address_orders.phone",
      )
      .where("orders.id", orderId)
      .leftJoin("users", "orders.user_id", "users.id")
      .join("user_address_orders", "orders.address_id", "user_address_orders.id")
      .join("nations", "user_address_orders.nation_id", "nations.id")
      .join("provinces", "user_address_orders.province_id", "provinces.id")
      .join("shops", "orders.shop_id", "shops.user_id")
      .join("delivery_methods", "orders.delivery_method_id", "delivery_methods.id")
      .leftJoin("discounts", "orders.discount_id", "discounts.id")
      .first();

    const orderDetail = await knex("order_details")
      .select([
        "order_details.*",
        "products.name as product_name",
        "products.thumbnail as product_thumbnail",
        "products.slug as product_slug",
        "products.id as product_id",
      ])
      .join("products", "order_details.product_id", "products.id")
      .where("order_details.order_id", orderId)
      .groupBy("order_details.id")
      .orderBy("order_details.id")
    return {
      ...order,
      order_detail: orderDetail
    }
  }
  static async changeStatusOrderAdmin({ orderId, status }) {
    const data = {
      status
    }
    if (status === "SUCCESS") {
      data.payment_status = "paid"
    }
    const order = await knex
      .from("orders")
      .where("id", orderId)
      .update(data);
    return order
  }
  static async getCountStatusOrder() {
    const response = await knex('orders')
      .select(
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
            ) AS TOTAL`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                WHERE status = 'PENDING'
            ) AS PENDING`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                 WHERE status = 'SUCCESS'
            ) AS SUCCESS`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                 WHERE status = 'CANCEL'
            ) AS CANCEL`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                 WHERE status = 'DELIVERED'
            ) AS DELIVERED`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                 WHERE status = 'SHIPPING'
            ) AS SHIPPING`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                WHERE  status = 'CONFIRMED'
            ) AS CONFIRMED`
        ),
      )
      .first();
    return response
  }
  static async getCountStatusOrderShop({ userId }) {
    const response = await knex('orders')
      .select(
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                WHERE shop_id = ${userId}
            ) AS TOTAL`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                WHERE shop_id = ${userId} AND status = 'PENDING'
            ) AS PENDING`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                WHERE shop_id = ${userId} AND status = 'CONFIRMED'
            ) AS CONFIRMED`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                WHERE shop_id = ${userId} AND status = 'SUCCESS'
            ) AS SUCCESS`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                WHERE shop_id = ${userId} AND status = 'CANCEL'
            ) AS CANCEL`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                WHERE shop_id = ${userId} AND status = 'DELIVERED'
            ) AS DELIVERED`
        ),
        knex.raw(
          `(
                SELECT COUNT(id)
                FROM orders
                WHERE shop_id = ${userId} AND status = 'SHIPPING'
            ) AS SHIPPING`
        )
      )
      .first();
    return response
  }
  static async getDashboradAdmin({ userId }) {
    const startDate = moment().startOf('day').toDate(); // Bắt đầu từ 00:00:00 của ngày hiện tại
    const endDate = moment().endOf('day').toDate(); // Kết thúc vào 23:59:59 của ngày hiện tại
    const query1 = knex("users")
      .andWhere("created_at", ">=", startDate)
      .andWhere("created_at", "<=", endDate)
      .count("id as count").first()
    const query2 = knex("orders")
      .select(
        knex.raw('COUNT(*) AS total_orders'),
        knex.raw('SUM(CASE WHEN status = "SUCCESS" THEN amount ELSE 0  END) AS total_success'),
        knex.raw('SUM(CASE WHEN status = "PENDING" THEN amount ELSE 0 END) AS total_pending'),
        knex.raw('COUNT(CASE WHEN status = "PENDING" THEN 1 END) AS new_orders_pending'),
        knex.raw('COUNT(CASE WHEN status = "SUCCESS" THEN 1 END) AS successful_orders')
      )
      .andWhere("order_date", ">=", startDate)
      .andWhere("order_date", "<=", endDate)
      .first();
    const [res1, res2] = await Promise.all([query1, query2])
    return {
      count_total_sigup: res1.count,
      ...res2
    }
  }
}
module.exports = OrderRepository