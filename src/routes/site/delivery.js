'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const DeliveryController = require('../../controllers/delivery.controller');
const router = express.Router();

router.get('/', asyncHandler(DeliveryController.getAllDelivery))


module.exports = router