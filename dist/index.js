"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tabris_1 = require("tabris");
const CELL_FONT = { iOS: '17px', Android: 'medium 14px' }[device.platform];
var headerColor = '#313A45';
var backgroundColor = '#1c2127';
var blueColor = '#0077ee';
var greyColor = '#21252B';
const socket = new WebSocket('ws://157.230.66.208:8080', 'chat-protocol');
socket.addEventListener('error', function (event) {
    console.log('WebSocket error: ', event);
});
socket.onopen = function (event) {
    console.log('event');
    console.log("WebSocket is open now.");
    appendLogin();
};
socket.onmessage = function (message) {
    var data = JSON.parse(message.data)[0];
    console.log('event = ' + data.event);
    if (data.event == "login") {
        if (data.isLoggedIn == true) {
            console.log('loginTrue' + data.uid);
            authenticated(data.uid);
        }
    }
    else if (data.event == 'friendsArray') {
        console.log(data.friendsArray);
        var friendsArray = data.friendsArray;
        new tabris_1.CollectionView({
            left: 10, right: 10, height: friendsArray.length * 50, top: 130, cellHeight: 50, background: headerColor, itemCount: friendsArray.length, borderColor: 'black',
            createCell: () => new tabris_1.Composite({ highlightOnTouch: true })
                .append(new tabris_1.TextView({ centerX: 0, centerY: 0, textColor: 'white' })),
            updateCell: (cell, index) => {
                const item = friendsArray[index];
                cell.find(tabris_1.TextView).only().text = item.username;
            }
        }).appendTo(tabris_1.contentView);
    }
};
function appendChat() {
    tabris_1.drawer.close();
    console.log('appendChat');
    new tabris_1.NavigationView({ layoutData: 'stretch', drawerActionVisible: true, toolbarColor: headerColor })
        .append(new tabris_1.Page({ title: 'Chat', background: backgroundColor, autoDispose: true }))
        .appendTo(tabris_1.contentView);
}
//profile page
function appendProfile() {
    tabris_1.drawer.close();
    new tabris_1.NavigationView({ layoutData: 'stretch', drawerActionVisible: true, toolbarColor: headerColor })
        .append(new tabris_1.Page({ title: 'Profile', background: backgroundColor, autoDispose: true }))
        .appendTo(tabris_1.contentView);
}
//friends page
function appendFriends() {
    tabris_1.drawer.close();
    new tabris_1.NavigationView({ layoutData: 'stretch', drawerActionVisible: true, toolbarColor: headerColor })
        .append(new tabris_1.Page({ title: 'Friends', background: backgroundColor, autoDispose: true }))
        .appendTo(tabris_1.contentView);
    const friendCode = new tabris_1.TextInput({
        top: 70, left: '10', right: '10', borderColor: blueColor, messageColor: blueColor, textColor: blueColor,
        message: 'Add Friend'
    }).appendTo(tabris_1.contentView).on('accept', function (ev) {
        addFriend(friendCode.text);
    });
    getFriends();
}
//login page
function appendLogin() {
    new tabris_1.NavigationView({ layoutData: 'stretch', toolbarColor: headerColor })
        .append(new tabris_1.Page({ title: 'Log In', background: backgroundColor, autoDispose: true }))
        .appendTo(tabris_1.contentView);
    const loginComposite = new tabris_1.Composite({
        centerY: 0,
        centerX: 0,
        width: 300,
    }).appendTo(tabris_1.contentView);
    const char1 = new tabris_1.TextInput({
        alignment: 'centerX',
        width: 50,
        centerX: -120,
        keyboard: 'number',
        maxChars: 1,
        focused: true,
        keepFocus: true,
        borderColor: blueColor,
        textColor: 'white',
        cursorColor: blueColor,
    }).appendTo(loginComposite);
    char1.on('input', function (ev) {
        if (char1.text == "") {
            console.log('d');
        }
        else {
            console.log(ev);
            char2.focused = true;
        }
    });
    const char2 = new tabris_1.TextInput({
        alignment: 'centerX',
        width: 50,
        centerX: -40,
        keyboard: 'number',
        maxChars: 1,
        keepFocus: true,
        borderColor: blueColor,
        textColor: 'white',
        cursorColor: blueColor,
        color: blueColor
    }).appendTo(loginComposite);
    char2.on('input', function (ev) {
        if (char2.text == "") {
            console.log('d');
            char1.focused = true;
        }
        else {
            console.log(ev);
            char3.focused = true;
        }
    });
    const char3 = new tabris_1.TextInput({
        alignment: 'centerX',
        width: 50,
        centerX: 40,
        keyboard: 'number',
        maxChars: 1,
        keepFocus: true,
        borderColor: blueColor,
        textColor: 'white',
        cursorColor: blueColor,
        color: blueColor
    }).appendTo(loginComposite);
    char3.on('input', function (ev) {
        if (char3.text == "") {
            console.log('d');
            char2.focused = true;
        }
        else {
            console.log(ev);
            char4.focused = true;
        }
    });
    const char4 = new tabris_1.TextInput({
        alignment: 'centerX',
        width: 50,
        centerX: 120,
        keyboard: 'number',
        maxChars: 1,
        keepFocus: true,
        borderColor: blueColor,
        textColor: 'white',
        cursorColor: blueColor,
        color: blueColor
    }).on('input', function (ev) {
        if (char4.text == "") {
            console.log('d');
            char3.focused = true;
        }
        else {
            console.log(ev);
            tryLogin(char1.text + char2.text + char3.text + char4.text);
            char4.focused = false;
        }
    }).appendTo(loginComposite);
}
function tryLogin(key) {
    console.log(key);
    socket.send('tryLogin,' + key);
}
function addFriend(code) {
    var uid = localStorage.getItem('uid');
    console.log(code);
    socket.send('addFriend,' + uid + ',' + code);
}
function getFriends() {
    var uid = localStorage.getItem('uid');
    socket.send('getFriends,' + uid);
}
function authenticated(uid) {
    localStorage.setItem('uid', uid);
    tabris_1.drawer.enabled = true;
    const items = [
        { image: '/resources/png/baseline_chat_black_18dp.png', title: 'Chat', onclick: appendChat },
        { title: 'Friends', onclick: appendFriends },
        { title: 'Profile', onclick: appendProfile }
    ];
    new tabris_1.CollectionView({
        left: 0, top: 0, right: 0, bottom: 0, cellHeight: 50,
        itemCount: items.length,
        createCell: () => new tabris_1.Composite({ highlightOnTouch: true })
            .append(new tabris_1.ImageView({ left: 16, width: 24, height: 24, centerY: 0 }), new tabris_1.TextView({ left: 72, centerY: 0 })),
        updateCell: (cell, index) => {
            const item = items[index];
            cell.find(tabris_1.TextView).only().text = item ? item.title : pages[index].title;
            cell.on('tap', item.onclick);
            cell.find(tabris_1.ImageView).only().image = item ? item.image : '/resources/png/baseline_chat_black_18dp.png';
        }
    }).appendTo(tabris_1.drawer);
    appendChat();
}
