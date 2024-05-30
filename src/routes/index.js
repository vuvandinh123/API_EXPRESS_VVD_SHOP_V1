'use strict'
const express = require('express');
const checkPermission = require('../middlewares/checkPermission');
const checkApiKey = require('../middlewares/checkApiKey');
const asyncHandler = require('../middlewares/asyncHandle');
const router = express.Router();

router.use(checkApiKey)
router.use(checkPermission("0000"))

router.use('/api/shop/', require('./shop'))
router.use('/api/', require('./site'))
// router.use('/api/admin/', require('./admin'))




module.exports = router