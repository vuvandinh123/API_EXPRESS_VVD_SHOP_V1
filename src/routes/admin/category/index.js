'use strict'

const express = require('express');
const asyncHandler = require('../../../middlewares/asyncHandle');
const CategoryController = require('../../../controllers/category.controller');

const router = express.Router();
router.get('/categories', asyncHandler(CategoryController.getAllCategory))
module.exports = router