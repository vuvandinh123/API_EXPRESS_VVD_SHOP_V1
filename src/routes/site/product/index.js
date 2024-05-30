'use strict'

const express = require('express');
const router = express.Router();
const ProductController = require('../../../controllers/product.controller');
const asyncHandler = require('../../../middlewares/asyncHandle');

// get
router.get('/products/daily-discover', asyncHandler(ProductController.getDailyDiscoverProducts))
router.get('/products/hot-sale', asyncHandler(ProductController.getHotSaleProducts))
router.get('/products/:productId', asyncHandler(ProductController.getProductById))
module.exports = router