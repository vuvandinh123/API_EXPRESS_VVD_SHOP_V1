'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const DiscountController = require('../../controllers/discount.controller');

const router = express.Router();

router.post('/discount', asyncHandler(DiscountController.createDiscountCode))
router.put('/discount/:discountId', asyncHandler(DiscountController.updateDiscountCode))
router.delete('/discount/:discountId', asyncHandler(DiscountController.deleteDiscount))
router.get('/discount', asyncHandler(DiscountController.getAllDiscountCodeOnShop))
router.get('/discount/trash', asyncHandler(DiscountController.getAllDiscountTrashCodeOnShop))
router.get('/discount/count-status', asyncHandler(DiscountController.getCountStatusDiscountCode))
router.get('/discount/:discountId', asyncHandler(DiscountController.getDiscountByIdOnShop))

// status
router.patch('/discount/change-status', asyncHandler(DiscountController.changeStatusDiscount))
router.patch('/discount/del', asyncHandler(DiscountController.deleteToTrashDiscount))

module.exports = router