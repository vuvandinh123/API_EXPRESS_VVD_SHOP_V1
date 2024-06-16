'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ShopController = require('../../controllers/shop.controller');

const router = express.Router();
router.get('/:userId', asyncHandler(ShopController.getShopByUserId))

module.exports = router