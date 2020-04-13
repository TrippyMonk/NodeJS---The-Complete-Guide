const Product = require('../models/product');

exports.getProducts = (request, response, next) => {
    Product.findAll()
        .then(products => {
            response.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/',
                isAuthenticated: request.isLoggedIn
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
                path: '/products',
                isAuthenticated: request.isLoggedIn
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
                path: '/',
                isAuthenticated: request.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (request, response, next) => {
    request.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    response.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Shopping Cart',
                        products: products,
                        isAuthenticated: request.isLoggedIn
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.addToCart = (request, response, next) => {
    const prodId = request.body.productId;
    let fetchedCart;
    request.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: prodId}});
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            let newQuantity = 1;
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
            }
            return Product.findByPk(prodId)
                .then(product => {
                    return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
                })
                .catch(err => console.log(err));
        })
        .then(() => {
            response.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId;
    request.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id: prodId}});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            response.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postOrder = (request, response, next) => {
    let fetchedCart;
    request.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return request.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = {quantity: product.cartItem.quantity};                 //Gets the quantity of each product from the cart, and stores in the orderItem 
                        return product;
                    })
                );
            })
            .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            response.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (request, response, next) => {
    request.user.getOrders({include: ['products']})
        .then(orders => {
            response.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                isAuthenticated: request.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};