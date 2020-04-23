const crypto = require('crypto');

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const Shop = require('../models/shop');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: { 
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message && message.length > 0) { 
        message = message[0];
    } else { 
        message = null;
    }
    res.render('login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: { 
            email: '',
            password: ''
        },
        validationErrors: []
      });
  };
  
  exports.getSignup = (req, res, next) => { 
    let message = req.flash('error');
    if (message && message.length > 0) { 
        message = message[0];
    } else { 
        message = null;
    }
    res.render('signup', {
        path: '/signup',
        pageTitle: 'signup',
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: '',
            logo: '',
            location: '',
            name: ''
        },
        validationErrors: []
      });
  } 

  exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if( !errors.isEmpty() ) { 
        console.log(errors);
        return res.status(422).render('login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: { 
                email: email,
                password: password
            },
            validationErrors: errors.array()
          });
    }
    User.findOne({email: email})
    .then(user => {
        if (!user){ 
            return res.status(422).render('login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid Email or password.',
                oldInput: { 
                    email: email,
                    password: password
                },
                validationErrors: []
              });
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => { 
            if ( doMatch ) { 
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                });
            } 
            return res.status(422).render('login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid Email or password.',
                oldInput: { 
                    email: email,
                    password: password
                },
                validationErrors: []
              });
        })
        .catch(err => { 
            console.log(err);
            res.redirect('/login');
        });


    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
  };
  
  exports.postLogout = (req, res, next) => {
    
    req.session.destroy((err) => { 
        console.log(err);
        res.redirect('/');
    });

  };

    exports.postSignup = (req,res,next) => {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const isShop = req.body.isShop === 'on';
        const location = req.body.location ? req.body.location: null;
        const logo = req.body.logo ? req.body.logo: null;
        const errors = validationResult(req);
        
        if( !errors.isEmpty() ) { 
            console.log(errors.array());
            return res.status(422).render('signup', {
                path: '/signup',
                pageTitle: 'signup',
                errorMessage: errors.array()[0].msg,
                oldInput: { email: email, password: password, confirmPassword: req.body.confirmPassword, logo: logo, location: location, name: name, isShop: isShop },
                validationErrors: errors.array()
              });
        }
        bcrypt.hash(password, 12)        
            .then(hashedPassword => { 
                if (!isShop) { 
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        isShop: isShop,
                        cart: { items: [] }
                    });
                    return user.save();
                } else { 
                    
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        isShop: isShop,
                        cart: { items: [] }
                    }); 

                    user.save().then(() => { 
                        User.findOne({email: email})
                        .then(user => {
                            const shop = new Shop({
                                _id: user._id,
                                name: name,
                                email: email,
                                location: location,
                                password: hashedPassword,
                                logo: logo,
                                isShop: isShop,
                                cart: { items: [] }
                            })
                            return shop.save();
                        })        
                        .catch(err => {
                            const error = new Error(err);
                            error.httpStatusCode = 500;
                            return next(error);
                        });
                      
                    })        
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    });

                    
                }

            })
        .then(result => {
            return transporter.sendMail({
                to: email,
                from: 'jasonsouthin@gmail.com',
                subject: 'Signup Succeeded',
                html: '<h1> You successfully signed up!</h1>'
            }).then(() => { 
                res.redirect('/login');
            })        
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });

        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    };

exports.getReset = (req, res, next) => { 
    let message = req.flash('error');
    if (message && message.length > 0) { 
        message = message[0];
    } else { 
        message = null;
    }

    res.render('reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
      });
}
  
exports.postReset = (req, res, next) => { 
    crypto.randomBytes(32, (err, buffer) => {
        if (err){ 
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user => { 
            if (!user) { 
                req.flash('error', 'No account with that email found');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        }).then(result => { 
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'jasonsouthin@gmail.com',
                subject: 'Password Reset',
                html: `
                <p> You requested a password reset</p>
                <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password. </p>
                `
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    })
}

exports.getNewPassword = (req, res, next) => { 
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => { 
        let message = req.flash('error');
        if (message && message.length > 0) { 
            message = message[0];
        } else { 
            message = null;
        }

        res.render('new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
        });
    })        
    .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
    });
}

exports.postNewPassword = (req, res, next) => { 
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken, 
        resetTokenExpiration: {$gt: Date.now()},
        _id: userId
    }).then(user => { 
        resetUser = user;
        bcrypt.hash(newPassword, 12)
        .then(hashedPassword => { 
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
    })
    .then(result => {
        console.log(resetUser)
        res.redirect('/');
        transporter.sendMail({
            to: resetUser.email,
            from: 'jasonsouthin@gmail.com',
            subject: 'Password Reset',
            html: `
            <h1>Password Reset</h1>
            <p> You have successfully reset your password </p>
            `
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}