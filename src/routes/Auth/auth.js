const express = require('express');
const authController = require('../../controllers/authController');
const mPassport = require('../../middlewares/passport');
const User = require('../../../database/models/Users');
const passport = require('passport');
const multer = require('multer')
const setupMulter = require('../../middlewares/multer');


const authRouter = express.Router();

//destructured to get access to controller functions
const { login, register } = authController();
const { passportSerialize, passportStrategy } = mPassport(User, passport);
const { multerInit } = setupMulter(multer);

//initialize passport
passportSerialize();
passportStrategy();

//routes for login, register and image upload
authRouter.get('/login', (req, res) => res.render('auth/login', { error: req.flash('error') }));
authRouter.get('/register', (req, res) => res.render('auth/signup'));

//post routes
authRouter.post('/login', passport.authenticate("local", {
    failureRedirect: '/auth/login',
    failureFlash: true
}), login);
authRouter.post('/register', multerInit.single('image_url'), register);

//exported exoress router
module.exports = authRouter;      