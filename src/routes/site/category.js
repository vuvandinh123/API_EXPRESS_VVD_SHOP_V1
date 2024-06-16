'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const CategoryController = require('../../controllers/category.controller');
const router = express.Router();
router.get('/shop/:shopId', asyncHandler(CategoryController.getCategoryInShop))
router.get("/all", asyncHandler(CategoryController.getAllCategory))
router.get("/", asyncHandler(CategoryController.getAllCategoryShow))
router.get("/:categoryId", asyncHandler(CategoryController.getCategoryById))
router.get("/filter/:categoryId", asyncHandler(CategoryController.getCategoryFilter))

module.exports = router