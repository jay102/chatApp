

function responseHandler(req, res) {

    function error(message, route) {
        req.flash('error_msg', message);
        res.render(route, { error_msg: message })
    }

    function success(path, message) {
        req.flash('success_msg', message);
        res.redirect(path)
    }

    return {
        error,
        success
    }
}
module.exports = responseHandler;