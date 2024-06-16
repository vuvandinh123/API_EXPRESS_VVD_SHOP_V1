'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const UserFollowController = require('../../controllers/userFollow.controller');

const router = express.Router();
router.get('/stats', asyncHandler(UserFollowController.countUserFollowShopStats))
module.exports = router