

const socket = io('http://localhost:5000');

socket.on('request', function (data) {
    console.log(data.data)
    alert(data.message);
    //emit to recepient
    socket.emit('emit-notification', data.data.to);
})
//listen for friend request accepted
socket.on('accept_response', function (data) {
    // console.log(data)
    alert(data.message);
    //emit to recepient
    socket.emit('has_accepted', data.id)
    location.reload();
})
//listen for sent messages from server and append to chats
socket.on('chat', function (data) {
    const li = document.createElement('li');
    const message = document.createElement('p');
    const image = document.createElement('img');
    const incoming_id = data.result.sender_id.toString();

    //condition
    if (incoming_id == user_id) {
        console.log('sender')
        image.src = "profile_imgs/" + element('user_img')
        li.setAttribute('class', 'replies')
    } else {
        image.src = data.myImage;
        li.setAttribute('class', 'sent')
        console.log('receiver')
    }

    message.textContent = data.result['title'];
    li.innerHTML += image.outerHTML + message.outerHTML;
    document.getElementById('messages-list').appendChild(li);
});
//listen for user messages when a friends image is clicked
socket.on('messages_received', function (data) {
    const ul = document.getElementById('messages-list');
    for (let i = 0; i < data.messages.length; i++) {
        const li = document.createElement('li');
        const message = document.createElement('p');
        const image = document.createElement('img');
        //console.log("na me them click", data.id, "na im send", data.messages[i].sender_id, "na im dm send to", data.messages[i].receiver_id)
        //condition
        const sender = data.messages[i].sender_id.toString();
        const receiver = data.messages[i].receiver_id.toString();
        if (data.id == sender || data.id == receiver) {
            if (data.messages[i].sender_id == user_id) {
                image.src = "profile_imgs/" + element('user_img')
                li.setAttribute('class', 'replies')
            } else {
                image.src = data.image;
                li.setAttribute('class', 'sent')
            }
            message.textContent = data.messages[i].title;
            li.innerHTML += image.outerHTML + message.outerHTML;
            ul.appendChild(li)
        } else {
            //console.log('not your message bro')
            // console.log("na me them click", data.id, "na im send", data.messages[i].sender_id, "na im dm send to", data.messages[i].receiver_id)
            // return null;
        }

    }
    //handle send message button clciks
    $("#send_message").click(function (e) {
        e.preventDefault()
        const message = document.getElementById('message');
        const user_id = element('user_id')
        console.log('clicked send!')
        socket.emit('chat', { title: message.value, receiver_id: data.id, sender_id: user_id, myImage: data.myImage })
        message.value = "";
    });
});


//listen for all registered users and append to modal and also listen for clicks 
socket.on('contacts', (data) => {
    // console.log(data);
    const ul = document.getElementById('contact_list');
    ul.innerHTML = "";
    data.allusers.forEach(user => {
        const li = document.createElement('li');
        const p = document.createElement('p');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const a = document.createElement('a');
        const i = document.createElement('i');
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
    const button = document.createElement('button');
    const a = document.createElement('a');
    a.setAttribute('class', 'badge badge-danger');
    a.setAttribute('data-toggle', 'modal');
    a.setAttribute('data-target', '#acceptFriends');
    a.setAttribute('id', 'not')
    a.style.margin = 20;
    a.style.cssFloat = "right";
    a.href = "";
    if (document.getElementById('not')) {
        console.log(document.getElementById('not'))
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
        const li = document.createElement('li');
        const p = document.createElement('p');
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
});

socket.on('friends', function (data) {
    //append friend to list
    console.log(data, "accepted friend")
    const ul = document.getElementById('friend_list');
    data.data.forEach(user => {
        const li = document.createElement('li');
        li.setAttribute('class', 'friends contact')
        const wrap = document.createElement('div')
        div.setAttribute('class', 'wrap');
        const img = document.createElement('img');
        img.src = user.user.image_url;
        img.height = "40px";
        img.width = "40px";
        const meta = document.createElement('div');
        const p_id = document.createElement('p');
        const p_img = document.createElement('p');
        const p_name = document.createElement('p');
        p_id.style.display = "none";
        p_img.style.display = "none";
        p_id.textContent = user.user_id;
        p_img.textContent = user.user.image_url;
        p_name.setAttribute('class', 'name');
        p_name.textContent = `${user.user.first_name} ${user.user.last_name}`;
        meta.innerHTML += p_id.outerHTML + p_img.outerHTML + p_name.outerHTML;
        wrap.innerHTML += img.outerHTML + meta.outerHTML;
        li.appendChild(wrap);
        ul.appendChild(li);
    });
});