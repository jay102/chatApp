

const socket = io('http://localhost:5000');

socket.on('request', function (data) {
    // console.log(data)
    alert(data.message);
    location.reload();
})

socket.on('accept_response', function (data) {
    //console.log(data)
    alert(data.message);
    location.reload();
})

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

    $("#send_message").click(function (e) {
        e.preventDefault()
        const message = document.getElementById('message');
        const user_id = element('user_id')
        console.log('clicked send!')
        socket.emit('chat', { title: message.value, receiver_id: data.id, sender_id: user_id, myImage: data.myImage })
        message.value = "";
    });
});

socket.on('contacts', (data) => {
    console.log(data);
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