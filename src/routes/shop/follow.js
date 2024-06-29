'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const BrandController = require('../../controllers/brand.controller');
const FollowsController = require('../../controllers/follows.controller');

const router = express.Router();
router.get('/shop', asyncHandler(FollowsController.getUserFollowShopNew))
module.exports = router