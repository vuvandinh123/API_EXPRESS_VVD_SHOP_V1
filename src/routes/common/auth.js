'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const checkAuthencation = require('../../middlewares/checkAuthencation');
const AccessController = require('../../controllers/access.controller');
const { validateResults } = require('../../middlewares/validationMiddleware');
const { loginValidationRules, signupValidationRules } = require('../../validations/user.validation');

const router = express.Router();
// Đăng nhập
router.post('/login', loginValidationRules, validateResults, asyncHandler(AccessController.signIn))
// Đăng ký
router.post('/signup', signupValidationRules, validateResults, asyncHandler(AccessController.signUp))
router.post('/login-social', asyncHandler(AccessController.loginSocial))
router.post('/send-email-forget-password', asyncHandler(AccessController.sendEmailForgotPassword))
router.post('/verify-email-forget-password', asyncHandler(AccessController.verifyChangePassword))
router.use(checkAuthencation)
router.post('/send-email', asyncHandler(AccessController.sendEmail))
router.get('/user', asyncHandler(AccessController.getUser))
router.post('/logout', asyncHandler(AccessController.logOut))
router.post('/verify-email', asyncHandler(AccessController.verifyEmail))
router.post('/refresh', asyncHandler(AccessController.refreshToken))
router.get('/check', asyncHandler(AccessController.checkIsLogin))


module.exports = router