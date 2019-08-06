const Sequelize = require('sequelize');
const db = require('../config');
const User = require('./Users');

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
Messages.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "user_id"
});

module.exports = Messages;