'use strict'

const SpecRepository = require("../models/repositories/spec.repo")

class SpecService {
    static async createSpec(spec) {
        const newSpec = await SpecRepository.createSpec(spec)
        return newSpec
    }
    static async getSpecByProductId(id) {
        const specs = await SpecRepository.getSpecByProductId(id)
        return specs
    }
}

module.exports = SpecService