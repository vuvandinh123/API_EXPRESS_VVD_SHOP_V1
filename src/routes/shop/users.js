'use strict'

const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const UserController = require('../../controllers/user.controller');
const router = express.Router();
router.post('/chats', asyncHandler(UserController.getChatsUserShop))
router.get('/:id', asyncHandler(UserController.getUserChatById))
module.exports = router 