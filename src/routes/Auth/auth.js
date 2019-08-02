const express = require('express');
const authController = require('../../controllers/authController')
const authRouter = express.Router();

//destructured to get access to controller functions
const { login, register } = authController();

//routes for login and register
authRouter.get('/login', login);
authRouter.get('/register', register)

//exported exoress router
module.exports = authRouter;      