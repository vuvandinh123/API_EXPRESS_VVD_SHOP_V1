const crypto = require("node:crypto");
const KeyTokenService = require("../models/repositories/keyToken.repo");
const { BadRequestError } = require("../core/error.response");
const bcrypt = require("bcrypt");
const { createTokenPeir } = require("../auth/authUtils");
const UserRepository = require("../models/repositories/user.repo");
const nodemailer = require('nodemailer');
const DiscountRepository = require("../models/repositories/Discount.repo");
const RoleRepository = require("../models/repositories/role.repo");
const firebase = require("../configs/firebase.config");
require('dotenv').config()
const createPrivateKeyAndPublicKey = (size = 64) => {
    // Generate a random private key
    const privateKey = crypto.randomBytes(size).toString('hex');
    // Generate a random public key
    const publicKey = crypto.randomBytes(size).toString('hex');
    return {
        privateKey,
        publicKey
    };
}
const getParamsPagination = (req) => {
    // get params
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const offset = (page - 1) * limit
    return { limit, page, offset }
}

const authLogin = async ({ user, refreshToken }) => {
    const { privateKey, publicKey } = createPrivateKeyAndPublicKey()
    const role = await RoleRepository.getRoleById(user.role_id)
    const token = await createTokenPeir({ id: user.id, email: user.email, role: role.name }, publicKey, privateKey, refreshToken)
    // add key publickey and privatekey to database
    const isTokenKey = await KeyTokenService.findKeyTokenByUserId(user.id)
    const objKey = {
        user_id: user.id,
        public_key: publicKey,
        private_key: privateKey,
        refresh_token: token.refreshToken
    }
    if (!isTokenKey) {
        const keyStore = await KeyTokenService.createKeyToken(objKey)
        if (!keyStore) {
            throw new BadRequestError("Failed to update key")
        }
    }
    else {
        const keyStore = await KeyTokenService.updateKeyToken(user.id, objKey)
        if (!keyStore) {
            throw new BadRequestError("Failed to create key")
        }
    }
    const keyStore = await KeyTokenService.updateKeyToken(user.id, {
        user_id: user.id,
        public_key: publicKey,
        private_key: privateKey,
        refresh_token: token.refreshToken
    })
    if (!keyStore) {
        throw new BadRequestError("Failed to update key")
    }
    return token
}
const sendNodemail = async ({ email, title, html },) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_ADDRESS, // địa chỉ email người gửi
        to: email, // địa chỉ email người nhận
        subject: title || 'Verify email Vu Dinh Shop',
        html: html
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
const authLoginSocial = async ({ email, firstName, lastName, image, type_login }) => {
    const user = await UserRepository.findUserByEmail(email)

    if (user) {
        const arr_type = user.type_login.split(",")
        const newData = {
            firstName: user.firstName ? user.firstName : firstName,
            lastName: user.lastName ? user.lastName : lastName,
            image: user.image ? user.image : image,
            type_login: arr_type.includes(type_login) ? user.type_login : user.type_login + "," + type_login,
            email_verified: 1
        }
        UserRepository.updateUser(user.id, newData)
        const token = await authLogin({ user, refreshToken: null })
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: newData.firstName,
                lastName: newData.lastName,
                image: newData.image,
                email_verified: newData.email_verified
            },
            token
        }
    }
    else {
        const user = await UserRepository.createUser({ firstName, lastName, email, image, password: null, type_login, email_verified: 1, is_active: 1 })
        const token = await authLogin({ user: { id: user[0], email: email }, refreshToken: null })
        return {
            user: {
                id: user[0],
                email: email,
                firstName: firstName,
                lastName: lastName,
                image: image,
                email_verified: 1
            },
            token
        }
    }
}
const converProductsToResponse = (products) => {
    products.forEach((row) => {
        if (row.imageUrls != null) {
            row.imageUrls = row.imageUrls.split(",");
        }
        else delete row.imageUrls
        if (row.price_sale) {
            row.discount = ((row.price - row.price_sale) / row.price * 100).toFixed(0) + "%";
        }
    });
    return products;
}
const caculatorDiscount = async ({ user, discount, price, usedUser, historyUsed }) => {
    let amount = 0
    if (discount.type_price === "fixed_amount") {
        amount = price - discount.value
        if (amount < 0) {
            amount = 0
        }

    } else {
        amount = price - (price * (discount.value / 100))
    }
    if (usedUser.isUser) {
        if (usedUser.used_count >= discount.max_uses_per_user) {
            throw new BadRequestError("Discount code is used")
        }
        historyUsed[usedUser.index].used_count = usedUser.used_count + 1
    } else {
        historyUsed = [
            {
                user_id: user.id,
                used_count: 1,
            }
        ]
    }
    await DiscountRepository.patchDiscountUsed({ id: discount.id, history: JSON.stringify(historyUsed) })
    return {
        value: discount.value,
        type_price: discount.type_price,
        amount: amount
    }
}
const deleteDocuments = async (documentIds) => {
    const collectionRef = firebase.collection("variant");
    const promises = documentIds.map(async (id) => {
        const docRef = collectionRef.doc(id.toString());
        try {
            await docRef.delete();
        } catch (error) {
            console.error(`Error deleting document ${id}:`, error);
        }
    });
    try {
        console.log('All documents deleted successfully');
        return await Promise.all(promises);;
    } catch (error) {
        console.error('Error deleting documents:', error);
        return error;
    }
};

module.exports = {
    createPrivateKeyAndPublicKey,
    deleteDocuments,
    getParamsPagination,
    authLogin,
    authLoginSocial,
    sendNodemail,
    converProductsToResponse,
    caculatorDiscount
}