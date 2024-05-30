'use strict'

const express = require('express');
const asyncHandler = require('../../../middlewares/asyncHandle');
const ProductVariantController = require('../../../controllers/productVariant.controller');

const router = express.Router();
router.post('/products/variants', asyncHandler(ProductVariantController.createProductVariant))
router.delete('/products/variants/:variantId', asyncHandler(ProductVariantController.deleteProductVariant))

module.exports = router