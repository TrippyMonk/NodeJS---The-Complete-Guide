const Product = require('../models/product');

exports.getAddProduct = (request, response, next) => {
    response.render('admin/edit-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (request, response, next) => {
    const title = request.body.title;                    //req.body.title points to the input of the add-product form with attribute name="title" in the body of the POST request
    const imageURL = request.body.imageURL;              //req.body.imageURL points to the input of the add-product form with attribute name="imageURL" in the body of the POST request
    const price = request.body.price;                    //req.body.price points to the input of the add-product form with attribute name="price" in the body of the POST request
    const description = request.body.description;        //req.body.description points to the input of the add-product form with attribute name="description" in the body of the POST
    const product = new Product(title, price, imageURL, description);
    product
        .save()
        .then(result => {
            // console.log(result);
            console.log('Created Product');
            response.redirect('/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (request, response, next) => {
    const editMode = request.query.edit;
    if (!editMode) {
        return response.redirect('/');
    }
    const prodId = request.params.productId;                //Because we use :productId in GET route
    request.user.getProducts({ where: {id: prodId} })
    // Product.findByPk(prodId)
        .then(products => {
            const product = products[0];
            if (!product) {
                return response.redirect('/');
            }
            response.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (request, response, next) => {
    const prodId = request.body.productId;
    const updatedTitle = request.body.title;
    const updatedPrice = request.body.price;
    const updatedURL = request.body.imageURL;
    const updatedDescription = request.body.description;

    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageURL = updatedURL;
            product.description = updatedDescription;
            return product.save();                                             //Returns the Save to Database
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            response.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};

exports.getProducts = (request, response, next) => {
    request.user.getProducts()
        .then(products => {
            response.render('admin/products', {
                pageTitle: 'Admin Products', 
                prods: products, 
                path: '/admin/products', 
            });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Product Deleted!');
            response.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};