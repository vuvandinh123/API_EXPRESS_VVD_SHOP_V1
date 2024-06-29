"use strict";

const BrandRepository = require("../models/repositories/brand.repo");


class BrandService {
  static async getBrandByCategoryId(categoryId) {
    const brands = await BrandRepository.getBrandByCategoryId(categoryId);
    return brands
  }
  static async getAllBrand({ limit, offset, search, active, sortBy }) {
    const brands = await BrandRepository.getAllBrand({ limit, offset, search, active, sortBy });
    return brands
  }
  static async changeStatusBrand({ listId, value }) {
    return await BrandRepository.changeStatusBrand({ listId, value })
  }
  static async deleteBrand({ listId }) {
    return await BrandRepository.deleteBrand({ listId })
  }
  static async getCountStatusBrand() {
    return await BrandRepository.getCountStatusBrand()
  }
  static async createBrand({ data }) {
    return await BrandRepository.createBrand({ data })
  }
}
module.exports = BrandService;
