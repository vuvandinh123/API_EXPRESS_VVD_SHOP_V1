'use strict'

const express = require('express');

const multer = require('multer');
const UploadController = require('../../controllers/upload.controller');
const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
});
router.post("/multiple", upload.array('images', 12), UploadController.uploads)
router.post("/multiple/delete", UploadController.deletes)
module.exports = router