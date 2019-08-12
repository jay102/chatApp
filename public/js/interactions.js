
const user_id = element('user_id')
const firstname = element('firstname');
const lastname = element('lastname');
$(document).ready(function () {
    $("#add_contact").click(function (e) {
        socket.emit('fetch_contacts', { user_id: user_id });
    });
    //handle notifications on reload
    $(".accept").click(function (e) {
        e.preventDefault()
        const sender_id = $(this).closest('.list-group-item').find(".sender_id").text();
        const accept = confirm(`Accept request?`);
        if (accept) {
            //make request
            socket.emit('accept', { is_friend: 1, user_id: sender_id });
        } else {
            return null;
        }
    });


    //handle clicks to friends
    $(".friends").click(function (e) {
        e.preventDefault()
        document.getElementById('no-chats').style.display = "none";
        const listItems = getall('#contacts li');
        listItems.forEach(friends => {
            friends.className = "friends contact"
        });
        e.currentTarget.className = "friends contact active"
        name = $(this).closest('.contact').find(".friend_name").text();
        id = $(this).closest('.contact').find(".friend_id").text();
        image = $(this).closest('.contact').find(".friend_img").text();
        setElement('current_name', name);
        document.getElementById('current_img').style.display = "block"
        setImage('current_img', "profile_imgs/" + image);
        //emit to socket to get messages of user
        const ul = document.getElementById('messages-list');
        ul.innerHTML = "";

        socket.emit('get_messages', { receiver_id: id, image: "profile_imgs/" + image, sender_id: user_id, myImage: "profile_imgs/" + element('user_img') });
    });
});

const logout = document.getElementById('logout');
logout.addEventListener('click', (e) => {

    const mLogout = confirm(`Confirm Logout?`);
    if (mLogout) {
        fetch('http://localhost:5000/logout')
            .catch(err => console.log(err))
    } else {
        // return null;
    }
});

function element(id) {
    return document.getElementById(id).innerText
}
function setElement(id, text) {
    document.getElementById(id).innerText = text;
}
function setImage(id, src) {
    document.getElementById(id).src = src;
}

function getall(s) {
    return document.querySelectorAll(s);
}
//this snippet is for the online status {/* <span class="contact-status online"></span> */}