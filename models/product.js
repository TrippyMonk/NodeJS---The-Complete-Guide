const getDb = require('../utils/database').getDb;                                   //Imports access to the shop databse instead of the MongoDB client

class Product {
    constructor(title, price, imageURL, description) {
        this.title = title;
        this.price = price;
        this.imageURL = imageURL;
        this.description = description;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this)
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;