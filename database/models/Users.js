const Sequelize = require('sequelize');
const db = require('../config');
const Messages = require('./Messages');

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
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

Messages.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "user_id"
});
module.exports = Users;