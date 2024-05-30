'use strict';

const JWT = require('jsonwebtoken')

const createTokenPeir = async (payload, publicKey, privateKey) => {

    const expiresInAccessToken = 1800;
    const expiresInRefreshToken = '5 days';
    // Create access and refresh tokens
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: expiresInAccessToken,
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: expiresInRefreshToken,
        });
        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error("Error verifying the access token::", err);
            }
        });
        // Return the access and refresh tokens
        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        // If there is an error, rethrow it
        throw error;
    }
}
const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}
module.exports = {
    createTokenPeir,
    verifyJWT
}