//What the shop users see
//Core Modules
const path = require('path');

//3rd Party Modules
const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productID', shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.addToCart);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

module.exports = router;