exports.getLogin = (request, response, next) => {
    console.log(request.get('Cookie'));
    response.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: request.isLoggedIn
    });
};

exports.postLogin = (request, response, next) => {
    response.setHeader('Set-Cookie', 'loggedIn=true');
	response.redirect('/');
};