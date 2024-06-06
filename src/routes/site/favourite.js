"use strict"

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const checkAuthencation = require('../../middlewares/checkAuthencation');
const FavouriteController = require('../../controllers/favourite.controller');
const router = express.Router();

router.use(checkAuthencation)
router.get('/', asyncHandler(FavouriteController.getFavourite))
router.delete('/:productId', asyncHandler(FavouriteController.removeToFavourite))
router.post('/', asyncHandler(FavouriteController.addToFavourite))
module.exports = router