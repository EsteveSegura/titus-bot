require('dotenv').config()
const tmi = require('tmi.js');
let socket = require('socket.io-client')('http://localhost:9922/'); // Deploy let socket = require('socket.io-client')('http://80.211.238.132:9922/');
socket.on('connect', function () { });


const client = new tmi.Client({
     options: { debug: true },
     connections: {
          reconnect: true,
          secure: true
     },
     identity: {
          username: 'bot_titus',
          password: process.env.TOKEN
     },
     channels: ['titus_clan']
});

client.connect();

client.on("chat", (channel, user, message, self) => {

     if (self) {
          return;
     }

     console.log(user)
     socket.emit('voiceChat', { message: message, isMod: user.mod || false, isSuscriber: user.subscriber || false, author: user.username  });
});
