'use strict'
const bcrypt = require("bcrypt")
const crypto = require('crypto');
const UserRepository = require("../models/repositories/user.repo")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { createTokenPeir } = require("../auth/authUtils")
const KeyTokenService = require("../models/repositories/keyToken.repo")
const { createPrivateKeyAndPublicKey, authLogin, authLoginSocial, sendNodemail } = require("../utils")
const nodemailer = require('nodemailer');
const { renderVerifyEmail, renderVerifyEmailLink } = require("../utils/VerifyEmail")
const NodeCache = require('node-cache');
const cache = new NodeCache();
/**
 * Access service
 * 1. Sign up
 * 2. Sign in
 * 3. Refresh token
 * 4. Log out
 */
class AccessService {

    /**
     * Sign up
     * 1. Check email exist
     * 2. Hash password
     * 3. Create user
     * 4. Create key
     * 5. Create token to database
     * 6. Return user,token
     */
    static signUp = async ({ firstName, lastName, email, password, role_id }, user) => {
        let role_id_use = 1;
        if (role_id && role_id !== 1) {
            if (user) {
                const userAdmin = await UserRepository.findUserByEmail(user.email)
                if (userAdmin.role_id === 2) {
                    role_id_use = role_id
                }
            }
        }
        const isEmailExist = await UserRepository.findUserByEmail(email)
        if (isEmailExist) {
            throw new BadRequestError("Email already exist")
        }
        const passwordHast = await bcrypt.hash(password, 10)

        const newUser = await UserRepository.createUser({ firstName, lastName, email, password: passwordHast, role_id: role_id_use })
        if (!newUser) {
            throw new BadRequestError("Failed to create user")
        }
        // create key publickey and privatekey
        const { privateKey, publicKey } = createPrivateKeyAndPublicKey()
        const token = await createTokenPeir({ id: newUser[0], email }, publicKey, privateKey)
        // add key publickey and privatekey to database
        const keyStore = await KeyTokenService.createKeyToken({
            user_id: newUser[0],
            public_key: publicKey,
            private_key: privateKey,
            refresh_token: token.refreshToken
        })
        if (!keyStore) {
            throw new BadRequestError("Failed to create key")
        }
        return {
            user: {
                id: newUser[0],
                email,
                firstName,
                lastName
            },
            token
        }
    }
    /**
     * Sign in
     * 1. Check email exist
     * 2. Check password
     * 3. Create token
     * 4. Check keytoken in database
     * 5. Return user,token
     */
    static signInByShop = async ({ email, password, refreshToken = null }) => {
        const user = await UserRepository.findUserByEmail(email)
        if (!user) {
            throw new BadRequestError("Email not found")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new BadRequestError("Password not match")
        }
        const token = await authLogin({ user, password, refreshToken })
        return {
            user: {
                id: user.id,
                email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token
        }

    }
    static signInByUser = async ({ email, password, refreshToken = null }) => {
        const user = await UserRepository.findUserByEmail(email)
        if (!user) {
            throw new BadRequestError("Email not found")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new BadRequestError("Password not match")
        }
        const token = await authLogin({ user, password, refreshToken })
        return {
            user: {
                id: user.id,
                email,
                firstName: user.firstName,
                lastName: user.lastName,
                email_verified: user.email_verified
            },
            token
        }
    }
    /**
     * Refresh token
     * 1. Check refresh token === refresh token in database
     * 2. Check user
     * 3. Create new token
     * 4. Update token in database
     * 5. Return user,token
     */
    static refreshToken = async ({ keyStore, refreshToken, user }) => {
        const { id, email } = user;
        if (keyStore.refresh_token !== refreshToken) throw new AuthFailureError("User is not authenticated")

        // check user
        const isUser = await UserRepository.findUserById(id)
        if (!isUser) throw new AuthFailureError("User not found")

        // create new token
        const token = await createTokenPeir({ id, email }, keyStore.public_key, keyStore.private_key)

        // update token in database
        const keyUpdate = await KeyTokenService.updateKeyToken(id, {
            refresh_token: token.refreshToken,
        })
        if (!keyUpdate) throw new BadRequestError("Failed to update key")
        return {
            user: {
                id,
                email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token
        }
    }
    /**
     * Logout user
     */
    static logOut = async (keyStore) => {
        return await KeyTokenService.deleteKeyToken(keyStore.id)
    }
    // send email
    static sendEmail = async (req) => {
        const user = await UserRepository.findUserByEmail(req.user.email)
        if (!user) throw new BadRequestError("User not found")
        if (user.email_verified !== 0) {
            throw new BadRequestError("User is active")
        }
        const code = Math.random().toString(6).substring(2, 8)
        const codeExpiration = 60; // 60 giây
        const codeStartDateTime = new Date();


        cache.set(req.user.email, code, 60);
        sendNodemail({ email: req.user.email, title: "Vu Dinh Shop - Verify email", html: renderVerifyEmail(code) })
        return {
            expiration: codeExpiration,
            codeStartDateTimeStr: codeStartDateTime.toString(),
        }
    }
    // send email reset password
    static sendEmailResetPassword = async ({ email }) => {
        const user = await UserRepository.findUserByEmail(email)
        if (!user) throw new BadRequestError("User not found")
        const arr_type = user.type_login.split(",")
        if (!arr_type.includes("signup")) throw new BadRequestError("Email do not exits")

        const verificationCode = crypto.randomBytes(20).toString('hex');
        cache.set(email, verificationCode, 60 * 5);
        sendNodemail({ email: user.email, title: "Vu Dinh Shop - Forgot password", html: renderVerifyEmailLink({ email: user.email, token: verificationCode, name: user.firstName }) })
        return true
    }
    // verify email reset password
    static verifyEmailResetPassword = async ({ email, token, newPassword }) => {
        if (!token) return false
        const cacheCode = cache.get(email)
        if (cacheCode === token) {
            const passwordHast = await bcrypt.hash(newPassword, 10)
            await UserRepository.patchPasswordUser({ email, password: passwordHast })
            cache.del(email)
            return true
        }
        return false
    }
    // verify email
    static verifyEmail = async (req) => {
        const { code } = req.body
        if (!code) return false
        const cacheCode = cache.get(req.user.email)
        if (cacheCode === code) {
            await UserRepository.patchEmailVerifiedUser(req.user.id)
            cache.del(req.user.email)
            return true
        }
        return false
    }
    // get user is login
    static getUser = async (user) => {
        const item = await UserRepository.findUserById(user.id)
        if (!user) throw new BadRequestError("User not found")
        return {
            id: item.id,
            email: item.email,
            firstName: item.firstName,
            lastName: item.lastName,
            email_verified: item.email_verified,
            image: item.image
        }
    }
    // login with google 
    static loginSocial = async ({ firstName, lastName, email, image, type_login }) => {
        if (type_login === "google" || type_login === "facebook") {
            return await authLoginSocial({ email, firstName, lastName, image, type_login })
        } else throw new BadRequestError("Type login not found")

    }
}
module.exports = AccessService