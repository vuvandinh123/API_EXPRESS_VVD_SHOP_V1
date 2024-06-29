"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const knex = require("../database/database");
const CategoryRepository = require("../models/repositories/categories.repo");


class CategoryService {

  // user

  static async getCategoryInShop({ shopId }) {
    return await CategoryRepository.getCategoryInShop({ shopId })
  }
  static async getAllCategory() {
    const catgories = await CategoryRepository.getAllCategory();
    return catgories
  }
  static async getCategoryFilter({ categoryId }) {
    const catgories = await CategoryRepository.getCategoryFilter({ categoryId });
    return catgories
  }
  static async getCategoryById({ categoryId }) {
    const catgories = await CategoryRepository.getCategoryById({ categoryId });
    return catgories
  }
  static async getAllCategoryShow() {
    const catgories = await CategoryRepository.getAllCategoryShow();
    return catgories
  }


  static async getAllCategoryOnShop({ shopId, limit, offset, search, active, sortBy }) {
    const catgories = await CategoryRepository.getAllCategoryOnShop({ shopId, limit, offset, search, active, sortBy });
    return catgories
  }
  static async getCategoryIdByShop({ categoryId }) {
    const catgories = await CategoryRepository.getCategoryIdByShop({ categoryId });
    return catgories
  }
  static async getAllCategorySelect({ shopId }) {
    const catgories = await CategoryRepository.getAllCategorySelect({ shopId });
    return catgories
  }
  static async getCountStatusCategory() {
    const catgories = await CategoryRepository.getCountStatusCategory();
    return catgories
  }
  static async getAllCategoryAdminSelect() {
    const catgories = await CategoryRepository.getAllCategoryAdminSelect();
    return catgories
  }
  static async createCategory(data, userId) {
    const category = await CategoryRepository.createCategory(data, userId)
    return category
  }
  static async updateCategory(categoryId, data) {
    const category = await CategoryRepository.updateCategory(categoryId, data)
    return category
  }
  static async changeStatusCategory({ listId, value, shopId }) {
    return await CategoryRepository.changeStatusCategory({ listId, value, shopId })
  }
  static async deleteCategory({ listId }) {
    return await CategoryRepository.deleteCategory({ listId })
  }
  static async getAllCategoryWithParentId({ categoryId }) {
    const catgories = await CategoryRepository.getAllCategoryWithParentId({ categoryId });
    return catgories
  }
  static async getAllCategoryByAdmin({ limit, offset, search, active, sortBy }) {
    const catgories = await CategoryRepository.getAllCategoryByAdmin({ limit, offset, search, active, sortBy });
    return catgories
  }
  
}
module.exports = CategoryService;
