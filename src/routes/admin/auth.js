'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const checkAuthencation = require('../../middlewares/checkAuthencation');
const AccessController = require('../../controllers/access.controller');

const router = express.Router();
router.post('/login', asyncHandler(AccessController.signIn))
router.use(checkAuthencation)
router.post('/signup', asyncHandler(AccessController.signUp))
router.post('/logout', asyncHandler(AccessController.logOut))
router.post('/refresh', asyncHandler(AccessController.refreshToken))


module.exports = router