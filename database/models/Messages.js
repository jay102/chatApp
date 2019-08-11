const Sequelize = require('sequelize');
const db = require('../config');
const User = require('./Users');
const Friends = require('./FriendList');

const Messages = db.define('message', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
// Messages.belongsTo(User, {
//     foreignKey: "user_id",
//     targetKey: "id"
// });

// Messages.belongsTo(Friends, {
//     foreignKey: "user_id",
//     targetKey: "user_id"
// });

module.exports = Messages;