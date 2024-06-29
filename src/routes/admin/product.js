'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ProductController = require('../../controllers/product.controller');

const router = express.Router();

router.get('/', asyncHandler(ProductController.getAllProductsByAdmin))

module.exports = router