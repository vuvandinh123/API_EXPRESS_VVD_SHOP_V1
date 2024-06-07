'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const NationController = require('../../controllers/nation.controller');
const router = express.Router();

router.get('/', asyncHandler(NationController.getAllNation))


module.exports = router