"use strict"

const { ExitsError } = require("../core/error.response")
const ShopRepository = require("../models/repositories/shop.repo")
const UserRepository = require("../models/repositories/user.repo")

class ValidateService {

    // validate email exist
    static async checkEmailExist(email) {
        const user = await UserRepository.findUserByEmail(email)
        if (user) throw new ExitsError("Email already exist")
        return true
    }
    static async checkUsernameExist(username) {
        const check = await ShopRepository.findUserByUsername(username)
        if (check) throw new ExitsError("Username already exist")
        return true
    }
}

module.exports = ValidateService