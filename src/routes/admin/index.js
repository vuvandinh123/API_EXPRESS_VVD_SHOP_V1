'use strict'
const express = require('express');
const auth = require('../../middlewares/checkAdmin.js');
const checkAuthencation = require('../../middlewares/checkAuthencation.js');

const router = express.Router();
router.use(checkAuthencation)
router.use(auth.checkAdmin)
router.use('/shops', require('./shop.js'))
router.use('/products', require('./product'))
router.use('/categories', require('./category'))
router.use('/brands', require('./brand'))
router.use('/orders', require('./order'))
router.use('/users', require('./user'))



module.exports = router