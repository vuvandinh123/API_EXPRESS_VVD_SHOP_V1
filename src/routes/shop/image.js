'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ImageController = require('../../controllers/image.controller');
const router = express.Router();
router.get('/images/:productId', asyncHandler(ImageController.getImages))
router.post('/images', asyncHandler(ImageController.deleteImages))
router.get('/media', asyncHandler(ImageController.getAllImages))
module.exports = router