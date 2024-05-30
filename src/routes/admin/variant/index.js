'use strict'

const express = require('express');
const asyncHandler = require('../../../middlewares/asyncHandle');
const VariantController = require('../../../controllers/variant.controller');
const router = express.Router();
router.get('/variants', asyncHandler(VariantController.getAllVariants))
router.get('/variants/:id', asyncHandler(VariantController.getVariants))
router.get('/categories/variants/:categoryId', asyncHandler(VariantController.getVariantByCategory))
router.get('/products/variants/:productId', asyncHandler(VariantController.getVariantByProduct))
router.post('/variants', asyncHandler(VariantController.createVariant))
router.put('/variants/:variantId', asyncHandler(VariantController.updateVariant))
router.delete('/variants/:variantId', asyncHandler(VariantController.deleteVariant))
module.exports = router