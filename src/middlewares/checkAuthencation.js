'use strict';

const { NotFoundError, ForbiddenError, AuthFailureError } = require("../core/error.response");
const KeyTokenService = require("../models/repositories/keyToken.repo");
const asyncHandler = require("./asyncHandle");
const JWT = require('jsonwebtoken');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTH: 'auth',
    REFRESH_TOKEN: 'x-refresh-token'
}
/**
 * Middleware function to check authentication of the request.
 * It expects the client id to be present in the request headers and
 * verifies the refresh token provided against the client id and the key token.
 */
const checkAuthencation = asyncHandler(async (req, res, next) => {
    // Extract the client id from the request headers
    const userId = req.headers[HEADER.CLIENT_ID];

    // If the client id is missing, throw a NotFoundError
    if (!userId) throw new NotFoundError("Missing Client Id");

    // Find the key token by the client id
    const keyToken = await KeyTokenService.findKeyTokenByUserId(userId);

    // If the key token is missing, throw a ForbiddenError
    if (!keyToken) throw new ForbiddenError("Missing Key Token");


    // Extract the refresh token from the request headers
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString();
    if (refreshToken) {

        // If the refresh token is missing, throw a ForbiddenError
        if (keyToken.refresh_token !== refreshToken) throw new ForbiddenError("Invalid Refresh Token");

        try {
            // Verify the refresh token against the client id and the key token
            const decodedUser = JWT.verify(refreshToken, keyToken.private_key);
            // If the client id in the refresh token does not match the client id, throw a ForbiddenError
            if (userId !== decodedUser.id.toString()) throw new ForbiddenError("Invalid Refresh Token");
            // Add the key token, decoded user and refresh token to the request object
            req.keyStore = keyToken;
            req.user = decodedUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (e) {
            if (e instanceof JWT.TokenExpiredError) {
                // Throw a 401 Unauthorized error if the refresh token is expired
                throw new ForbiddenError("Refresh Token Expired");
            }
        }

    }
    const accessToken = req.headers[HEADER.AUTH]?.toString();
    // If the refresh token is missing, throw a ForbiddenError
    if (!accessToken) throw new ForbiddenError("Missing Authorization");
    try {
        // Verify the access token against the client id and the key token
        // if (keyToken.private_key !== accessToken) throw new ForbiddenError("Invalid Auth Token");
        // Verify the access token against the client id and the key token
        const decodedUser = JWT.verify(accessToken, keyToken.public_key);
        // If the client id in the refresh token does not match the client id, throw a ForbiddenError
        if (userId !== decodedUser.id.toString()) throw new ForbiddenError("Invalid Refresh Token11");

        // Add the key token, decoded user and refresh token to the request object
        req.keyStore = keyToken;
        req.user = decodedUser;

        return next();
    } catch (e) {
        if (e instanceof JWT.TokenExpiredError) {
            // Throw a 401 Unauthorized error if the refresh token is expired
            throw new AuthFailureError("Access Token Expired");
        }
        console.log(e);
        throw new AuthFailureError("Invalid Access Token");
    }
})
module.exports = checkAuthencation