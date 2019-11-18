require('dotenv').config()
const tmi = require('tmi.js');
let socket = require('socket.io-client')('http://80.211.238.132:9922/'); // Deploy let socket = require('socket.io-client')('http://80.211.238.132:9922/');
socket.on('connect', function () { });


const client = new tmi.Client({
     options: { debug: false },
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

     //console.log(user)
     let rawBadges = Object.values(user)
     if (rawBadges[rawBadges.length - 3] != null) {
          if (rawBadges[rawBadges.length - 3].includes("founder")) {
               //console.log("SI1")
          } else {
               //console.log("NO")
          }
     }
     socket.emit('voiceChat', { message: message, isMod: user.mod || false, isSuscriber: user.subscriber || false, author: user.username });
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
     //let meses = ~~userstate["msg-param-cumulative-months"];
     //let mess = userstate["msg-param-should-share-streak"];
     console.log(`channel: ${channel} - username: ${username} - months: ${months} - message: ${message} - userstate: ${userstate}`)
     //socket.emit('resub', {});
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
     //let senderCount = ~~userstate["msg-param-sender-count"];
     console.log(`channel: ${channel} - username: ${username} - streakMonths: ${streakMonths} - recipient: ${recipient} - userstate: ${userstate}`)
     //socket.emit('subgift', {});
});

client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
     //let senderCount = ~~userstate["msg-param-sender-count"];
     console.log(`channel: ${channel} - username: ${username} - numbOfSubs: ${numbOfSubs} - userstate: ${userstate}`)
     //socket.emit('submysterygift', {});
});

client.on("subscription", (channel, username, method, message, userstate) => {
     console.log(`channel: ${channel} - username: ${username} - message: ${message} - userstate: ${userstate}`)
     //socket.emit('subscription', {});
});

client.on("cheer", (channel, userstate, message) => {
     console.log(`channel: ${channel} - message: ${message} - userstate: ${userstate}`)
     //socket.emit('cheer', {});
});

client.on("hosted", (channel, username, viewers, autohost) => {
     console.log(`channel: ${channel} - username: ${username} - viewers: ${viewers}`)
     //socket.emit('hosted', {});
});

client.on("vips", (channel, vips) => {
     console.log(`channel: ${channel} - vips: ${vips}`)
     //socket.emit('vips', {});
});