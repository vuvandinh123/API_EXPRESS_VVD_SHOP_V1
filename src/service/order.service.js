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
class OrderService {


  // lấy tất cả đơn hàng cho người dùng
  static async getOrderByUser({ user,type }) {
    return OderRepository.getOrderByUser({ user,type });
  }


  static async addOrderByUser({ data, user, requestId = "HOME" + new Date().getTime() }) {
    const { checkout, orders = [] } = data;

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

        const orderItemInsert = orderData.order.products.map(item => ({
          order_id: newOrder[0],
          product_price: item.price,
          product_id: item.id,
          code: item.code || null,
          quantity: item.quantity,
        }));
        // thêm đơn hàng của người dùng
        await OderDetailRepository.addOrderDetailByUser({ data: orderItemInsert });
      }
    }
    // Gửi email khi đặt hàng thành công
    this.sendEmailOrder({ requestId, email: user.email });
    return data;
  }
  static async sendEmailOrder({ email, requestId }) {

    const orders = await knex("orders").select("*").where({ request_id: requestId })
    const orderId = orders.map(item => item.id)
    const discountId = orders.map(item => item.discount_id).filter(item => item != null)
    const addressId = orders[0].address_id;
    const deliveryId = orders[0].delivery_method_id;
    // 
    const { totalDiscount, distCountShipping, orderDetail } = await OrderRepository.getOrderDiscount({ discountId, orderId })

    // truy vấn lấy ra địa chỉ người đặt hàng
    const address_user = await knex("user_address_orders")
      .select("user_address_orders.*", "provinces.name as province_name", "nations.name as nation_name")
      .where("user_address_orders.id", addressId)
      .join("provinces", "user_address_orders.province_id", "provinces.id")
      .join("nations", "user_address_orders.nation_id", "nations.id")
      .first()

    // truy vấn lấy ra phí vận chuyển
    const costShipping = await knex("delivery_methods").select("cost").where({ id: deliveryId }).first()

    // tinh tong don hang chưa khuyến mại va phi vân chuyển
    const amount = orderDetail.reduce((total, item) => total + item.price * item.quantity, 0)

    // tổng đơn hàng đã trừ khuyến mại và phí vận chuyển
    const total_amount = amount - totalDiscount + (costShipping.cost - distCountShipping)
    const formOrder = {
      request_id: requestId,
      cost: costShipping.cost - distCountShipping,
      discount: totalDiscount,
      amount: amount,
      total_amount: orders[0].payment_method === "deliver" ? total_amount : 0,
      isPaid: orders[0].payment_method === "deliver" ? false : true,
      order_date: moment().format("hh:mm DD-MM-YYYY"),
      payment_method: orders[0].payment_method,
      address_detail: address_user.address_detail,
      name: (address_user?.last_name + " " + address_user?.first_name)?.toUpperCase(),
      nation_name: address_user.nation_name,
      province_name: address_user.province_name,
    }
    const html = checkOrderEmail({ data: orderDetail, order: formOrder })
    sendNodemail({ email: email, title: "VVD SHOP | ĐẶT HÀNG THÀNH CÔNG ", html: html })
  }
  static async gengerateOrderCode({ data, user }) {
    const requestId = "MOMO" + new Date().getTime();
    const checkout = await this.addOrderByUser({ data, user, requestId })
    if (!checkout) {
      throw new BadRequestError("Create order failed")
    }
    const orders = await knex("orders").select("*").where({ request_id: requestId })

    const orderId = orders.map(item => item.id)
    const discountId = orders.map(item => item.discount_id).filter(item => item != null)

    const { totalDiscount, distCountShipping } = await OrderRepository.getOrderDiscount({ discountId, orderId })
    const secretKey = crypto.randomBytes(24).toString('hex')
    const total = data.orders.reduce((total, item) => total + item.order.amount, 0)
    const delivery = await knex("delivery_methods").select("*").where({ id: data.checkout.delivery_id }).first()
    const total_amount = total + Number(delivery.cost) - totalDiscount - distCountShipping;
    const dataNew = {
      amount: total_amount,
      user_id: user.id,
      requestId: requestId,
      timestamp: Date.now()
    }
    const token = jwt.sign(dataNew, secretKey, { expiresIn: '1h' });
    return {
      token: token,
      secretKey: secretKey
    }
  }
  static async updateStatusPaymentSuccess({ orderId }) {
    return await OderRepository.updateStatusPaymentSuccess({ orderId })
  }
}
module.exports = OrderService;
