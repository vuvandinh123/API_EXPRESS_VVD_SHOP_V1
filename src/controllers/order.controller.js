const { OK } = require("../core/success.response")
const OrderService = require("../service/order.service")
const crypto = require('crypto');
const https = require('https');
const jwt = require('jsonwebtoken');
const OrderRepository = require("../models/repositories/order.repo");
class OrderController {

    static async addOrderByUser(req, res) {
        const body = req.body
        const delivery = await OrderService.addOrderByUser({ data: body, user: req.user })
        new OK({
            message: "Get all delivery successfully",
            data: delivery
        }).send(res)
    }
    static async getOrderByUser(req, res) {
        const { type } = req.query
        const orders = await OrderService.getOrderByUser({ user: req.user, type })
        new OK({
            message: "Get all delivery successfully",
            data: orders
        }).send(res)
    }
    static async gengerateOrderCode(req, res) {
        const code = await OrderService.gengerateOrderCode({ data: req.body, user: req.user })
        new OK({
            message: "Get all delivery successfully",
            data: code
        }).send(res)
    }

    static async checkPaymentMomo(req, res) {
        const {
            orderId,
            resultCode,
            message
        } = req.query;
        const isOrder = await OrderRepository.getOrderByRequestId({ orderId });
        if (!isOrder) {
            res.send({
                message: "Order not found",
                data: {
                    success: false,
                }
            })
            return;
        }
        if (resultCode === "0" && message === "Successful.") {
            await OrderService.updateStatusPaymentSuccess({ orderId });
            OrderService.sendEmailOrder({ email: isOrder.email, requestId: orderId });
            res.redirect("http://localhost:5173/cart?success=true");
            return;
        }
        else {
            res.send({
                message: "Invalid signature",
                data: {
                    success: false,
                }
            })
        }

    }
    static async paymentOrderWithMoMo(req, res) {

        if (!req.payment) return res.send({ message: "Payment not found" })
        var partnerCode = "MOMO";
        var accessKey = "F8BBA842ECF85";
        var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        var requestId = req.payment.requestId;
        var orderId = requestId;
        var orderInfo = "Thanh toán với Momo";
        var redirectUrl = "http://localhost:8080/v1/momo/ipn";
        var ipnUrl = "http://localhost:8080/momo/ipn";
        var amount = Math.round(req?.payment?.amount).toString();
        var requestType = "captureWallet"
        var extraData = ""; //pass empty value if your merchant does not have stores

        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
        //signature
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        console.log(signature, "signature v1 - 1");

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'en'
        });
        //Create the HTTPS objects
        const https = require('https');
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        const momoRequest = https.request(options, momoRes => {

            momoRes.setEncoding('utf8');
            let rawData = '';
            momoRes.on('data', (chunk) => {
                rawData += chunk;
            });
            momoRes.on('end', () => {
                console.log('No more data in response.');
                console.log('Body: ', rawData);
                const momoResponse = JSON.parse(rawData);
                console.log('resultCode: ', momoResponse.resultCode);

                // Chuyển hướng người dùng đến trang thanh toán của MoMo
                if (momoResponse.resultCode === 0) {
                    res.redirect(momoResponse.payUrl);
                } else {
                    res.status(400).json({ success: false, message: 'Payment failed', data: momoResponse });
                }
            });
        });
        momoRequest.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

        console.log("Sending....");
        momoRequest.write(requestBody);
        momoRequest.end();
    }
}
module.exports = OrderController