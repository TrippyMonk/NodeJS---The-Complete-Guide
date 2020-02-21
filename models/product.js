const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

//Helper Function called from inside the class
const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if(err) {
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    constructor(id, title, imageURL, description, price) {
        this.id = id;
        this.title = title;          //For every product we create we will call new Product([product title])
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id ===id);
            const updatedProducts = products.filter(prod => prod.id !== id);           //Keeps all items that don't have a matching ID to what we want to delete
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {             //static allows us to call the function on the class itself, instead of an instantiated object
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);                                        //The callback has something to do with asynchronicity.  The product ID can't be returned until getProductsFromFile has finished reading the file.  The callback lets you know when that has happened, and then executes?  See 119 Q&A 
        });
    }
}