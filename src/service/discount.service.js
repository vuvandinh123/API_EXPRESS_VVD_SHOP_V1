'use strict'

const { BadRequestError } = require("../core/error.response");
const DiscountRepository = require("../models/repositories/Discount.repo");
const { checkRoleUserId } = require("../models/repositories/user.repo");
const { caculatorDiscount } = require("../utils");

/**
 * Discount service
 * 1- generator code [shop,admin]
 * 2- get discount amount [user]
 * 3- get all discount code on shop [user]
 * 4- verify discount code [user]
 * 
 */
class DiscountService {


    // user
    static async getAllDiscountCodeByProductId({ productId, shopId }) {
        return await DiscountRepository.getAllDiscountCodeByProductId({ productId, shopId })
    }
    static async getAllDiscountCodeTypeAll({ shopId }) {
        return await DiscountRepository.getAllDiscountCodeTypeAll({ shopId })
    }
    static async usedCodeAndVerify({ code, shop_id }, user) {
        const discount = await DiscountRepository.getDiscountByCode(code, shop_id)
        let historyUsed = discount?.history
        let usedUser = {
            isUser: false,
            used_count: 0
        };
        if (historyUsed) {
            for (let i = 0; i < historyUsed.length; i++) {
                if (historyUsed[i].user_id == user.id) {
                    usedUser.isUser = true;
                    usedUser.used_count = historyUsed[i].used_count,
                        usedUser.index = i
                }
            }
        }
        // return historyUsed
        if (!discount || discount.shop_id != shop_id) {
            throw new BadRequestError("Discount code not found")
        }
        if (discount.end_date < new Date()) {
            throw new BadRequestError("Discount code is expired")
        }
        if (discount.is_active == 0) {
            throw new BadRequestError("Discount code is not active")
        }
        if (discount.applies_to == "all") {
            return {
                id: discount.id,
                value: discount.value,
                name: discount.name,
                type_price: discount.type_price,
                applies_to: discount.applies_to
            }
        }
        else {
            const discountProduct = await DiscountRepository.checkDiscountProduct({ discountId: discount.id })
            const productIds = discountProduct.map(item => item.product_id)
            return {
                value: discount.value,
                type_price: discount.type_price,
                name: discount.name,
                applies_to: discount.applies_to,
                productIds
            }
        }
    }
    static async removeVoucherCode({ code, shop_id, product_id, price }, user) {
        const discount = await DiscountRepository.getDiscountByCode(code)
        let historyUsed = discount?.history
        let usedUser = {
            isUser: false,
            used_count: 0
        };
        if (historyUsed) {
            for (let i = 0; i < historyUsed.length; i++) {
                if (historyUsed[i].user_id == user.id) {
                    usedUser.isUser = true;
                    usedUser.used_count = historyUsed[i].used_count,
                        usedUser.index = i
                }
            }
        }
    }
    // shop
    static async createDiscountCode(body, user) {
        if (new Date(body.end_date) < new Date(body.start_date)) {
            throw new BadRequestError("End date must be greater than start date")
        }
        const isDiscountCode = await DiscountRepository.checkDiscountCode(body.code, user.id)
        if (isDiscountCode) {
            throw new BadRequestError("Discount code already exists")
        }
        if (body.type == "percent") {
            if (body.value > 100) {
                throw new BadRequestError("Value must be less than 100")
            }
        }
        if (body.type == "fixed") {
            if (body.value < 0) {
                throw new BadRequestError("Value must be greater than 0")
            }
        }
        if (body.min_order_value < 0) {
            throw new BadRequestError("Value must be greater than 0")
        }
        const newDiscount = await DiscountRepository.createDiscountCode(body, user);
        if (newDiscount == null) {
            throw new BadRequestError("Create discount code failed")
        }
        if (body.applies_to == "specific") {
            if (body.productIds.length == 0) {
                throw new BadRequestError("Products not found")
            }
            const arrDiscountProduct = [];
            body.productIds.forEach(async (productId) => {
                arrDiscountProduct.push({ discount_id: newDiscount[0], product_id: productId })
            })
            await DiscountRepository.addProductIdsToDiscount(arrDiscountProduct)
        }
        return newDiscount

    }
    static async updateDiscountCode(id, updateBody, user) {
        const existingDiscount = await DiscountRepository.checkDiscountCode(updateBody.code, user.id);

        if (existingDiscount && existingDiscount.id != id) {
            throw new BadRequestError("Discount code already exists");
        }

        if (updateBody.end_date < updateBody.start_date) {
            throw new BadRequestError("End date must be greater than start date");
        }

        if (updateBody.applies_to === "specific" && updateBody.productIds.length === 0) {
            throw new BadRequestError("Products not found");
        }

        if (updateBody.type_price === "percent" && updateBody.value > 100) {
            throw new BadRequestError("Value must be less than 100");
        }

        if (updateBody.type_price === "fixed_amount" && updateBody.value < 0) {
            throw new BadRequestError("Value must be greater than 0");
        }

        if (updateBody.min_order_value < 0) {
            throw new BadRequestError("Min order value must be greater than 0");
        }

        await DiscountRepository.deleteProductIdsToDiscount(id);

        if (updateBody.applies_to === "specific") {
            const discountProductIds = updateBody.productIds.map(productId => ({
                discount_id: id,
                product_id: productId,
            }));

            await DiscountRepository.addProductIdsToDiscount(discountProductIds);
        }

        return await DiscountRepository.updateDiscountCode(id, updateBody, user);
    }
    static async getAllDiscountCodeOnShop({ shopId, limit, offset, search, active, sortBy, status }) {
        const shop = await checkRoleUserId(shopId)
        if (shop.role != "SHOP") {
            throw new BadRequestError("You are not shop")
        }
        const discounts = await DiscountRepository.getAllDiscountCodeOnShop({ shopId, limit, offset, search, active, sortBy, status });
        return discounts
    }

    static async getAllDiscountTrashCodeOnShop({ shopId, limit, offset, search }) {
        const shop = await checkRoleUserId(shopId)
        if (shop.role != "SHOP") {
            throw new BadRequestError("You are not shop")
        }
        const discounts = await DiscountRepository.getAllDiscountTrashCodeOnShop({ shopId, limit, offset, search });
        return discounts
    }
    // lấy discount theo id
    static async getDiscountByIdOnShop({ id, shopId }) {
        const discount = await DiscountRepository.getDiscountByIdOnShop({ id, shopId })
        return discount
    }
    static async getCountStatusDiscountCode({ shopId }) {
        const discount = await DiscountRepository.getCountStatusDiscountCode({ shopId })
        return discount
    }
    static async deleteProductIdsToDiscount(id) {
        return await DiscountRepository.deleteProductIdsToDiscount(id)
    }
    static async deleteDiscountToTrash(id) {
        return await DiscountRepository.deleteDiscountToTrash(id)
    }
    static async deleteDiscount(id) {
        return await DiscountRepository.deleteDiscount(id)
    }
    static async patchDiscountActive(id) {
        return await DiscountRepository.patchDiscountActive(id)
    }
    static async patchDiscountUnActive(id) {
        return await DiscountRepository.patchDiscountUnActive(id)
    }
    static async patchDiscountRestore(id) {
        return await DiscountRepository.patchDiscountRestore(id)
    }
    static async changeStatusDiscount({ listId, value, shopId }) {
        return await DiscountRepository.changeStatusDiscount({ listId, value, shopId })
    }
    static async deleteToTrashDiscount({ listId, shopId }) {
        return await DiscountRepository.deleteToTrashDiscount({ listId, shopId })
    }
}
module.exports = DiscountService