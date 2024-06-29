'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const UserAddressOrderController = require('../../controllers/userAddressOrder.controller');
const checkAuthencation = require('../../middlewares/checkAuthencation');
const router = express.Router();


router.use(checkAuthencation)
router.get('/', asyncHandler(UserAddressOrderController.getAllAddressByUser))
router.post('/', asyncHandler(UserAddressOrderController.createAddressOrder))
router.put('/:addressId', asyncHandler(UserAddressOrderController.updateAddressOrderByUser))
router.delete('/:addressId', asyncHandler(UserAddressOrderController.deleteAddressOrderByUser))
module.exports = router