"use strict";
const { BadRequestError } = require("../core/error.response");
const knex = require("../database/database");
const OderRepository = require("../models/repositories/order.repo");
const OderDetailRepository = require("../models/repositories/order_detail.repo");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const checkOrderEmail = require("../utils/checkOrderEmail");
const { sendNodemail } = require("../utils");
const moment = require("moment");
const OrderRepository = require("../models/repositories/order.repo");
const ProductRepository = require("../models/repositories/product.repo");
class OrderService {


  // lấy tất cả đơn hàng cho người dùng
  static async getOrderByUser({ user, type }) {
    return OderRepository.getOrderByUser({ user, type });
  }


  static async addOrderByUser({ data, user, requestId = "HOME" + new Date().getTime() }) {
    const { checkout, orders = [] } = data;
    let ids = [];
    let productIds = [];
    console.log(data,"dete");
    for (const orderData of orders) {
      if (orderData.order.products.length > 0) {
        let totalDiscount = 0;
        const delivery = await knex("delivery_methods").select("*").where({ id: checkout.delivery_id }).first()
        if (orderData.order.discount) {
          const type_price = orderData.order.discount.type_price;
          const value = Number(orderData.order.discount?.value);
          totalDiscount = type_price === "fixed_amount" ? orderData.order.discount.value : (value / 100) * orderData.order.amount
        }
        const ordersInsert = {
          user_id: user.id,
          shop_id: orderData.order.shopId,
          delivery_method_id: checkout.delivery_id,
          address_id: checkout.address_id,
          discount_id: orderData.order.discount ? orderData.order.discount.id : null,
          payment_method: checkout.payment_method,
          status: "PENDING",
          request_id: requestId,
          amount: orderData.order.amount,
          total_amount: orderData.order.amount - totalDiscount + Number(delivery?.cost || 0),
        };
        // thêm đơn hàng mới cho từng shops
        const newOrder = await OderRepository.addOrderByUser({ data: ordersInsert });
        ids.push(newOrder[0]);
        const orderItemInsert = orderData.order.products.map(item => ({
          order_id: newOrder[0],
          product_price: item.price,
          product_id: item.id,
          code: item.code || null,
          quantity: item.quantity,
        }));
        const updateProductQuantities = orderItemInsert.map(item =>
          ProductRepository.updateProductSold(item.product_id, item.quantity)
        );
        const res = await Promise.all([
          OderDetailRepository.addOrderDetailByUser({ data: orderItemInsert }),
          Promise.all(updateProductQuantities),
        ])
      }
    }

    return ids;
  }
  static async createNewOrder({ data, user, requestId = "HOME" + new Date().getTime() }) {
    const ids = await this.addOrderByUser({ data, user, requestId })
    ids.map((id) => {
      this.sendEmailOrder({ orderId: id, email: user.email });
    })
    return ids
  }
  static async sendEmailOrder({ email, orderId }) {

    const order = await knex("orders").select("*").where({ id: orderId }).first()
    const discountId = order.discount_id
    const addressId = order.address_id;
    const deliveryId = order.delivery_method_id;

    const shop = await knex("shops").select("shops.*", "provinces.name as province_name").where("shops.user_id", order.shop_id)
      .leftJoin("provinces", "shops.province_id", "provinces.id")
      .first()
    const { totalDiscount, distCountShipping, orderDetail } = await OrderRepository.getOrderDiscount({ discountId, orderId, amount: order.amount })
    // truy vấn lấy ra địa chỉ người đặt hàng
    const address_user = await knex("user_address_orders")
      .select("user_address_orders.*", "provinces.name as province_name", "nations.name as nation_name")
      .where("user_address_orders.id", addressId)
      .join("provinces", "user_address_orders.province_id", "provinces.id")
      .join("nations", "user_address_orders.nation_id", "nations.id")
      .first()

    // truy vấn lấy ra phí vận chuyển
    const costShipping = await knex("delivery_methods").select("cost").where({ id: deliveryId }).first()

    // tổng đơn hàng đã trừ khuyến mại và phí vận chuyển
    // const total_amount = amount - totalDiscount + (costShipping.cost - distCountShipping)
    const formOrder = {
      request_id: order.id,
      cost: costShipping.cost - distCountShipping,
      shop_name: shop?.name,
      shop_province: shop?.province_name,
      discount: totalDiscount,
      amount: order.amount,
      total_amount: order.total_amount,
      isPaid: order.payment_method === "deliver" ? false : true,
      order_date: moment().format("hh:mm DD-MM-YYYY"),
      payment_method: order.payment_method,
      address_detail: address_user.address_detail,
      name: (address_user?.last_name + " " + address_user?.first_name)?.toUpperCase(),
      nation_name: address_user.nation_name,
      province_name: address_user.province_name,
    }
    const html = checkOrderEmail({ data: orderDetail, order: formOrder })
    sendNodemail({ email: email, title: `VVD SHOP | ĐƠN HÀNG #${order.id} THÀNH CÔNG `, html: html })
  }
  static async gengerateOrderCode({ data, user }) {
    const requestId = "MOMO" + new Date().getTime();
    const ids = await this.addOrderByUser({ data, user, requestId })
    if (!ids) {
      throw new BadRequestError("Create order failed")
    }
    const orders = await knex("orders").select("*").where({ request_id: requestId })
    const total_amount = orders.reduce((total, item) => total + item.total_amount, 0)
    const dataNew = {
      amount: total_amount,
      user_id: user.id,
      requestId: requestId,
      orderIds: ids,
      timestamp: Date.now()
    }
    const secretKey = crypto.randomBytes(24).toString('hex')
    const token = jwt.sign(dataNew, secretKey, { expiresIn: '1h' });
    return {
      token: token,
      secretKey: secretKey
    }
  }
  static async updateStatusPaymentSuccess({ orderId }) {
    return await OderRepository.updateStatusPaymentSuccess({ orderId })
  }
  // shop
  static async getDashboradShop({ shopId }) {
    return await OderRepository.getDashboradShop({ shopId })
  }
  static async getAllOrderByShop({ shopId, limit, offset, ...params }) {
    return await OrderRepository.getAllOrderByShop({ shopId, limit, offset,...params })
  }
  static async getOrderByIdShop({ orderId, shopId }) {
    const res = await OrderRepository.getOrderByIdShop({ orderId, shopId })
    const orderDetail = await OderDetailRepository.getOrderDetailByOrderId({ orderId })
    return { ...res, products: orderDetail }
  }
  static async updateStatusOrder({ orderId, shopId, status }) {
    const res = await OrderRepository.updateStatusOrder({ orderId, shopId, status })
    const order = await OrderRepository.getOrderByIdShop({ orderId, shopId })

    if (status === "CANCEL") {
      const html = `
    <p>Đơn hàng #${order.id} đã bị hủy</p>
    <p><a href="http://localhost:5173/user/purchase">XEM ĐƠN HÀNG</a></p>
    `
      sendNodemail({ email: order.email, title: "Vu Dinh Shop - ĐƠN HÀNG CỦA BẠN ĐÃ BỊ HỦY", html: html })
    } else if (status === "CONFIRMED") {
      const html = `
      <p>Đơn hàng #${order.id} đã được xác nhận </p>
      <p><a href="http://localhost:5173/user/purchase">XEM ĐƠN HÀNG</a></p>
      `
      sendNodemail({ email: order.email, title: "Vu Dinh Shop - ĐƠN HÀNG CỦA BẠN ĐÃ ĐƯỢC XÁC NHẬN", html: html })
    }
    return res;
  }
  static async getNewOrderIsPending({ shopId }) {
    return await OrderRepository.getNewOrderIsPending({ shopId })
  }
  static async getAllOrderByAdmin({ limit, offset, status }) {
    return await OrderRepository.getAllOrderByAdmin({ limit, offset, status })
  }
  static async getOrderIdAdmin({ orderId }) {
    return await OrderRepository.getOrderIdAdmin({ orderId })
  }
  static async changeStatusOrderAdmin({ orderId, status }) {
    return await OrderRepository.changeStatusOrderAdmin({ orderId, status })
  }
  static async getCountStatusOrderAdmin() {
    return await OrderRepository.getCountStatusOrder()
  }
  static async getCountStatusOrderShop({ userId }) {
    return await OrderRepository.getCountStatusOrderShop({ userId })
  }
  static async getDashboradAdmin({ userId }) {
    return await OrderRepository.getDashboradAdmin({ userId })
  }
}
module.exports = OrderService;
