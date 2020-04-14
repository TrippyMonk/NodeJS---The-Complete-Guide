exports.getLogin = (request, response, next) => {
    console.log(request.get('Cookie'));
    response.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: request.isLoggedIn
    });
};

exports.postLogin = (request, response, next) => {
    request.session.isLoggedIn = true;
	response.redirect('/');
};