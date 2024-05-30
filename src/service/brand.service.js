"use strict";

const BrandRepository = require("../models/repositories/brand.repo");


class BrandService {
  static async getBrandByCategoryId(categoryId){
    const brands = await BrandRepository.getBrandByCategoryId(categoryId);
    return brands
  }
  
}
module.exports = BrandService;
