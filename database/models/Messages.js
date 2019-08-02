const Sequelize = require('sequelize');
const db = require('../config');

const Messages = db.define('message', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = Messages;