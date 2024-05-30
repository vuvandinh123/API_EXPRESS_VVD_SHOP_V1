'use strict'
const express = require('express');
const auth = require('../../middlewares/checkAdmin.js');

const router = express.Router();
router.use(auth.checkAdmin)

router.use('/', require('./product'))
router.use('/', require('./auth.js'))
router.use('/', require('./variant'))
router.use('/', require('./category'))
router.use('/', require('./productVariant'))
router.use('/', require('./brand'))
router.use('/', require('./spec'))
router.use('/', require('./upload'))
router.use('/', require('./image'))



module.exports = router