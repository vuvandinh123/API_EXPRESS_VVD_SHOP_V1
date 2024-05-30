const { ForbiddenError } = require("../core/error.response");
const ApiKeyRepository = require("../models/repositories/apiKey.repo");
const asyncHandler = require("./asyncHandle");

const HEADER = {
    API_KEY: 'x-api-key',
}
/**
 * Middleware to check if the request contains a valid API Key.
 * If the API Key is missing or invalid, it returns a 403 error.
 * If the API Key is valid, it adds the corresponding object to the request and continues to the next middleware.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const checkApiKey = asyncHandler(async (req, res, next) => {
    // Extract the API Key from the request headers
    const key = req.headers[HEADER.API_KEY]?.toString();

    // If the API Key is missing, return a 403 error
    if (!key) throw new ForbiddenError("Forbidden Error: Missing API Key");

    // Get the corresponding object for the API Key
    const objKey = await ApiKeyRepository.getApiKey(key);

    // If the API Key is invalid, return a 403 error
    if (!objKey) throw new ForbiddenError("Forbidden Error: Missing API Key");

    // Add the object to the request and continue to the next middleware
    req.objKey = objKey;
    return next();
})
module.exports = checkApiKey