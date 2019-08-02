const Sequelize = require('sequelize');
const db = require('../config');

const FriendList = db.define('message', {
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_friend: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = FriendList;