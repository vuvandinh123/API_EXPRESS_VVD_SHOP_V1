'use strict'

const knex = require("../../database/database");
const { sortDiscount, sortPromotion } = require("../../utils/filter");

class PromotionRepository {
    static buildQuery = (shopId, params = {}) => {
        let query = knex('promotions')
            .where('promotions.shop_id', shopId)
        if (params.search) {
            query.where('promotions.name', 'like', `%${params.search}%`)
        }
        if (params.status === "active" || params.status === "expired" || params.status === "upcoming") {
            query.where('promotions.status', params.status)
        }
        if (params.active == 1 || params.active == 2 || params.active == 0) {
            query.where('promotions.is_active', params.active)
        }
        else if (params.active === "all") {
            query.where('promotions.is_active', "!=", 0)
        }
        // sort by , createdAtAsc, nameDesc, nameAsc, priceDesc, priceAsc
        const sortBy2 = params.sortBy || 'createdAtDesc';
        const sort = sortPromotion(sortBy2)
        query.orderBy(sort.nameSort, sort.valueSort)
        return query;
    };
    static async createPromotion(data, shopId) {
        const promotion = {
            name: data.name,
            type_price: data.type_price,
            start_date: data.start_date,
            end_date: data.end_date,
            price_sale: data.price_sale,
            is_active: data.is_active,
            shop_id: shopId
        }
        const newData = data.productIds?.map(item => {
            return {
                ...promotion,
                product_id: item
            }
        })
        const res = await knex('promotions').insert(newData)
        return res
    }
    static async getPromotionById({ id, shopId }) {
        const res = await knex('promotions').where('promotions.id', id)
            .join('products', 'products.id', 'promotions.product_id')
            .select('promotions.*', 'products.name as product_name', 'products.price', 'products.thumbnail', "products.quantity")
            .where('promotions.shop_id', shopId)
            .first()
        return res
    }
    static async updatePromotion({ id, data, shopId }) {
        const promotion = {
            name: data.name,
            type_price: data.type_price,
            start_date: data.start_date,
            end_date: data.end_date,
            price_sale: data.price_sale,
            is_active: data.is_active
        }
        const res = await knex('promotions').where('id', id).andWhere('shop_id', shopId).update(promotion)
    }
    // get all promotion products
    static async getAllPromition({ shopId, search, active, sortBy, status, limit, offset }) {
        await this.updatePromotionStatus(shopId)
        const res = await this.buildQuery(shopId, { search, active, sortBy, status })
            .join("products", "products.id", "promotions.product_id")
            .select("promotions.*", "products.name", "products.price", "products.thumbnail")
            .limit(limit).offset(offset)
        const count = await knex("promotions").where("shop_id", shopId).count("id as total");
        return {
            data: res,
            total: count[0].total
        };
    }

    static async getAllProductsOnPromotion({ shopId, search, limit, offset }) {
        const query = knex("products")
            .whereNotIn("products.id", function () {
                this.select("promotions.product_id")
                    .from("promotions")
                    .where("promotions.shop_id", shopId)
            })
            .where("products.is_delete", 0)
            .where("products.shop_id", shopId)
            .select("products.*")
            .limit(limit).offset(offset)
        if (search) {
            query.where('products.name', 'like', `%${search}%`)
        }
        const res = await query
        return {
            data: res,
        };
    }
    static async updatePromotionStatus(shopId) {
        try {

            const currentTime = new Date();
            // Cập nhật trạng thái thành 'expired' cho các khuyến mại đã hết hạn
            await knex('promotions')
                .where('end_date', '<', currentTime)
                .andWhere('status', '!=', 'expired')
                .andWhere('shop_id', shopId)
                .update({
                    status: 'expired'
                });

            // Cập nhật trạng thái thành 'upcoming' cho các khuyến mại chưa bắt đầu
            await knex('promotions')
                .where('start_date', '>', currentTime)
                .andWhere('status', '!=', 'upcoming')
                .andWhere('shop_id', shopId)

                .update({
                    status: 'upcoming'
                });
            // Cập nhật trạng thái thành 'active' cho các khuyến mại đang diễn ra
            await knex('promotions')
                .where('start_date', '<=', currentTime)
                .andWhere('shop_id', shopId)
                .andWhere('end_date', '>=', currentTime)
                .andWhere('status', '!=', 'active')
                .update({
                    status: 'active'
                });
        } catch (error) {
            console.error('Error updating promotion statuses:', error);
        }
    };
    // change status discount
    static async changeStatusPromotion({ listId, value, shopId }) {
        return await knex('promotions').whereIn('id', listId).update({ is_active: value }).where('shop_id', shopId)
    }
    static async deleteToTrashPromotion({ listId, shopId }) {
        return await knex('promotions')
            .whereIn('id', listId)
            .andWhere('shop_id', shopId)
            .del();
    }
    static getCountStatusPromotion = async ({ shopId }) => {
        const response = await knex('promotions')
            .select(
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM promotions
                WHERE is_active != 0  AND shop_id = ? 
            ) AS countTotal`, [shopId]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM promotions
                WHERE is_active = 2  AND shop_id = ? 
            ) AS countActive`, [shopId]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM promotions
                WHERE is_active = 1  AND shop_id = ? 
            ) AS countUnActive`, [shopId]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM promotions
                WHERE is_active = 0 AND shop_id = ? 
            ) AS countTrash`, [shopId]
                )
            )
            .andWhere('shop_id', shopId)
            .first();

        return response
    }
}
module.exports = PromotionRepository