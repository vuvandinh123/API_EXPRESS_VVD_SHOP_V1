'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const CommentController = require('../../controllers/comment.controller');
const checkAuthencation = require('../../middlewares/checkAuthencation');
const router = express.Router();

router.get('/:productId', asyncHandler(CommentController.getCommentByIdProduct))
router.get('/statistics/:productId', asyncHandler(CommentController.getReviewStatistics))
router.use(checkAuthencation)
router.post('/', asyncHandler(CommentController.createComment))


module.exports = router