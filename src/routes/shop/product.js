'use strict'
const express = require('express');
const asyncHandler = require('../../middlewares/asyncHandle');
const ProductController = require('../../controllers/product.controller');

const router = express.Router();
// get
router.get('/', asyncHandler(ProductController.getProductsByShop))
router.get('/trash', asyncHandler(ProductController.getProductsTrashByShop))
router.get('/inventory', asyncHandler(ProductController.getInventory))
router.get('/count-status', asyncHandler(ProductController.getCountStatusProduct))
router.get('/search-inventory', asyncHandler(ProductController.getAllProductAndVariant))
router.get('/:productId', asyncHandler(ProductController.getProductByShopWithId))
// edit
router.put('/:productId', asyncHandler(ProductController.editProductByShop))
router.patch('/change-status', asyncHandler(ProductController.changeStatusProduct))
// patch status
router.patch('/deletes', asyncHandler(ProductController.patchProductToDelete))
// delete
router.delete('/:id', asyncHandler(ProductController.deleteProducts))
// create
router.post('/', asyncHandler(ProductController.createProducts))

module.exports = router