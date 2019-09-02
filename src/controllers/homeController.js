
const debug = require('debug')('app:homeController');
const moment = require('moment');
const Sequelize = require('sequelize');
const Users = require('../../database/models/Users');
const Friends = require('../../database/models/FriendList');
const Messages = require('../../database/models/Messages');
const Notifications = require('../../database/models/Notifications');

const { Op } = Sequelize;

function homeController() {
  function getNotifications(io, data) {
    (async function getNots() {
      try {
        const count = await Notifications.count({ where: { to: data } });
        const userRequests = await Notifications.findAll({ where: { to: data } })
          .map((el) => el.get({ plain: true }));
        io.emit('new-notification', { count, userRequests, id: data });
      } catch (err) {
        debug(err);
      }
    }());
  }

  function fetchContacts(socket, data) {
    (async function getContacts() {
      try {
        const allusers = await Users.findAll({
          where: {
            id: {
              [Op.ne]: data.user_id,
            },
          },
        }).map((el) => el.get({ plain: true }));
        socket.emit('contacts', { allusers });
      } catch (err) {
        debug(err);
      }
    }());
  }

  function fetchFriends(io, data) {
    (async function fetchfriends() {
      try {
        const FriendList = await Friends.findAll({
          include: [{ model: Users, attributes: ['first_name', 'last_name', 'image_url', 'id'] }],
          where: { is_friend: 1, user_id: data },
        }).map((el) => el.get({ plain: true }));

        io.emit('friends', { data: FriendList });
      } catch (err) {
        debug(err);
      }
    }());
  }
  function getMessages(data, socket) {
    (async function messages() {
      try {
        const messages = await Messages.findAll({ where: { [Op.or]: [{ receiver_id: data.sender_id }, { receiver_id: data.receiver_id }] } })
          .map((el) => el.get({ plain: true }));
        // emit messages back to requester
        socket.emit('messages_received', {
          image: data.image, messages, id: data.receiver_id, myImage: data.myImage,
        });
      } catch (err) {
        debug(err);
      }
    }());
  }

  function insertMessages(data, io) {
    (async function insert() {
      const { sender_id } = data;
      const { receiver_id } = data;
      debug(receiver_id, 'receiver id');
      const { title } = data;
      const date = moment().format('llll');
      if (title === '') {
        return null;
      }
      try {
        const result = await Messages.create({
          title, date, sender_id, receiver_id,
        });
        const { dataValues } = result;
        debug(dataValues, 'result');
        io.emit('chat', { result, myImage: data.myImage, id: receiver_id });
      } catch (err) {
        debug(err);
      }
    }());
  }
  async function deleteNotifications(data, socket) {
    const result = await Notifications.destroy({ where: { user_id: data.user_id } });
    debug(result, 'delete notifications');
    if (result === 1) {
      socket.emit('accept_response', { message: 'Friend Accepted', id: data.user_id });
    } else {
      socket.emit('accept_response', { message: 'Could not delete notification after acceptance' });
    }
  }
  async function sendNotifications(socket, data) {
    const notifications = await Notifications.findOrCreate({
      where: { user_id: data.user_id },
      defaults: {
        from: data.name.trim(),
        to: data.id,
        user_id: data.user_id,
      },
    });
    const [created] = notifications;
    const [users] = notifications;
    if (created) {
      debug(users);
      socket.emit('request', {
        message: 'Friend request sent',
        data: users,
      });
    } else {
      debug('error sending notifications');
    }
  }

  function friendRequest(data, socket) {
    (async function addfriend() {
      try {
        const addFriends = await Friends.create(

          {
            user_id: data.user_id,
            is_friend: data.is_friend,
            friend_id: data.id,
          },
        );
        const { dataValues } = addFriends;
        debug(dataValues, 'users');
        if (data.is_friend == 1) {
          return null;
        }
        sendNotifications(socket, data);
      } catch (err) {
        socket.emit('request', { message: 'You already sent a friend request' });
        debug(err);
      }
    }());
  }
  function acceptRequest(data, socket) {
    (async function accept() {
      const values = { is_friend: data.is_friend };
      const selector = { where: { user_id: data.user_id } };
      try {
        const results = await Friends.update(values, selector);
        const myData = await Friends.findOne({ where: { user_id: data.user_id } });
        const { dataValues } = myData;
        const [result] = results;
        debug(result, 'accept friend request');
        const newData = { id: data.user_id, user_id: dataValues.friend_id, is_friend: 1 };
        // accept also in db
        friendRequest(newData, socket);
        deleteNotifications(data, socket);
      } catch (err) {
        debug(err);
      }
    }());
  }
  function getAllUsers(req, res) {
    (async function getUsers() {
      try {
        const details = await Users.findOne({ where: { id: req.session.user_id } });
        const notifications = await Notifications.count({ where: { to: req.session.user_id } });
        const userRequests = await Notifications.findAll({ where: { to: req.session.user_id } }).map((el) => el.get({ plain: true }));
        // debug(userRequests)
        const FriendList = await Friends.findAll({
          include: [{ model: Users, attributes: ['first_name', 'last_name', 'image_url', 'id'] }],
          where: { is_friend: 1, user_id: req.session.user_id },
        }).map((el) => el.get({ plain: true }));
        debug(FriendList);
        const { dataValues } = details;
        res.render('home/home',
          {
            user: dataValues,
            notifications,
            requests: userRequests,
            friends: FriendList,
          });
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  return {
    getAllUsers,
    friendRequest,
    acceptRequest,
    insertMessages,
    getMessages,
    fetchContacts,
    getNotifications,
    fetchFriends,
  };
}

module.exports = homeController;