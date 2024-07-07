"use strict"

const { body } = require("express-validator")

module.exports = {
    loginValidationRules: [
        body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is not valid"),
        body("password").notEmpty().withMessage("Password is required")
    ],
    signupValidationRules: [
        body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is not valid"),
        body("password").notEmpty().withMessage("Password is required"),
        body("firstName").notEmpty().withMessage("First name is required"),
        body("lastName").notEmpty().withMessage("Last name is required"),
    ],

}