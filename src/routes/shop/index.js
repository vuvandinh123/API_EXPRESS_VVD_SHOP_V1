'use strict'
const express = require('express');
const auth = require('../../middlewares/checkAdmin.js');
const checkAuthencation = require('../../middlewares/checkAuthencation.js');
const router = express.Router();

router.use('/auth', require('./auth.js'))
router.use('/uploads', require('./upload.js')) 
router.use(checkAuthencation)
router.use(auth.checkShop)
router.use('/products', require('./product.js'))
router.use('/brands', require('./brand.js'))
router.use('/inventory-logs', require('./inventoryLog.js'))
router.use('/categories', require('./categories.js'))
router.use('/specs', require('./spec.js'))
router.use('/images', require('./image.js'))
router.use('/discount', require('./discount.js'))
router.use('/promotions', require('./promotion.js'))
router.use('/shops', require('./shop.js'))
router.use('/follows', require('./follow.js'))
router.use('/orders', require("./order.js"))
router.use('/follows', require("./userFollow.js"))
router.use('/users', require("./users.js"))



module.exports = router