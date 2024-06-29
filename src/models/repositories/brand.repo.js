const knex = require("../../database/database");

class BrandRepository {
  static async getAllBrand({ limit, offset, search, active, sortBy }) {
    const q = knex("brands")
      .join("categories", "brands.category_id", "categories.id")
      .select("brands.*", "categories.name as category").limit(limit).offset(offset).orderBy("created_at", "desc")
    if (search) {
      q.where("brands.name", "like", `%${search}%`)
    }
    if (active !== "all"
    ) {
      q.where("brands.is_active", active)
    } else {
      q.where("brands.is_active", "!=", 0)
    }
    const categories = await q
    const totalCate = await knex("brands").count("brands.id as total")
    return {
      data: categories,
      total: totalCate[0]?.total || 0
    }
  }
  static async changeStatusBrand({ listId, value }) {
    return await knex('brands').whereIn('id', listId).update({ is_active: value })
  }
  static async deleteBrand({ listId }) {
    return await knex("brands").whereIn("id", listId).del();
  }
  static getCountStatusBrand = async () => {
    const response = await knex('brands')
      .select(
        knex.raw(
          `(
          SELECT COUNT(id)
          FROM brands
          WHERE is_active != 0) AS countTotal`
        ),
        knex.raw(
          `(
          SELECT COUNT(id)
          FROM brands
          WHERE is_active = 2
      ) AS countActive`
        ),
        knex.raw(
          `(
          SELECT COUNT(id)
          FROM brands
          WHERE is_active = 1
      ) AS countUnActive`
        ),
        knex.raw(
          `(
          SELECT COUNT(id)
          FROM brands
          WHERE is_active = 0  
      ) AS countTrash`
        )
      )
      .first();
    return response
  }
  static async getBrandByCategoryId(categoryId) {
    const brands = knex.select("id", "name").from("brands").where("category_id", categoryId)
    return brands
  }
  static async createBrand({ data }) {
    const brand = {
      name: data.name,
      category_id: data.category_id,
      description: data.description,
      is_active: data.is_active ?? 2
    }
    const newBrand = await knex("brands").insert(brand)
    return newBrand
  }
}
module.exports = BrandRepository