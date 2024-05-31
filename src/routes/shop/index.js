'use strict'
const express = require('express');
const auth = require('../../middlewares/checkAdmin.js');
const checkAuthencation = require('../../middlewares/checkAuthencation.js');
const router = express.Router();

router.use('/', require('./auth.js'))
router.use(checkAuthencation)
router.use(auth.checkShop)
router.use('/', require('./product.js'))
router.use('/', require('./brand.js'))
router.use('/', require('./inventoryLog.js'))
router.use('/', require('./categories.js'))
router.use('/', require('./upload.js'))
router.use('/', require('./spec.js'))
router.use('/', require('./image.js'))
router.use('/', require('./discount.js'))
router.use('/', require('./promotion.js'))
router.use('/', require('./shop.js'))



module.exports = router