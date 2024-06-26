'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ShopController = require('../../controllers/shop.controller');

const router = express.Router();
router.post('/add-shop', asyncHandler(ShopController.createShop))
router.post('/verify-email-shop', asyncHandler(ShopController.verifyEmailRegisterShop))



module.exports = router