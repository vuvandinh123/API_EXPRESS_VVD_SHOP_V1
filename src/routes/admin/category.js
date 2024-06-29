'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const CategoryController = require('../../controllers/category.controller');

const router = express.Router();
router.get('/', asyncHandler(CategoryController.getAllCategoryByAdmin))
router.get('/select-admin', asyncHandler(CategoryController.getAllCategoryAdminSelect))
router.get('/count-status', asyncHandler(CategoryController.getCountStatusCategory))
router.get('/:categoryId', asyncHandler(CategoryController.getCategoryById))

router.put('/:categoryId', asyncHandler(CategoryController.updateCategory))
// patch
router.patch('/change-status', asyncHandler(CategoryController.changeStatusCategory))
// delete
router.patch('/del', asyncHandler(CategoryController.deleteCategory))

router.post('/', asyncHandler(CategoryController.createCategory))

module.exports = router