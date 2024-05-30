'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const checkAuthencation = require('../../middlewares/checkAuthencation');
const AccessController = require('../../controllers/access.controller');

const router = express.Router();
router.post('/auth/login', asyncHandler(AccessController.signIn))
router.use(checkAuthencation)
router.post('/auth/signup', asyncHandler(AccessController.signUp))
router.post('/auth/logout', asyncHandler(AccessController.logOut))
router.post('/auth/refresh', asyncHandler(AccessController.refreshToken))


module.exports = router