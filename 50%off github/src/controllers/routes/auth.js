const express = require('express');
const { check, body } = require('express-validator/check');
const router = express.Router();
const authController = require('../modelHandler/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/login', 
[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
    body('password', 'Password has to be valid.').isLength({min: 8}).isAlphanumeric().trim()
],
authController.postLogin);

router.post('/logout', authController.postLogout);

router.post('/signup', 
[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
       return User.findOne({email: value})
        .then(userDoc => { 
            if (userDoc) { 
                return Promise.reject('E-mail exists already, please use a different one.');
            }
        });
    })
    .normalizeEmail(),
    body('password', 'Please enter a password with only numbers and text with at least 5 characters.').isLength({min: 8}).isAlphanumeric().trim(),
    body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
        if ( value !== req.body.password){ 
            throw new Error('Passwords have to match!');
        }
        return true;
    })
]

, authController.postSignup);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);


module.exports = router;