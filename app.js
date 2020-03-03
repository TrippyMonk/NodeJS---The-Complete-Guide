//Core Modules
const path = require('path');

// 3rd Party Packages
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');        //This is the default path, so this line really isn't necessary

//Route Imports
const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         request.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err));
    next();
});

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.pageNotFound);

mongoConnect(() => {
    app.listen(3000);
});