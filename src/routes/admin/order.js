'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const OrderController = require('../../controllers/order.controller');

const router = express.Router();

router.get('/', asyncHandler(OrderController.getAllOrderByAdmin))
router.get('/stats', asyncHandler(OrderController.getDashboradAdmin))
router.patch('/change-status', asyncHandler(OrderController.changeStatusOrderAdmin))
router.get('/count-status', asyncHandler(OrderController.getCountStatusOrderAdmin))
router.get('/:orderId', asyncHandler(OrderController.getOrderIdAdmin))

module.exports = router