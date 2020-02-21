
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

    }

    static deleteById(id) {

    }

    static fetchAll() {             //static allows us to call the function on the class itself, instead of an instantiated object

    }

    static findById(id) {

    }
}