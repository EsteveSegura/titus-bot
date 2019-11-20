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
     client.connect();
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
     //console.log(`channel: ${channel} - username: ${username} - months: ${months} - message: ${message} - userstate.messages: ${messages} - cumulativeMonths: ${cumulativeMonths}`)
     socket.emit('resub', { 'username': username, 'cumulativeMonths': cumulativeMonths, 'months': months, 'message': message });
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     //console.log(`channel: ${channel} - username: ${username} - streakMonths: ${streakMonths} - recipient: ${recipient} - senderCount: ${senderCount}`)
     socket.emit('subgift', { 'username': username, 'streakMonths': streakMonths, 'recipient': recipient, 'senderCount': senderCount });
});

client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     //console.log(`channel: ${channel} - username: ${username} - numbOfSubs: ${numbOfSubs} - senderCount: ${senderCount}`)
     socket.emit('submysterygift', { 'username': username, 'senderCount': senderCount });
});

client.on("subscription", (channel, username, method, message, userstate) => {
     //console.log(`channel: ${channel} - username: ${username} - message: ${message}`)
     socket.emit('subscription', { 'username': username, 'message': message });
});

client.on("cheer", (channel, userstate, message) => {
     //console.log(`channel: ${channel} - message: ${message} - howManyBits: ${userstate.bits} - username: ${userstate.username}`)
     socket.emit('cheer', { 'username': userstate.username, 'message': message, 'howManyBits': userstate.bits });
});

client.on("hosted", (channel, username, viewers, autohost) => {
     //console.log(`channel: ${channel} - username: ${username} - viewers: ${viewers}`)
     socket.emit('hosted', { 'username': username, 'viewers': viewers });
});
