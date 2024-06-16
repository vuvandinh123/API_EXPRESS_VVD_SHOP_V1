const { default: slugify } = require("slugify");
const knex = require("../../database/database");
const { getFilterCategory } = require("../../utils/filter");

class CategoryRepository {



    // user
    static async getAllCategory() {
        const categories = await knex.select("id", "name", "slug", "parent_id", "thumbnail")
            .from("categories")
            .where("is_delete", 0)
            .andWhere("is_active", 2)
        return categories
    }
    static async getCategoryFilter({ categoryId }) {
        const query = `
              WITH RECURSIVE category_tree AS (
                SELECT id, parent_id
                FROM categories
                WHERE id = ?
                UNION ALL
                SELECT c.id, c.parent_id
                FROM categories c
                INNER JOIN category_tree ct ON c.parent_id = ct.id
              )
              SELECT id FROM category_tree;
            `;

        const [categoryIds] = await knex.raw(query, [categoryId]);

        const categoryIdArray = categoryIds.map(category => category.id);
        const categories = await knex.select("id", "name", "slug", "thumbnail").from("categories").whereIn("id", categoryIdArray).andWhere("is_delete", 0).andWhere("is_active", 2)
        return categories;
    }
    static async getAllCategoryShow() {
        const categories = await knex.select("id", "name", "slug", "thumbnail",
            knex.raw("(select count(id) from products where category_id = categories.id and is_active = 2 and is_delete = 0) as total_product")
        )
            .from("categories")
            .where("parent_id", 0)
            .where("is_delete", 0)
            .andWhere("is_active", 2)
        return categories
    }
    static async getCategoryById({ categoryId }) {
        const categories = await knex.select("id", "name", "slug", "thumbnail",
            knex.raw("(select count(id) from products where category_id = categories.id and is_active = 2 and is_delete = 0) as total_product")
        )
            .from("categories")
            .where("is_delete", 0)
            .where("id", categoryId)
            .andWhere("is_active", 2).first()
        return categories
    }
    static async getCategoryInShop({ shopId }) {
        const categories = await knex("shop_categories")
            .where("shop_categories.shop_id", shopId)
            .join("categories", "categories.id", "shop_categories.category_id")
            .select("categories.*")
        return categories
    }

    static async getAllCategorySelect({ shopId }) {
        const categories = knex.select("id", "name").from("categories").where("is_delete", 0).andWhere("is_active", 2).andWhere("user_id", shopId)
        return categories
    }
    static buildQuery = (shopId, params = {}) => {
        let query = knex('categories')
            .where('user_id', shopId).where('is_delete', 0)
        if (params.search) {
            query.where('name', 'like', `%${params.search}%`).orWhere('code', 'like', `%${params.search}%`)
        }
        if (params.active == 1 || params.active == 2 || params.active == 0) {
            query.where('is_active', params.active)
        }
        else if (params.active === "all") {
            query.where('is_active', "!=", 0)
        }

        // sort by , createdAtAsc, nameDesc, nameAsc, priceDesc, priceAsc
        // const sortBy2 = params.sortBy || 'createdAtDesc';
        // const sort = sortDiscount(sortBy2)
        // query.orderBy(sort.nameSort, sort.valueSort)
        return query;
    };
    static async getAllCategoryOnShop({ shopId, limit, offset, search, active, sortBy }) {
        const q = this.buildQuery(shopId, { limit, offset, search, active, sortBy })
            .select("id", "name", "thumbnail", "slug", "description", "created_at", "updated_at", "is_active",
                knex.raw("(select count(id) from products where category_id = categories.id and is_active = 2 and is_delete = 0) as total_product")
            )
            .limit(limit).offset(offset).groupBy("id").count("id as totalPro")
        const categories = await q
        const totalCate = await this.buildQuery(shopId, { limit, offset, search, active, sortBy }).count("categories.id as total")
        console.log(totalCate);
        return {
            data: categories,
            total: totalCate[0].total
        }
    }
    static async getAllCategoryAdminSelect() {
        const categories = knex.select("id", "name", "slug", "parent_id").from("categories").where("is_delete", 0).andWhere("is_active", 2)
        return categories
    }
    static async createCategoryByShop(category, userId) {
        const data = {
            name: category.name,
            slug: slugify(category.name, { lower: true, strict: true, trim: true }),
            description: category.description,
            parent_id: category.parent_id,
            user_id: userId,
            is_active: category.is_active,
            role: "SHOP",
            thumbnail: category.thumbnail
        }
        return await knex("categories").insert(data)
    }
    static getCountStatusCategory = async ({ shopId }) => {
        const response = await knex('categories')
            .select(
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM categories
                WHERE is_active != 0 and is_delete = 0 AND user_id = ? 
            ) AS countTotal`, [shopId]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM categories
                WHERE is_active = 2 AND is_delete = 0 AND user_id = ? 
            ) AS countActive`, [shopId]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM categories
                WHERE is_active = 1 AND is_delete = 0 AND user_id = ? 
            ) AS countUnActive`, [shopId]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM categories
                WHERE is_active = 0 AND is_delete = 0 AND user_id = ? 
            ) AS countTrash`, [shopId]
                )
            )
            .where('is_delete', 0)
            .andWhere('user_id', shopId)
            .first();

        return response
    }
    static updateCategoryByShop = async (categoryId, data, userId) => {
        const dataNew = {
            name: data.name,
            slug: slugify(data.name, { lower: true, strict: true, trim: true }),
            description: data.description,
            parent_id: data.parent_id,
            is_active: data.is_active,
            thumbnail: data.thumbnail
        }
        return await knex("categories").where("id", categoryId).where("user_id", userId).update(dataNew)
    }
    static async changeStatusCategory({ listId, value }) {
        return await knex('categories').whereIn('id', listId).update({ is_active: value })
    }
    static async deleteCategoryByShop({ listId }) {
        return await knex('categories').whereIn('id', listId).update({ is_delete: 1 })
    }
    static async getCategoryIdByShop({ categoryId }) {
        const category = await knex("categories").where("id", categoryId).first();
        return category
    }
    static async getAllCategoryWithParentId({ categoryId }) {
        const categories = knex.select("*").from("categories").where("is_delete", 0).andWhere("is_active", 2).andWhere("parent_id", "=", categoryId)
        return categories
    }
}
module.exports = CategoryRepository