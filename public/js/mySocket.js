

const socket = io('https://chat-app77.herokuapp.com');
let clickedId;

socket.on('request', function (data) {
    console.log(data.data)
    alert(data.message);
    //emit to recepient
    socket.emit('emit-notification', data.data.to);
})
//listen for friend request accepted
socket.on('accept_response', function (data) {
    alert(data.message);
    //emit to recepient
    socket.emit('has_accepted', data.id)
    location.reload();
})
//listen for sent messages from server and append to chats
socket.on('chat', function (data) {
    console.log(data, "chat")
    const li = newElement('li');
    const message = newElement('p');
    const image = newElement('img');
    const incoming_id = data.result.sender_id.toString();
    const receiver = data.result.receiver_id.toString();
    const id = user_id.toString();
    if (id == incoming_id || id == receiver) {
        //condition
        if (incoming_id == user_id) {
            console.log('sender')
            image.src = "profile_imgs/" + element('user_img')
            li.setAttribute('class', 'replies')
            message.textContent = data.result['title'];
            li.innerHTML += image.outerHTML + message.outerHTML;
            document.getElementById('messages-list').appendChild(li);
        } else {
            if (!returnClicked()) { console.log('nobodys message'); console.log(returnClicked()) } else {
                console.log(returnClicked())
                if (data.id == receiver) {
                    image.src = data.myImage;
                    li.setAttribute('class', 'sent')
                    console.log('receiver')
                    message.textContent = data.result['title'];
                    li.innerHTML += image.outerHTML + message.outerHTML;
                    document.getElementById('messages-list').appendChild(li);
                }
            }

        }
    } else {
        // console.log('not your message')
    }
});
//listen for user messages when a friends image is clicked
socket.on('messages_received', function (data) {
    //console.log(data, "messages received");
    const ul = document.getElementById('messages-list');
    for (let i = 0; i < data.messages.length; i++) {
        const li = newElement('li');
        const message = newElement('p');
        const image = newElement('img');

        //condition
        const sender = data.messages[i].sender_id.toString();
        const receiver = data.messages[i].receiver_id.toString();
        if (user_id == sender || user_id == receiver) {
            if (sender == user_id) {
                image.src = "profile_imgs/" + element('user_img')
                li.setAttribute('class', 'replies')
                // console.log('sender')
                message.textContent = data.messages[i].title;
                li.innerHTML += image.outerHTML + message.outerHTML;
                ul.appendChild(li);
            } else {
                if (data.id == sender) {
                    image.src = data.image;
                    li.setAttribute('class', 'sent')
                    //  console.log('receiver')
                    message.textContent = data.messages[i].title;
                    li.innerHTML += image.outerHTML + message.outerHTML;
                    ul.appendChild(li);
                }
            }
        } else {
            // console.log('not your message bro')

        }
    }
    //handle send message button clciks
    $("#send_message").click(function (e) {
        e.preventDefault()
        sendMessage(data);
    });

});


//listen for all registered users and append to modal and also listen for clicks 
socket.on('contacts', (data) => {
    const ul = document.getElementById('contact_list');
    data.allusers.forEach(user => {
        const li = newElement('li');
        const p = newElement('p');
        const img = newElement('img');
        const span = newElement('span');
        const a = newElement('a');
        const i = newElement('i');
        li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
        p.setAttribute('class', 'id');
        p.style.display = "none";
        p.textContent = `${user.id}`;
        img.src = `profile_imgs/${user.image_url}`;
        img.height = "40";
        img.width = "40";
        img.setAttribute('class', 'rounded-circle');
        span.setAttribute('class', 'name');
        span.style.marginLeft = "10px";
        span.style.marginRight = "10px";
        span.textContent = `${user.first_name} ${user.last_name}`;
        a.setAttribute('class', 'add_friends');
        a.href = "";
        i.style.color = "#007bff";
        i.setAttribute('class', 'fa fa-user-plus fa-fw');
        i.setAttribute('aria-hidden', true);
        a.innerHTML += i.outerHTML;
        li.innerHTML += p.outerHTML + img.outerHTML + span.outerHTML + a.outerHTML;
        ul.appendChild(li)
    });

    $(".add_friends").click(function (e) {
        e.preventDefault()
        const receiver_id = $(this).closest('.list-group-item').find(".id").text();
        const name = $(this).closest('.list-group-item').find('.name').text();
        const qst = confirm(`send request to ${name}?`);
        if (qst) {
            //make request
            socket.emit('onRequest', { name: firstname + " " + lastname, id: receiver_id, user_id: user_id, is_friend: 0 });
        } else {
            return null;
        }
    });
});
//append new notification to recipient
socket.on('new-notification', function (data) {
    const div = document.getElementById('notification_div');
    const button = newElement('button');
    const a = newElement('a');
    a.setAttribute('class', 'badge badge-danger');
    a.setAttribute('data-toggle', 'modal');
    a.setAttribute('data-target', '#acceptFriends');
    a.setAttribute('id', 'not')
    a.style.margin = 20;
    a.style.cssFloat = "right";
    a.href = "";
    if (document.getElementById('not')) {
        document.getElementById('not').textContent = data.count;
    } else {
        if (data.count !== 0) {
            a.textContent = data.count
        }
        if (data.id.toString() !== user_id) {
        } else {
            div.appendChild(a);
        }
    }
    const ul = document.getElementById('request_list');
    ul.innerHTML = "";
    data.userRequests.forEach(req => {
        const li = newElement('li');
        const p = newElement('p');
        li.setAttribute('class', 'list-group-item');
        li.setAttribute('aria-disabled', true);
        button.setAttribute('class', ' accept btn btn-primary btn-sm');
        button.style.cssFloat = "right";
        p.setAttribute('class', 'sender_id');
        p.style.display = "none";
        li.textContent = req.from
        button.textContent = "Accept";
        p.textContent = req.user_id
        li.innerHTML += button.outerHTML + p.outerHTML;
        ul.appendChild(li);
    })
    acceptFriend();
});

socket.on('friends', function (data) {
    //append friend to list
    // console.log(data, "accepted friend")
    const ul = document.getElementById('friend_list');
    ul.innerHTML = "";
    data.data.forEach(user => {
        const li = newElement('li');
        li.setAttribute('class', 'friends contact')
        const wrap = newElement('div')
        wrap.setAttribute('class', 'wrap');
        const img = newElement('img');
        img.src = `profile_imgs/${user.user.image_url}`;
        img.height = "40";
        img.width = "40";
        const meta = newElement('div');
        const p_id = newElement('p');
        const p_img = newElement('p');
        const p_name = newElement('p');
        meta.setAttribute('class', 'meta')
        p_id.style.display = "none";
        p_img.style.display = "none";
        p_id.textContent = user.user.id;
        p_img.textContent = user.user.image_url;
        p_id.setAttribute('class', 'friend_id');
        p_img.setAttribute('class', 'friend_img');
        p_name.setAttribute('class', 'friend_name');
        p_name.textContent = `${user.user.first_name} ${user.user.last_name}`;
        meta.innerHTML += p_id.outerHTML + p_img.outerHTML + p_name.outerHTML;
        wrap.innerHTML += img.outerHTML + meta.outerHTML;
        li.appendChild(wrap);
        if (user_id.toString() == user.user_id) {
            ul.appendChild(li);
        }
    });

    friendsClick();
});

function newElement(el) {
    return document.createElement(el);
}
function initId(id) {
    clickedId = id;
}
function returnClicked() {
    return clickedId;
}