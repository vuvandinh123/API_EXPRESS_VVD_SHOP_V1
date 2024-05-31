'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');

const multer = require('multer');
const UploadController = require('../../controllers/upload.controller');
const XLSXToJson = require('../../controllers/validate.controller');
const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
});
router.post("/uploads/multiple", upload.array('images', 12), UploadController.uploads)
router.post("/uploads/single", upload.array('images', 12), UploadController.uploads)
router.post("/uploads/xlsx", upload.single('file'), asyncHandler(UploadController.uploadXLSX))
router.post("/uploads/multiple/delete", UploadController.deletes)
module.exports = router