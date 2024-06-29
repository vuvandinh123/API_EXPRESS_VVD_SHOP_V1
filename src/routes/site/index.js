'use strict'
const express = require('express');
const ValidateController = require('../../controllers/validate.controller');
const asyncHandler = require('../../middlewares/asyncHandle');
const router = express.Router();
router.post('/check-email-exits', asyncHandler(ValidateController.checkEmailExits))

router.use('/products', require('./product'))
router.use('/discounts', require('./discount'))
router.use('/shops', require('./shop'))
router.use('/carts', require('./cart'))
router.use('/favourites', require('./favourite'))
router.use('/nations', require('./nation'))
router.use('/provinces', require('./provinces'))
router.use('/address-user', require('./userAddressOrder'))
router.use('/delivery', require('./delivery'))
router.use('/orders', require('./order'))
router.use('/user', require('./user'))
router.use('/categories', require('./category'))
router.use('/auth', require('./access'))
router.use('/comments', require('./comment'))
router.use('/upload', require('./upload'))




module.exports = router