const { OK, CREATED } = require("../core/success.response")
const CommentService = require("../service/comment.service")


class CommentController {

    static async getCommentByIdProduct(req, res) {
        const productId = req.params.productId
        const comments = await CommentService.getCommentByIdProduct({ productId })
        new OK({
            message: "Get all comments successfully",
            data: comments
        }).send(res)
    }
    static async getReviewStatistics(req, res) {
        const productId = req.params.productId
        const reviewStatistics = await CommentService.getReviewStatistics({ productId })
        new OK({
            message: "Get review statistics successfully",
            data: reviewStatistics
        }).send(res)
    }
    static async createComment(req, res) {
        const { productId, review, start, order_detail_id, images,sku } = req.body
        const comment = await CommentService.createComment({ productId, userId: req.user.id, review, start, order_detail_id, images,sku })
        new CREATED({
            message: "Create comment successfully",
            data: comment
        }).send(res)
    }
}
module.exports = CommentController