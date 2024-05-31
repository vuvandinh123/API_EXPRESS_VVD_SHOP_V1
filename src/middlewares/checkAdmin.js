'use strict'

const { ForbiddenError } = require("../core/error.response")
const UserRepository = require("../models/repositories/user.repo")
const asyncHandler = require("./asyncHandle")
/**
     *  - permissions[0] === 1 is admin
     *  - permissions[0] === 2 is shop
     *  - permissions[0] === 0 is user
     * 1. permissions user: 00000 -> not admin
     * 2. permissions admin: 11111 -> full roles
     * 3. permissions admin: 11110 -> create,read,update not delete
     * 4. permissions admin: 10100 -> read
     */
const checkAdmin = asyncHandler(async (req, res, next) => {
    const user = await UserRepository.checkRoleUserId(req.user.id)
    const isAdmin = Number(user.permissions[0]);
    if (isAdmin !== 1) {
        throw new ForbiddenError("You are not admin")
    }
    next()
})
const checkShop = asyncHandler(async (req, res, next) => {
    const user = await UserRepository.checkRoleUserId(req.user?.id || 0)
    const isShop = Number(user?.permissions[0]);
    if (isShop !== 2) {
        throw new ForbiddenError("You are not shop")
    }
    next()
})
module.exports = {checkAdmin,checkShop}