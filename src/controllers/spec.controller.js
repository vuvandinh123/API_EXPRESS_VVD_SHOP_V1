'use strict'

const { OK } = require("../core/success.response")
const SpecService = require("../service/Spec.service")

class SpecController {

    static async createSpec(req, res) {
        const data = req.body
        const spec = await SpecService.createSpec(data)
        return new OK({
            message: "Create spec successfully",
            data: spec
        }).send(res)
    }
}
module.exports = SpecController