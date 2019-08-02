

function authController() {

    function login(req, res) {
        res.render('Auth/login');
    }

    function register(req, res) {
        res.render('home/home');
    }

    return {
        login,
        register
    }
}

module.exports = authController;