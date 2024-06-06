"use strict"

const knex = require("../../database/database");
const { sortDiscount } = require("../../utils/filter");

/**
 * 1- create discount code 
 * 2- check discount code
 * 3- update discount code
 * 4- get All Discount Code on shop
 */
class DiscountRepository {

    // user
    static async getAllDiscountCodeTypeAll({ shopId }) {
        const discount = await knex
            .select('discounts.*', knex.raw("GROUP_CONCAT(discount_products.product_id) as productIds"))
            .from('discounts')
            .where('discounts.shop_id', shopId)
            .where("discounts.end_date", ">", new Date())
            .leftJoin('discount_products', 'discounts.id', 'discount_products.discount_id')
            .orderBy('discounts.created_at', 'desc')
            .groupBy('discounts.id');
        return discount
    }
    static async getAllDiscountCodeByProductId({ productId, shopId }) {
        const discount = await knex
            .select('discounts.*')
            .from('discounts')
            .leftJoin('discount_products', 'discounts.id', 'discount_products.discount_id')
            .where('discount_products.product_id', productId)
            .orWhere("discounts.applies_to", "all")
            .where('discounts.shop_id', shopId)
            .where("discounts.end_date", ">", new Date())
            .orderBy('discounts.created_at', 'desc');
        return discount
    }
    static async getDiscountByCode(code, shopId) {
        const discount = await knex
            .select('discounts.*')
            .from('discounts')
            .where('discounts.code', code)
            .where("shop_id", shopId)
            .first()
        return discount
    }
    static async checkDiscountProduct({ discountId, productId }) {
        const discount = await knex
            .select('discount_products.product_id')
            .from('discount_products')
            .where('discount_products.discount_id', discountId)
        return discount
    }
    static formathDiscountCode(data, user) {
        const formathData = {
            name: data.name,
            description: data.description,
            type: data.type,
            value: data.value,
            code: data.code,
            start_date: data.start_date,
            end_date: data.end_date,
            max_uses: data.max_uses,
            type_price: data.type_price,
            uses_count: data.uses_count,
            max_uses_per_user: data.max_uses_per_user,
            min_order_value: data.min_order_value,
            shop_id: user.id,
            is_active: data.is_active,
            applies_to: data.applies_to
        }
        return formathData
    }
    static buildQuery = (shopId, params = {}) => {
        let query = knex('discounts')
            .where('shop_id', shopId)
        if (params.search) {
            query.where('name', 'like', `%${params.search}%`).orWhere('code', 'like', `%${params.search}%`)
        }
        if (params.status === "active" || params.status === "expired" || params.status === "upcoming") {
            query.where('status', params.status)
        }
        if (params.active == 1 || params.active == 2 || params.active == 0) {
            query.where('is_active', params.active)
        }
        else if (params.active === "all") {
            query.where('is_active', "!=", 0)
        }
        if (params.applies_to) {
            query.where('applies_to', params.applies_to)
        }
        if (params.type) {
            query.where('type', params.type)
        }
        if (params.time_expired) {
            query.where('end_date', '<', new Date())
        }
        if (params.time_still) {
            query.where('end_date', '>=', new Date())

        }
        // sort by , createdAtAsc, nameDesc, nameAsc, priceDesc, priceAsc
        const sortBy2 = params.sortBy || 'createdAtDesc';
        const sort = sortDiscount(sortBy2)
        query.orderBy(sort.nameSort, sort.valueSort)
        return query;
    };
    // get discount code by id Shop
    static getDiscountByIdOnShop = async ({ id, shopId }) => {
        const data = await knex.from("discounts").where("id", id).where("shop_id", shopId).first()
        const dis_pro = await knex.from("discount_products").where("discount_id", id).select("products.id", "products.name", "products.slug", "products.thumbnail", "products.price", "products.quantity")
            .join("products", "discount_products.product_id", "products.id")
        return { ...data, products: dis_pro }
    }
    // count status discount code
    static getCountStatusDiscountCode = async ({ shopId }) => {
        const response = await knex('discounts')
            .select(
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM discounts
                WHERE is_active != 0 and is_delete = 0 AND shop_id = ? 
            ) AS countTotal`, [shopId]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM discounts
                WHERE is_active = 2 AND is_delete = 0 AND shop_id = ? 
            ) AS countActive`, [shopId]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM discounts
                WHERE is_active = 1 AND is_delete = 0 AND shop_id = ? 
            ) AS countUnActive`, [shopId]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM discounts
                WHERE is_active = 0 AND is_delete = 0 AND shop_id = ? 
            ) AS countTrash`, [shopId]
                )
            )
            .where('is_delete', 0)
            .andWhere('shop_id', shopId)
            .first();

        return response
    }
    // 1 create discount code
    static createDiscountCode = async (data, user) => {
        const formathData = this.formathDiscountCode(data, user)
        return await knex("discounts").insert(formathData)
    }
    // 2 check discount code
    static checkDiscountCode = async (code, shopId) => {
        const data = await knex.from("discounts").where("code", code).where("shop_id", shopId).first()
        return data
    }
    // 3 update discount code
    static updateDiscountCode = async (id, data, user) => {
        const formathData = this.formathDiscountCode(data, user)
        return await knex.from("discounts").where("id", id).update(formathData)
    }
    // 4 get All Discount Code on Shop
    static getAllDiscountCodeOnShop = async ({ shopId, limit, offset, search, active, sortBy, status }) => {
        // cập nhật lại status
        await this.updatePromotionStatus();
        const data = await this.buildQuery(shopId, { search, active, sortBy, status }).select([
            "id", "name", "description", "type", "value", "code", "start_date", "end_date", "is_active", "applies_to", "uses_count", "type_price", "status"
        ]).offset(offset).limit(limit).where('is_delete', 0)

        const total = await this.buildQuery(shopId).countDistinct("id as total").where('is_delete', 0)
        return { data, total: total[0].total }
    }
    // 5 add product ids to discount
    static addProductIdsToDiscount = async (data) => {
        return await knex("discount_products").insert(data)
    }
    // 6 delete product ids to discount
    static deleteProductIdsToDiscount = async (id) => {
        return await knex("discount_products").where("discount_id", id).del()
    }
    // 7 remove discount discount to trash
    static deleteDiscountToTrash = async (id) => {
        return await knex("discounts").where("id", id).update({ is_delete: 1, is_active: 0 })
    }
    // 8 update active discount
    static patchDiscountActive = async (id) => {
        return await knex("discounts").where("id", id).update({ is_active: 1 })
    }

    // 9 update unactive discount
    static patchDiscountUnActive = async (id) => {
        return await knex("discounts").where("id", id).update({ is_active: 0 })
    }

    // 10 get all discount trash
    static getAllDiscountTrashCodeOnShop = async ({ shopId, limit, offset, search }) => {
        const data = await this.buildQuery(shopId, { search, active, sortBy }).select([
            "id", "name", "description", "type", "value", "code", "start_date", "end_date", "is_active", "applies_to", "uses_count", "status"
        ]).where("is_delete", 1).offset(offset).limit(limit)
        const total = await this.buildQuery(shopId, { search }).countDistinct("id as total").where("is_delete", 1)
        return { data, total: total[0].total }
    }
    // 11 delete discount
    static deleteDiscount = async (id) => {
        return await knex("discounts").where("id", id).del()
    }
    // 12 restore discount
    static patchDiscountRestore = async (id) => {
        return await knex("discounts").where("id", id).update({ is_delete: 0 })
    }
    static patchDiscountUsed = async ({ id, history }) => {
        return await knex("discounts").where("id", id).update({ uses_count: knex.raw("uses_count + 1"), history })
    }
    static async changeStatusDiscount({ listId, value, shopId }) {
        return await knex('discounts').whereIn('id', listId).update({ is_active: value }).where('shop_id', shopId)
    }
    static async deleteToTrashDiscount({ listId, shopId }) {
        return await knex('discounts')
            .whereIn('id', listId)
            .andWhere('shop_id', shopId)
            .update({ is_delete: 1, is_active: 0 });
    }
    static async updatePromotionStatus() {
        try {

            const currentTime = new Date();
            // Cập nhật trạng thái thành 'expired' cho các khuyến mại đã hết hạn
            await knex('discounts')
                .where('end_date', '<', currentTime)
                .andWhere('status', '!=', 'expired')
                .update({
                    status: 'expired'
                });

            // Cập nhật trạng thái thành 'upcoming' cho các khuyến mại chưa bắt đầu
            await knex('discounts')
                .where('start_date', '>', currentTime)
                .andWhere('status', '!=', 'upcoming')
                .update({
                    status: 'upcoming'
                });

            // Cập nhật trạng thái thành 'active' cho các khuyến mại đang diễn ra
            await knex('discounts')
                .where('start_date', '<=', currentTime)
                .andWhere('end_date', '>=', currentTime)
                .andWhere('status', '!=', 'active')
                .update({
                    status: 'active'
                });
        } catch (error) {
            console.error('Error updating promotion statuses:', error);
        }
    };

}
module.exports = DiscountRepository