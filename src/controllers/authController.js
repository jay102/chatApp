const Users = require('../../database/models/Users');
const responseHandler = require('../responseHandler/response');
const debug = require('debug')('app:authController')
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);


function authController() {

    function login(req, res) {
        req.session.user_id = req.user.id;
        res.redirect('/home');
    }

    function register(req, res) {
        //initialize error handler
        const { success, error } = responseHandler(req, res);
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const image = req.file.filename;

        //hash password using bcyrpt

        let hash = bcrypt.hashSync(password, salt);
        Users.findOrCreate({
            where: { email: email },
            defaults: {
                first_name: first_name,
                last_name: last_name,
                email: email,
                image_url: image,
                username: username,
                password: hash,
            }
        })
            .then(([users, created]) => {
                if (created) {
                    const user = users.get({ plain: true })
                    req.session.user_id = user.id;
                    success('/auth/login', "success")
                } else {
                    error("Email or username already in use", 'Auth/signup');
                }
            }).catch(err => error(err));
    }

    return {
        login,
        register
    }
}

module.exports = authController;