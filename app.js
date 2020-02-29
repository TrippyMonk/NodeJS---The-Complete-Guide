//Core Modules
const path = require('path');

// 3rd Party Packages
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');        //This is the default path, so this line really isn't necessary

//Route Imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
    User.findByPk(1)
        .then(user => {
            request.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.pageNotFound);

//Set Sequelize Associations
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
// Cart.belongTo(User);                                                Not necessary if User.hasOne(Cart) is already entered
Cart.belongsToMany(Product, {through: CartItem});                                          //One cart can hold many different products
Product.belongsToMany(Cart, {through: CartItem});                                          //One product can be in many different carts
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize.sync()                                                      //This is triggered by NPM Start, not by requests from a web server
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({name: 'Blake', email: 'blake.stansell10@gmail.com'});
        }
        return user;
    })
    .then(user => {
        // console.log(user);
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

