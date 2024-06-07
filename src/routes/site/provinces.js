'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ProvincesController = require('../../controllers/provinces.controller');
const router = express.Router();

router.get('/:nationId', asyncHandler(ProvincesController.getAllProvinces))


module.exports = router