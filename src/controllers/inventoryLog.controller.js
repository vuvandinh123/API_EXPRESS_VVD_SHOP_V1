const { OK, CREATED } = require("../core/success.response")
const BrandService = require("../service/brand.service")
const InventoryLogService = require("../service/inventoryLog.service")


class InventoryLogController {

    static async createInventoryLog(req, res) {
        const data = req.body
        const inventory = await InventoryLogService.createInventoryLog(data, req.user)
        new CREATED({
            message: "CREATE INVENTORY LOG SUCCESSFULLY",
            data: inventory
        }).send(res)
    }
    static async getVariantFirebaseById(req, res) {
        const id = req.params.productId
        const variant = await InventoryLogService.getVariantFirebaseById(id)
        new OK({
            message: "Get variant successfully",
            data: variant
        }).send(res)
    }
    static async getAllInventoryLog(req, res) {
        const limit = req.query.limit ?? 5
        const month = req.query.month
        const page = req.query.page ?? 1
        const offset = (page - 1) * limit
        const { total, data } = await InventoryLogService.getAllInventoryLog({ limit, offset, month }, req.user)
        const totalPage = Math.ceil(total / limit);
        console.log(total, limit);
        const options = {
            count: total,
            pagination: {
                totalPage,
                page,
                limit
            }
        };
        new OK({
            message: "Get inventory successfully",
            data: data,
            options
        }).send(res)
    }
    static async getInventoryLogById(req, res) {
        const id = req.params.id
        const inventory = await InventoryLogService.getInventoryLogById(id, req.user)
        new OK({
            message: "Get inventory successfully",
            data: inventory
        }).send(res)
    }
    static async getTotalAmountInventoryLog(req, res) {
        const total = await InventoryLogService.getTotalAmountInventoryLog(req.user)
        new OK({
            message: "Get total amount inventory successfully",
            data: total
        }).send(res)
    }
}
module.exports = InventoryLogController