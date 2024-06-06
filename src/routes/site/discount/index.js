'use strict'

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../../middlewares/asyncHandle');
const DiscountController = require('../../../controllers/discount.controller');
const checkAuthencation = require('../../../middlewares/checkAuthencation');

// get
router.get('/product/:productId', asyncHandler(DiscountController.getAllDiscountCodeByProductId))
router.get('/type-all/:shopId', asyncHandler(DiscountController.getAllDiscountCodeTypeAll))
router.use(checkAuthencation)

router.post('/add', asyncHandler(DiscountController.usedCodeAndVerify))
module.exports = router