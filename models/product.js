const db = require('../utils/database');
const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, imageURL, description, price) {
        this.id = id;
        this.title = title;          //For every product we create we will call new Product([product title])
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products (title, price, description, imageURL) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageURL]);
    }

    static deleteById(id) {

    }

    static fetchAll() {             //static allows us to call the function on the class itself, instead of an instantiated object
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}