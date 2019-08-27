/* eslint-disable camelcase */
const bcrypt = require('bcryptjs');
const debug = require('debug')('app:authController');

const salt = bcrypt.genSaltSync(10);
const responseHandler = require('../responseHandler/response');

function authController(Users) {
  function login(req, res) {
    req.session.user_id = req.user.id;
    res.redirect('/home');
  }

  function register(req, res) {
    // initialize error handler
    const { success, error } = responseHandler(req, res);
    const { first_name } = req.body;
    let image;
    const { last_name } = req.body;
    const { email } = req.body;
    const { username } = req.body;
    const { password } = req.body;
    if (req.file) {
      image = req.file.filename;
      debug(req.file);
    }
    if (req.file) {
      // hash password using bcyrpt
      const hash = bcrypt.hashSync(password, salt);
      Users.findOrCreate({
        where: { email },
        defaults: {
          first_name,
          last_name,
          email,
          image_url: image,
          username,
          password: hash,
        },
      })
        .then(([users, created]) => {
          if (created) {
            const user = users.get({ plain: true });
            req.session.user_id = user.id;
            success('/auth/login', 'success');
          } else {
            error('Email or username already in use', 'Auth/signup');
          }
        }).catch((err) => error(err));
    } else {
      error('please select an image', 'Auth/signup');
    }
  }

  return {
    login,
    register,
  };
}
module.exports = authController;
