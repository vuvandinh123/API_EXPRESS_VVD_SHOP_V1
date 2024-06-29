'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const OrderController = require('../../controllers/order.controller');

const router = express.Router();
router.get('/stats', asyncHandler(OrderController.getDashboradShop))
router.get("/status/pending-new", asyncHandler(OrderController.getNewOrderIsPending))
router.get('/count-status', asyncHandler(OrderController.getCountStatusOrderShop))
router.get("/", asyncHandler(OrderController.getAllOrderByShop))
router.get("/:orderId", asyncHandler(OrderController.getOrderByIdShop))
router.patch("/status", asyncHandler(OrderController.updateStatusOrder))

module.exports = router