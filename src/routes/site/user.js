'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const checkAuthencation = require('../../middlewares/checkAuthencation');
const UserController = require('../../controllers/user.controller');
const router = express.Router();
router.use(checkAuthencation)
router.get('/', asyncHandler(UserController.getUserByIdEdit))
router.put('/', asyncHandler(UserController.updateUser))
router.patch('/change-password', asyncHandler(UserController.changePassword))

module.exports = router