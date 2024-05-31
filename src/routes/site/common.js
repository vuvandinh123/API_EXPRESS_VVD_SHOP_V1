'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ValidateController = require('../../controllers/validate.controller');

const router = express.Router();


module.exports = router