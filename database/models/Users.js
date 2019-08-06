const Sequelize = require('sequelize');
const db = require('../config');

const Users = db.define('user', {
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
});
module.exports = Users;