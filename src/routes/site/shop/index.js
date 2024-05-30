'use strict'

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../../middlewares/asyncHandle');
const ShopController = require('../../../controllers/shop.controller');
const checkAuthencation = require('../../../middlewares/checkAuthencation');

// get
router.get('/shops/:shopId', asyncHandler(ShopController.getShopById))
router.use(checkAuthencation)
router.patch('/shops/follow/:shopId', asyncHandler(ShopController.toggleFollowShop))
router.get('/shops/is-follow/:shopId', asyncHandler(ShopController.getIsFollowShop))
module.exports = router