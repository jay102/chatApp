const express = require('express');
const homeController = require('../../controllers/homeController');
const router = express.Router();


function homeRouter() {
    const { getAllUsers } = homeController();

    router.use(function timeLog(req, res, next) {
        if (req.session.user_id) {
            next()
        } else {
            res.redirect('/auth/login')
        }

    })
    router.route('/')
        .get(getAllUsers);
    return router;
}
module.exports = homeRouter;