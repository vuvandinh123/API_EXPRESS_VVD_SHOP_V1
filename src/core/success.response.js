'use strict'

const { StatusCodes , ReasonPhrases} = require("./error");


class SuccessResponse {
    constructor({ message, statusCode = StatusCodes.OK, reasonPhrases = ReasonPhrases.OK, data = {} }) {
        this.message = message || reasonPhrases.OK;
        this.status = statusCode
        this.data = data
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}
class OK extends SuccessResponse {
    constructor({options={}, message, data = {} }) {
        super({ message, data })
        this.options = options
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}
class CREATED extends SuccessResponse {
    constructor({ options = {}, message, statusCode = StatusCodes.CREATED, reasonPhrases = ReasonPhrases.CREATED, data = {} }) {
        super({ message, statusCode, reasonPhrases, data })
        this.options = options
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}
module.exports = {
    OK,
    CREATED,
    SuccessResponse
}