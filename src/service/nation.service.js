"use strict";

const BrandRepository = require("../models/repositories/brand.repo");
const NationRepository = require("../models/repositories/nations.repo");


class NationService {
  static async getAllNations(){
    const nations = await NationRepository.getAllNations();
    return nations
  }
  
}
module.exports = NationService;
