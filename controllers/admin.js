const Product = require('../models/product');

exports.getAddProduct = (request, response, next) => {
    response.render('admin/edit-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (request, response, next) => {
    const title = request.body.title;                    //req.body.title points to the input of the add-product form with attribute name="title"
    const imageURL = request.body.imageURL;              //req.body.imageURL points to the input of the add-product form with attribute name="imageURL"
    const price = request.body.price;                    //req.body.price points to the input of the add-product form with attribute name="price"
    const description = request.body.description;        //req.body.description points to the input of the add-product form with attribute name="description"
    Product.create({
        title: title,
        price: price,
        imageURL: imageURL,
        description: description
    })
        .then(result => {
            // console.log(result);
            console.log('Created Product');
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
    Product.findById(prodId, product => {
        if (!product) {
            return response.redirect('/');
        }
        response.render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (request, response, next) => {
    const prodId = request.body.productId;
    const updatedTitle = request.body.title;
    const updatedPrice = request.body.price;
    const updatedURL = request.body.imageURL;
    const updatedDescription = request.body.description;

    const updatedProduct = new Product(prodId, updatedTitle, updatedURL, updatedDescription, updatedPrice);
    updatedProduct.save();
    response.redirect('/admin/products');
};

exports.getProducts = (request, response, next) => {
    Product.fetchAll((products) => {
        response.render('admin/products', {
            pageTitle: 'Admin Products', 
            prods: products, 
            path: '/admin/products', 
        });
    });
};

exports.postDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId;
    Product.deleteById(prodId);
    response.redirect('/admin/products');
};