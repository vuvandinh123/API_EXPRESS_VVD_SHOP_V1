'use strict'
const express = require('express');
const asyncHandler = require('../../../middlewares/asyncHandle');
const checkAuthencation = require('../../../middlewares/checkAuthencation');
const AccessController = require('../../../controllers/access.controller');

const router = express.Router();
router.post('/auth/signup', asyncHandler(AccessController.signUp))
router.post('/auth/login', asyncHandler(AccessController.signInByUser))
router.post('/auth/login-social', asyncHandler(AccessController.loginSocial))
router.post('/auth/send-email-forget-password', asyncHandler(AccessController.sendEmailForgotPassword))
router.post('/auth/verify-email-forget-password', asyncHandler(AccessController.verifyChangePassword))
router.use(checkAuthencation)
router.post('/auth/send-email', asyncHandler(AccessController.sendEmail))
router.get('/auth/user', asyncHandler(AccessController.getUser))
router.post('/auth/logout', asyncHandler(AccessController.logOut))
router.post('/auth/verify-email', asyncHandler(AccessController.verifyEmail))
router.post('/auth/refresh', asyncHandler(AccessController.refreshToken))
router.get('/auth/check', asyncHandler(AccessController.checkIsLogin))


module.exports = router