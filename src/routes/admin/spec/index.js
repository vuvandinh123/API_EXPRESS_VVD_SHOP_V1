'use strict'

const express = require('express');
const asyncHandler = require('../../../middlewares/asyncHandle');
const SpecController = require('../../../controllers/spec.controller');
const router = express.Router();
router.post('/specs', asyncHandler(SpecController.createSpec))
module.exports = router