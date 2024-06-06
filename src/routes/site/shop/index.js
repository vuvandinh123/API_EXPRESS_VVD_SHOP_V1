'use strict'

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../../middlewares/asyncHandle');
const ShopController = require('../../../controllers/shop.controller');
const checkAuthencation = require('../../../middlewares/checkAuthencation');

// get
router.get('/:shopId', asyncHandler(ShopController.getShopById))
router.use(checkAuthencation)
router.get('/is-follow/:shopId', asyncHandler(ShopController.getIsFollowShop))
router.patch('/follow/:shopId', asyncHandler(ShopController.toggleFollowShop))
module.exports = router