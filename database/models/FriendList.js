const Sequelize = require('sequelize');
const db = require('../config');
const Messages = require('./Messages');
const User = require('./Users');


const FriendList = db.define('friendlist', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    is_friend: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    friend_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
        freezeTableName: true
    });

FriendList.belongsTo(User, {
    foreignKey: "friend_id",
    targetKey: "id"
});

module.exports = FriendList;