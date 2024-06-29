const knex = require("../../database/database");

class CommentRepository {
  static async getCommentByIdProduct({ productId }) {
    const comments = await knex.select("reviews.id", "reviews.review","reviews.images","reviews.sku", "reviews.start", "users.firstName", "users.lastName", "users.image", "reviews.created_at")
      .from("reviews")
      .join("users", "users.id", "reviews.user_id")
      .where("reviews.product_id", productId)
      .orderBy("reviews.created_at", "desc")

    return comments
  }
  static async getReviewStatistics({ productId }) {
    // Lấy tổng số đánh giá cho sản phẩm
    const totalReviews = await knex('reviews')
      .where({ product_id: productId })
      .count('* as count')
      .first();

    // Lấy số lượng của từng đánh giá (1-5 sao)
    const reviewCounts = await knex('reviews')
      .select('start')
      .count('* as count')
      .where({ product_id: productId })
      .groupBy('start');
    const reviewCountsMap = {};
    reviewCounts.forEach(review => {
      reviewCountsMap[review.start] = review.count;
    });

    // Tính toán phần trăm của từng đánh giá từ 1 đến 5 sao
    const reviewStatistics = [];
    for (let rating = 5; rating >= 1; rating--) {
      const count = reviewCountsMap[rating] || 0;
      const percentage = totalReviews.count ? (count / totalReviews.count) * 100 : 0;
      reviewStatistics.push({
        rating: rating,
        count: count,
        percentage: percentage
      });
    }

    return reviewStatistics;
  };

  static async createComment({ productId, userId, review, start, order_detail_id, images = [] }) {
    const isOrder = await knex("order_details")
      .where("order_details.id", order_detail_id)
      .join("orders", "orders.id", "order_details.order_id")
      .where("orders.user_id", userId)
      .where("order_details.is_review", 0)
      .first();
    const listImage = JSON.stringify(images)
    if (isOrder) {
      await knex("order_details")
        .where("order_details.id", order_detail_id)
        .update({ is_review: 1 })
      return await knex("reviews").insert({ product_id: productId, user_id: userId, review, start, images: listImage })
    }

    return false
  }
}
module.exports = CommentRepository