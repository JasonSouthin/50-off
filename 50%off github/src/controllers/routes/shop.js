
const express = require('express');
const shopController = require('../modelHandler/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item',isAuth,  shopController.postCartDeleteProduct);

// // router.get('/checkout', shopController.getCheckout);





// router.get('/orders', shopController.getOrders);


module.exports = router;
