'use strict'
const express = require('express');
const router = express.Router();
router.use('/', require('./product'))
router.use('/', require('./access'))
router.use('/', require('./discount'))
router.use('/', require('./shop'))



module.exports = router