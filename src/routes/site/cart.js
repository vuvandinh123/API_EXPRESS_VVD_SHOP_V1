"use strict"

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const checkAuthencation = require('../../middlewares/checkAuthencation');
const CartController = require('../../controllers/cart.controller');
const router = express.Router();

router.use(checkAuthencation)
router.get('/', asyncHandler(CartController.getCart))
router.post('/update', asyncHandler(CartController.updateCart))
router.delete('/:cart_item_id', asyncHandler(CartController.removeCartItem))
// router.get('/carts/:productId', asyncHandler(CartController.getCartByProductId))
router.post('/', asyncHandler(CartController.addToCart))
router.patch('/', asyncHandler(CartController.changeQuantityCartItem))
module.exports = router