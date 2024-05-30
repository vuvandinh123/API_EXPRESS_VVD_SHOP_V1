'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const CategoryController = require('../../controllers/category.controller');

const router = express.Router();
// get
router.get('/categories', asyncHandler(CategoryController.getAllCategoryOnShop))
router.get('/categories/count-status', asyncHandler(CategoryController.getCountStatusCategory))
router.get('/categories/select-admin', asyncHandler(CategoryController.getAllCategoryAdminSelect))
router.get('/categories/select', asyncHandler(CategoryController.getAllCategorySelect))
router.get('/categories/with-parent/:categoryId', asyncHandler(CategoryController.getAllCategoryWithParentId))
router.get('/categories/:categoryId', asyncHandler(CategoryController.getCategoryIdByShop))

// post
router.post('/categories', asyncHandler(CategoryController.createCategoryByShop))
// put
router.put('/categories/:categoryId', asyncHandler(CategoryController.updateCategoryByShop))

// patch
router.patch('/categories/change-status', asyncHandler(CategoryController.changeStatusCategory))
// delete
router.patch('/categories/del', asyncHandler(CategoryController.deleteCategoryByShop))
module.exports = router