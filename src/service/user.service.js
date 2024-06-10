"use strict";

const UserRepository = require("../models/repositories/user.repo");



class UserService {
  static async getUserByIdEdit({ userId }) {
    const user = await UserRepository.findUserByIdEdit(userId);
    return user
  }
  static async updateByUser(userId, data) {
    console.log(data);
    const res = await UserRepository.userEdit(userId, data)
    return res;
  }

}
module.exports = UserService;
