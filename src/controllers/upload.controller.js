'use strict'

const { OK } = require("../core/success.response")
const UploadService = require("../service/upload.service")

class UploadController {

    static async uploads(req, res) {
        const files = req.files
        const result = await UploadService.uploads(files)
        return new OK({
            message: "Upload successfully",
            data: result
        }).send(res)
    }
    static async deletes(req, res) {
        const body = req.body
        const result = await UploadService.deleteImages(body.listID)
        return new OK({
            message: "Delete successfully",
            data: result
        }).send(res)
    }
    // upload xml to product
    static async uploadXLSX(req, res) {
        const file = req.file
        const result = await UploadService.uploadXLSX(file)
        return new OK({
            message: "Delete successfully",
            data: result
        }).send(res)
    }
}
module.exports = UploadController