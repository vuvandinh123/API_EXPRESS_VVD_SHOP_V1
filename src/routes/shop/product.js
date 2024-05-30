'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ProductController = require('../../controllers/product.controller');

const router = express.Router();
// get
router.get('/products', asyncHandler(ProductController.getProductsByShop))
router.get('/products/trash', asyncHandler(ProductController.getProductsTrashByShop))
router.get('/products/inventory', asyncHandler(ProductController.getInventory))
router.get('/products/count-status', asyncHandler(ProductController.getCountStatusProduct))
router.get('/products/search-inventory', asyncHandler(ProductController.getAllProductAndVariant))
router.get('/products/:productId', asyncHandler(ProductController.getProductByShopWithId))
// edit
router.put('/products/:productId', asyncHandler(ProductController.editProductByShop))
router.patch('/products/change-status', asyncHandler(ProductController.changeStatusProduct))
// patch status
router.patch('/products/deletes', asyncHandler(ProductController.patchProductToDelete))
// delete
router.delete('/products/:id', asyncHandler(ProductController.deleteProducts))
// create
router.post('/products', asyncHandler(ProductController.createProducts))

module.exports = router