'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ShopController = require('../../controllers/shop.controller');

const router = express.Router();
router.get('/:userId', asyncHandler(ShopController.getShopByUserId))
router.get('/find/:shopId', asyncHandler(ShopController.getShopId))
router.post('/change-password', asyncHandler(ShopController.changePasswordByShop))
module.exports = router