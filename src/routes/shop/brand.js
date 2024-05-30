'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const BrandController = require('../../controllers/brand.controller');

const router = express.Router();
router.get('/brands/categories/:categoryId', asyncHandler(BrandController.getBrandByCategoryId))
module.exports = router