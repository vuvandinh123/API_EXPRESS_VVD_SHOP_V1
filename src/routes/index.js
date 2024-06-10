'use strict'
const express = require('express');
const crypto = require('crypto');
const https = require('https');
const checkPermission = require('../middlewares/checkPermission');
const checkApiKey = require('../middlewares/checkApiKey');
const OrderController = require('../controllers/order.controller');
const asyncHandler = require('../middlewares/asyncHandle');
const checkPayment = require('../middlewares/checkPayment');
const router = express.Router();

router.get('/momo', checkPayment, asyncHandler(OrderController.paymentOrderWithMoMo))
router.get('/momo/ipn', asyncHandler(OrderController.checkPaymentMomo))

router.use(checkApiKey)
router.use(checkPermission("0000"))
router.use('/api/shop/', require('./shop'))
router.use('/api/', require('./site'))
// router.use('/api/admin/', require('./admin'))




module.exports = router