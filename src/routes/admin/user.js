'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const UserController = require('../../controllers/user.controller');

const router = express.Router();
router.get('/user-new', asyncHandler(UserController.getUserSignupNewAdmin))
router.get('/', asyncHandler(UserController.getAllUserByAdmin))

module.exports = router