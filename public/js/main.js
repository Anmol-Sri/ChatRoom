const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Get username and room from URL
var notif_count = 0;
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Setting OnFocusSate//
var isFocused = true;
function onFocus(){
    isFocused = true;
};
function onBlur() {
    isFocused = false;
};
window.onfocus = onFocus;
window.onblur = onBlur;

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  if (message.username !== username && message.username !== 'ChatRoom Bot'){
    document.getElementById('myAudio').play();
    // alert('New Message Recieved');
    myFunction();
  }
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }

function myFunction() {
  if (!isFocused) {    
    // If the user is on another tab, show there's a new message
    notif_count += 1;
    document.title = "(" + notif_count + ") " + " New Messages";
  }
  window.onfocus = function() {
    notif_count = 0;
    document.title = "ChatRoom App";
  }
}

function showNotificationCount(count){
  const pattern = /^\(\d+\)/;
  if(count === 0 || pattern.test(document.titile)){
    document.title = document.title.replace(pattern, count === 0 ? "" : "(" + count + ")");
    console.log("if");
  }
  else{
    console.log("else");
    document.title = "(" + count + ")" + document.title;
  }
}