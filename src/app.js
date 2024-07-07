"use strict"
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const app = express();
const morgan = require('morgan');
// cloudinary 
const cloudinaryConfig = require('./configs/cloudinary.config');

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// cloudinary config
cloudinaryConfig()
const cors = require('cors');
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
    origin: allowedOrigins
}));

// router
app.use('/v1/', require('./routes'))

// handle error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error',
        stack: error.stack,
    })
})
module.exports = app