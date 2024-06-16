'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const DiscountController = require('../../controllers/discount.controller');

const router = express.Router();

router.post('/', asyncHandler(DiscountController.createDiscountCode))
router.put('/:discountId', asyncHandler(DiscountController.updateDiscountCode))
router.delete('/:discountId', asyncHandler(DiscountController.deleteDiscount))
router.get('/', asyncHandler(DiscountController.getAllDiscountCodeOnShop))
router.get('/trash', asyncHandler(DiscountController.getAllDiscountTrashCodeOnShop))
router.get('/count-status', asyncHandler(DiscountController.getCountStatusDiscountCode))
router.get('/:discountId', asyncHandler(DiscountController.getDiscountByIdOnShop))

// status
router.patch('/change-status', asyncHandler(DiscountController.changeStatusDiscount))
router.patch('/del', asyncHandler(DiscountController.deleteToTrashDiscount))

module.exports = router