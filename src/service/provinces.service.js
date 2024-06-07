"use strict";

const BrandRepository = require("../models/repositories/brand.repo");
const NationRepository = require("../models/repositories/nations.repo");
const ProvincesRepository = require("../models/repositories/provinces.repo");


class ProvincesService {
  static async getAllProvinces({ nationId }) {
    const provinces = await ProvincesRepository.getAllProvinces({ nationId });
    return provinces
  }
}
module.exports = ProvincesService;
