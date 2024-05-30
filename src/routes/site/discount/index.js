'use strict'

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../../middlewares/asyncHandle');
const DiscountController = require('../../../controllers/discount.controller');
const checkAuthencation = require('../../../middlewares/checkAuthencation');

// get
router.get('/discounts/product/:productId', asyncHandler(DiscountController.getAllDiscountCodeByProductId))

router.use(checkAuthencation)

router.post('/discounts/add', asyncHandler(DiscountController.usedCodeAndVerify))
module.exports = router