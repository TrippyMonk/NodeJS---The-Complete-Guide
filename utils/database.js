const mongodb = require('mongodb');                                     //gives access to MongoDB package
const MongoClient = mongodb.MongoClient;                                //Extract a Mongo Client Constructor

let _db;                                                                //_ shows that the variable will only be used locally in this file

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://TrippyMonk:Bushki11er@cluster0-moygw.mongodb.net/shop?retryWrites=true&w=majority')               //Creates connection to MongoDB
        .then(client => {
            console.log('Connected');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database Found!';
};

exports.mongoConnect = mongoConnect;                    //Exports connection to MongoDB client
exports.getDb = getDb;                                  //Exports connection to shop database