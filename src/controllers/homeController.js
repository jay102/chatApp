
const Users = require('../../database/models/Users')
const debug = require('debug')('app:homeController');

function homeController() {

    function getFriends() {

    }
    function getAllUsers(req, res) {
        (async function () {
            try {
                const allusers = await Users.findAll({}).map(el => el.get({ plain: true }))
                const details = await Users.findOne({ where: { id: req.session.user_id } });
                const { dataValues } = details
                res.render('Home/home', { contacts: allusers, user: dataValues });
            } catch (err) {
                console.log(err.stack);
            }
        }());
    }

    return {
        getFriends,
        getAllUsers
    }
}

module.exports = homeController;