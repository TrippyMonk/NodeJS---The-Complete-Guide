const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (request, response, next) => {
    Product.findAll()
        .then(products => {
            response.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProduct = (request, response, next) => {
    const prodId = request.params.productID;
    Product.findByPk(prodId)
        .then(product => {
            response.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (request, response, next) => {
    Product.findAll()
        .then(products => {
            response.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (request, response, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            response.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Shopping Cart',
                products: cartProducts
            });
        });
    });
};

exports.addToCart = (request, response, next) => {
    const prodId = request.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    response.redirect('/cart');
};

exports.postCartDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        response.redirect('/cart');
    });
};

exports.getOrders = (request, response, next) => {
    response.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (request, response, next) => {
    response.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};