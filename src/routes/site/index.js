'use strict'
const express = require('express');
const ValidateController = require('../../controllers/validate.controller');
const asyncHandler = require('../../middlewares/asyncHandle');
const router = express.Router();
router.post('/check-email-exits', asyncHandler(ValidateController.checkEmailExits))

router.use('/', require('./product'))
router.use('/', require('./access'))
router.use('/', require('./discount'))
router.use('/', require('./shop'))



module.exports = router