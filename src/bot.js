require('dotenv').config()
const tmi = require('tmi.js');
let socket = require('socket.io-client')(process.env.SOCKET || 'http://localhost:9922/');

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

//Connect default
client.connect();

//Show message on connect
socket.on("connect", () => {
     console.log('Bot WORKING');
});

//When time out, reconnect
client.on("timeout", (channel, username, reason, duration, userstate) => {
     console.log("TIME OUT")
     console.log(reason)
});


//when messages arrive
client.on("chat", (channel, user, message, self) => {
     if (self) {
          return;
     }

     //if is "founder" also is suscriber
     let isSuscriber = user.subscriber
     let rawBadges = Object.values(user)
     if (rawBadges[rawBadges.length - 3] != null) {
          if (rawBadges[rawBadges.length - 3].includes("founder")) {
               isSuscriber = true
          }
     }

     socket.emit('voiceChat', { message: message, isMod: user.mod || false, isSuscriber: isSuscriber, author: user.username });
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
     let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
     let messages = userstate["msg-param-should-share-streak"];
     socket.emit('resub', { 'username': username, 'cumulativeMonths': cumulativeMonths, 'months': months, 'message': message });
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     socket.emit('subgift', { 'username': username, 'streakMonths': streakMonths, 'recipient': recipient, 'senderCount': senderCount });
});

client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     socket.emit('submysterygift', { 'username': username, 'senderCount': senderCount });
});

client.on("subscription", (channel, username, method, message, userstate) => {
     socket.emit('subscription', { 'username': username, 'message': message });
});

client.on("cheer", (channel, userstate, message) => {
     socket.emit('cheer', { 'username': userstate.username, 'message': message, 'howManyBits': userstate.bits });
});

client.on("hosted", (channel, username, viewers, autohost) => {
     socket.emit('hosted', { 'username': username, 'viewers': viewers });
});

client.on("raided", (channel, username, viewers) => {
     socket.emit('raided', { 'username': username, 'viewers': viewers })
});