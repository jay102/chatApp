const io = require('../../app').io;
const homeController = require('../controllers/homeController')
const debug = require('debug')('app:socketManager')


module.exports = (socket) => {
    const { friendRequest, acceptRequest, insertMessages, getMessages, fetchContacts } = homeController();
    debug("User Connected", socket.id)

    //disconnect
    socket.on('disconnect', function () {
        debug('user disconnected');
    });

    socket.on('onRequest', function (data) {
        debug(data)
        friendRequest(data, socket);
    });
    socket.on('accept', function (data) {
        debug(data)
        acceptRequest(data, socket);
    });

    socket.on('chat', function (data) {
        debug(data)
        insertMessages(data, io);
    });
    socket.on('get_messages', function (data) {
        debug(data)
        getMessages(data, socket);
    });

    socket.on('fetch_contacts', function (data) {
        console.log('fetch contacts db!')
        fetchContacts(socket, data);
    });
}