'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const PromotionController = require('../../controllers/promotion.controller');

const router = express.Router();
router.get('/promotions', asyncHandler(PromotionController.getAllpromotion))
router.post('/promotions', asyncHandler(PromotionController.createPromotion))
router.put('/promotions/:promotionId', asyncHandler(PromotionController.updatePromotion))
router.get('/promotions/products', asyncHandler(PromotionController.getAllProductsOnPromotion))

// status
router.get('/promotions/count-status', asyncHandler(PromotionController.getCountStatusPromotion))
router.patch('/promotions/change-status', asyncHandler(PromotionController.changeStatusPromotion))

router.get('/promotions/:promotionId', asyncHandler(PromotionController.getPromotionById))
router.patch('/promotions/del', asyncHandler(PromotionController.deleteToTrashPromotion))
module.exports = router