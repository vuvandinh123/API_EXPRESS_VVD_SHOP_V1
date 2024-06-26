'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const CategoryController = require('../../controllers/category.controller');

const router = express.Router();
// get
router.get('/', asyncHandler(CategoryController.getAllCategoryOnShop))
router.get('/count-status', asyncHandler(CategoryController.getCountStatusCategory))
router.get('/select-admin', asyncHandler(CategoryController.getAllCategoryAdminSelect))
router.get('/select', asyncHandler(CategoryController.getAllCategorySelect))
router.get('/with-parent/:categoryId', asyncHandler(CategoryController.getAllCategoryWithParentId))
router.get('/:categoryId', asyncHandler(CategoryController.getCategoryIdByShop))

// post
// put
router.put('/:categoryId', asyncHandler(CategoryController.updateCategoryByShop))

module.exports = router