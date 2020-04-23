exports.get404 = (req, res, next) => {

    res.status(404).render('404', { 
        pageTitle: 'Page Not Found! Sick',
        path: '/404',
        isAuthenticated: req.session.isLoggedIn
    });

};

exports.get500 = (req, res, next) => {

    res.status(500).render('500', { 
        pageTitle: 'Error, a problem occured!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });

};