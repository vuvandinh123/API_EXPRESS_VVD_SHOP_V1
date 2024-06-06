'use strict'
const express = require('express');
const ValidateController = require('../../controllers/validate.controller');
const asyncHandler = require('../../middlewares/asyncHandle');
const router = express.Router();
router.post('/check-email-exits', asyncHandler(ValidateController.checkEmailExits))

router.use('/products', require('./product'))
router.use('/discounts', require('./discount'))
router.use('/shops', require('./shop'))
router.use('/carts',require('./cart'))
router.use('/favourites',require('./favourite'))
router.use('/auth', require('./access'))



module.exports = router