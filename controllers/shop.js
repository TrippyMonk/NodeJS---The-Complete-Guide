const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (request, response, next) => {
    Product.fetchAll((products) => {
        response.render('shop/product-list', {
            pageTitle: 'All Products', 
            prods: products, 
            path: '/products', 
        });
    });
};

exports.getProduct = (request, response, next) => {
    const prodId = request.params.productID;
    Product.findById(prodId, product => {                               //Product is the class we are importing from models.  findById is a method of that class
        response.render('shop/product-detail', {
            pageTitle: product.title,                                 //gives us the Page Title for the web page
            product: product,                                         //product on left is an object key: product on right is the single product we are retrieving in function
            path: '/products'                                         //tells which part of the navigation to highlight as active
        });
    });
};

exports.getIndex = (request, response, next) => {
    Product.fetchAll((products) => {
        response.render('shop/index', {
            pageTitle: 'My Shop', 
            prods: products, 
            path: '/', 
        });
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