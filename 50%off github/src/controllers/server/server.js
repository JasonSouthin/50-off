
const express = require('express');
const bodyParser = require('body-parser');
const expressStaticGzip = require('express-static-gzip');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const authRoutes = require('../routes/auth');

const errorController = require('../modelHandler/error');
const User = require('../models/user');
const MONGODB_URI = 'mongodb+srv://Jason:GclYlwsoNkbyyFUC@cluster0-thbmy.mongodb.net/shop?w=majority';

const app = express();
const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf({});

app.set('view engine', 'ejs');
app.set('views', './build');

app.use(bodyParser.urlencoded({extended: false}));

app.use("/", expressStaticGzip('./build', { index: false }));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.user = req.session.user;
    next();
})

app.use((req,res,next) => { 
    if (!req.session.user) { 
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if(!user){ 
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        next(new Error(err));
    });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => { 
    res.status(500).render('500', { 
        pageTitle: 'Errors!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(3000);
}).catch (err => {
    console.log(err);
})