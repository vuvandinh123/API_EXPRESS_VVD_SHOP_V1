'use strict'
const express = require('express');
const crypto = require('crypto');
const https = require('https');
const checkPermission = require('../middlewares/checkPermission');
const checkApiKey = require('../middlewares/checkApiKey');
const router = express.Router();
router.get('/test', (req, res) => {
    // Lấy các tham số từ yêu cầu (req.body, req.query, ...)

    // Xử lý thanh toán với MoMo
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    // ... (các tham số khác)
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var amount = '50000';
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&paymentCode=${paymentCode}&requestId=${requestId}`;

    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        autoCapture,
        extraData,
        paymentCode,
        orderGroupId,
        signature
    });

    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/pos',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    const momoRequest = https.request(options, momoRes => {
        console.log(`Status: ${momoRes.statusCode}`);
        console.log(`Headers: ${JSON.stringify(momoRes.headers)}`);
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

    // Trả về phản hồi cho client
    // res.status(200).json({ message: 'Processing payment' });
})

router.use(checkApiKey)
router.use(checkPermission("0000"))
router.use('/api/shop/', require('./shop'))
router.use('/api/', require('./site'))
// router.use('/api/admin/', require('./admin'))




module.exports = router