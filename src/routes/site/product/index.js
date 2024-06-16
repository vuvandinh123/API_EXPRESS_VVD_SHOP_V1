'use strict'

const express = require('express');
const router = express.Router();
const ProductController = require('../../../controllers/product.controller');
const asyncHandler = require('../../../middlewares/asyncHandle');

// get
router.get('/daily-discover', asyncHandler(ProductController.getDailyDiscoverProducts))
router.get('/hot_deals', asyncHandler(ProductController.getHotSaleProducts))
router.get('/hot_category', asyncHandler(ProductController.getCategoryHot))
router.get('/randoms', asyncHandler(ProductController.getProductsRandom))
router.get("/search", asyncHandler(ProductController.searchProducts))
router.get('/:productId', asyncHandler(ProductController.getProductById))
router.get("/shop/:shopId", asyncHandler(ProductController.getProductUserShop))
router.get("/category/:categoryId", asyncHandler(ProductController.getProductsByCategory))
module.exports = router