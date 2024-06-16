'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const OrderController = require('../../controllers/order.controller');

const router = express.Router();
router.get('/stats', asyncHandler(OrderController.getDashboradShop))
router.get("/", asyncHandler(OrderController.getAllOrderByShop))
router.get("/:orderId", asyncHandler(OrderController.getOrderByIdShop))
router.patch("/status", asyncHandler(OrderController.updateStatusOrder))
module.exports = router