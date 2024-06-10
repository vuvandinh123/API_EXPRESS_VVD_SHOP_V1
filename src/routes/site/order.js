'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const OrderController = require('../../controllers/order.controller');
const checkAuthencation = require('../../middlewares/checkAuthencation');
const checkPayment = require('../../middlewares/checkPayment');
const router = express.Router();
router.use(checkAuthencation)
router.post('/', asyncHandler(OrderController.addOrderByUser))
router.post('/momo', asyncHandler(OrderController.gengerateOrderCode))
router.get('/user',asyncHandler(OrderController.getOrderByUser))


module.exports = router