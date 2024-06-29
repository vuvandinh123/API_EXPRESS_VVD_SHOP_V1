'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const BrandController = require('../../controllers/brand.controller');

const router = express.Router();
router.get('/', asyncHandler(BrandController.getAllBrand))
// router.get('/select-admin', asyncHandler(CategoryController.getAllCategoryAdminSelect))
router.get('/count-status', asyncHandler(BrandController.getCountStatusBrand))
// router.get('/:categoryId', asyncHandler(CategoryController.getCategoryById))

// router.put('/:categoryId', asyncHandler(CategoryController.updateCategory))
// // patch
router.patch('/change-status', asyncHandler(BrandController.changeStatusBrand))
// // delete
router.patch('/del', asyncHandler(BrandController.deleteBrand))

router.post('/', asyncHandler(BrandController.createBrand))

module.exports = router