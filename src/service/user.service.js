"use strict";

const { BadRequestError } = require("../core/error.response");
const UserRepository = require("../models/repositories/user.repo");
const bcrypt = require("bcrypt")



class UserService {
  static async getUserByIdEdit({ userId }) {
    const user = await UserRepository.findUserByIdEdit(userId);
    return user
  }
  static async updateByUser(userId, data) {
    const res = await UserRepository.userEdit(userId, data)
    return res;
  }
  static async getChatsUserShop(data) {
    const user = await UserRepository.getChatsUserShop(data)
    return user
  }
  static async getUserChatById(id) {
    const user = await UserRepository.getUserChatById(id)
    return user
  }
  static async changePassword(id, data) {
    const { password_old, password_new } = data
    const passwordHast = await bcrypt.hash(password_new, 10)
    const user = await UserRepository.findUserById(id)
    if (!user) {
      throw new BadRequestError("User not found")
    }
    if (!bcrypt.compareSync(password_old, user.password)) {
      throw new BadRequestError("Password incorrect")
    }
    const res = await UserRepository.updateUser(id, { password: passwordHast })
    return res
  }
  static async getUserSignupNewAdmin() {
    const res = await UserRepository.getUserSignupNewAdmin()
    return res
  }
  static async getAllUserByAdmin({ offset, limit, search }) {
    const res = await UserRepository.getAllUserByAdmin({ offset, limit, search })
    return res
  }
}
module.exports = UserService;
