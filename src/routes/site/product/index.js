'use strict'

const express = require('express');
const router = express.Router();
const ProductController = require('../../../controllers/product.controller');
const asyncHandler = require('../../../middlewares/asyncHandle');

// get
router.get('/daily-discover', asyncHandler(ProductController.getDailyDiscoverProducts))
router.get('/hot_deals', asyncHandler(ProductController.getHotSaleProducts))
router.get('/:productId', asyncHandler(ProductController.getProductById))
module.exports = router