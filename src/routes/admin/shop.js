'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ShopController = require('../../controllers/shop.controller');

const router = express.Router();

router.get('/', asyncHandler(ShopController.getAllShopByAdmin))
router.patch('/change-status', asyncHandler(ShopController.changeStatusShop))

module.exports = router