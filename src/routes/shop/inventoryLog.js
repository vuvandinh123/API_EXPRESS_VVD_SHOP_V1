'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const InventoryLogController = require('../../controllers/inventoryLog.controller');

const router = express.Router();
router.post('/', asyncHandler(InventoryLogController.createInventoryLog))
router.get('/variant-id/:productId', asyncHandler(InventoryLogController.getVariantFirebaseById))
router.get('/', asyncHandler(InventoryLogController.getAllInventoryLog))
router.get('/amount', asyncHandler(InventoryLogController.getTotalAmountInventoryLog))
router.get('/stats', asyncHandler(InventoryLogController.getInventoryStats))

router.get('/:id', asyncHandler(InventoryLogController.getInventoryLogById))
module.exports = router