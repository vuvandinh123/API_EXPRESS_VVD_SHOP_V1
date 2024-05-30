'use strict'
const express = require('express');
const asyncHandler = require('../../../middlewares/asyncHandle');
const ProductController = require('../../../controllers/product.controller');

const router = express.Router();

router.get('/products', asyncHandler(ProductController.getProducts))
router.put('/products/:productId', asyncHandler(ProductController.editProduct))
router.get('/products/trash',asyncHandler(ProductController.getProductsTrash))
router.patch('/products/totrash/:productId',asyncHandler(ProductController.patchProductToTrash))
router.patch('/products/restore/:productId',asyncHandler(ProductController.patchProductRestore))

router.patch('products/trash/remove')
router.get('/products/:id', asyncHandler(ProductController.getById))
router.post('/products', asyncHandler(ProductController.createProducts))
router.delete('/products/:id', asyncHandler(ProductController.deleteProducts))
router.patch('/products/unactive/:productId', asyncHandler(ProductController.patchProductUnActive))
router.patch('/products/active/:productId', asyncHandler(ProductController.patchProductActive))
// router.get('/products/categories/:categoryId', asyncHandler(ProductController.getProductsByCategory))
// router.get('/products/:id', asyncHandler(ProductController.getById))
module.exports = router