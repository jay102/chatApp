const Sequelize = require('sequelize');
const db = require('../config');


const Notifications = db.define('notification', {
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    from: {
        type: Sequelize.STRING,
        allowNull: false
    },
    to: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

module.exports = Notifications;