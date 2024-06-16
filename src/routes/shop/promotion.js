'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const PromotionController = require('../../controllers/promotion.controller');

const router = express.Router();
router.get('/', asyncHandler(PromotionController.getAllpromotion))
router.post('/', asyncHandler(PromotionController.createPromotion))
router.put('/:promotionId', asyncHandler(PromotionController.updatePromotion))
router.get('/products', asyncHandler(PromotionController.getAllProductsOnPromotion))

// status
router.get('/count-status', asyncHandler(PromotionController.getCountStatusPromotion))
router.patch('/change-status', asyncHandler(PromotionController.changeStatusPromotion))

router.get('/:promotionId', asyncHandler(PromotionController.getPromotionById))
router.patch('/del', asyncHandler(PromotionController.deleteToTrashPromotion))
module.exports = router