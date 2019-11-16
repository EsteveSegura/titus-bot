require('dotenv').config()
const tmi = require('tmi.js');
let socket = require('socket.io-client')('http://localhost:9922');
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
     if (user.mod) {
          console.log('es mod')
     }
     
     socket.emit('voiceChat', { message: message });

     if (message.startsWith("! ")) {
          socket.emit('voiceChat', { message: message });
          console.log('mensaje de chat---------------------------------')
     }
});
