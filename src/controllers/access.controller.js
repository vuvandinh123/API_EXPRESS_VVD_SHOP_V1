'use strict'
const { OK } = require("../core/success.response")
const AccessService = require("../service/access.service")

class AccessController {

    static signUp = async (req, res) => {
        const data = await AccessService.signUp(req.body, req.user || null)
        return new OK({
            message: "Sign up successfully",
            data
        }).send(res)
    }
    
    static signIn = async (req, res) => {
        const data = await AccessService.signIn(req.body)
        return new OK({
            message: "Sign in successfully",
            data
        }).send(res)
    }
    static logOut = async (req, res) => {
        const data = await AccessService.logOut(req.keyStore)
        return new OK({
            message: "Log out successfully",
            data
        }).send(res)
    }
    static getUser = async (req, res) => {
        const user = await AccessService.getUser(req.user)
        return new OK({
            message: "Get user successfully",
            data: user
        }).send(res)
    }
    static refreshToken = async (req, res) => {
        const data = await AccessService.refreshToken({
            keyStore: req.keyStore,
            refreshToken: req.refreshToken,
            user: req.user
        })
        req.refreshToken = data.token.refreshToken
        return new OK({
            message: "Refresh token successfully",
            data
        }).send(res)
    }
    static checkIsLogin = async (req, res) => {
        return new OK({
            message: "Check is login successfully",
            data: true
        }).send(res)
    }
    static checkAPI = async (req, res) => {
        return new OK({
            message: "Check API successfully",
            data: true
        }).send(res)
    }
    // send email
    static sendEmail = async (req, res) => {
        const data = await AccessService.sendEmail(req)
        return new OK({
            message: "Send email successfully",
            data
        }).send(res)
    }
    // forgot password
    static sendEmailForgotPassword = async (req, res) => {
        const data = await AccessService.sendEmailResetPassword(req.body)
        return new OK({
            message: "Send email forgot password successfully",
            data
        }).send(res)
    }
    // verify email
    static verifyEmail = async (req, res) => {
        const data = await AccessService.verifyEmail(req)
        return new OK({
            message: "Verify email successfully",
            data
        }).send(res)
    }
    static verifyChangePassword = async (req, res) => {
        const data = await AccessService.verifyEmailResetPassword(req.body)
        return new OK({
            message: "Verify change password successfully",
            data
        }).send(res)
    }
    // login social
    static loginSocial = async (req, res) => {
        const data = await AccessService.loginSocial(req.body)
        return new OK({
            message: "Login Social successfully",
            data
        }).send(res)
    }
}
module.exports = AccessController