"use strict";

const CommentRepository = require("../models/repositories/comment.repo");


class CommentService {
  static async getCommentByIdProduct({ productId }) {
    const comment = await CommentRepository.getCommentByIdProduct({ productId });
    return comment
  }
  static async getReviewStatistics({ productId }) {
    const comment = await CommentRepository.getReviewStatistics({ productId });
    return comment
  }
  static async createComment({ productId, userId, review, start, order_detail_id, images, sku }) {
    const comment = await CommentRepository.createComment({ productId, userId, review, start, order_detail_id, images, sku });
    return comment
  }
}
module.exports = CommentService;
