const express = require('express');
const multer = require('multer');
const passport = require('passport');
const authController = require('../../controllers/authController');
const mPassport = require('../../middlewares/passport');
const User = require('../../../database/models/Users');
const setupMulter = require('../../middlewares/multer');
const Users = require('../../../database/models/Users');


const authRouter = express.Router();

// destructured to get access to controller functions
const { login, register } = authController(Users);
const { passportSerialize, passportStrategy } = mPassport(User, passport);
const { multerInit } = setupMulter(multer);

// initialize passport
passportSerialize();
passportStrategy();

// routes for login, register and image upload
authRouter.get('/login', (req, res) => res.render('Auth/login', { error: req.flash('error') }));
authRouter.get('/register', (req, res) => res.render('Auth/signup'));

// post routes
authRouter.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
  failureFlash: true,
}), login);
authRouter.post('/register', multerInit.single('image_url'), register);

// exported exoress router
module.exports = authRouter;
