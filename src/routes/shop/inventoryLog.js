'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const InventoryLogController = require('../../controllers/inventoryLog.controller');

const router = express.Router();
router.post('/inventory-logs', asyncHandler(InventoryLogController.createInventoryLog))
router.get('/variant-id/:productId', asyncHandler(InventoryLogController.getVariantFirebaseById))
router.get('/inventory-logs', asyncHandler(InventoryLogController.getAllInventoryLog))
router.get('/inventory-logs/amount', asyncHandler(InventoryLogController.getTotalAmountInventoryLog))
router.get('/inventory-logs/stats', asyncHandler(InventoryLogController.getInventoryStats))

router.get('/inventory-logs/:id', asyncHandler(InventoryLogController.getInventoryLogById))
module.exports = router