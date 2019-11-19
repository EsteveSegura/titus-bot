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
     channels: ['titus_clan'/*,'gorilanerd','TheNo1Alex' , 'C9Sneaky','mrfreshasian', 'Draineo', 'justfoxii', 'handongsuk','zilioner','wtf_winds123', 'zilioner', 'wtf_winds123', '2chamcham2', 'sonycast_', 'tmxk319', 'xxbloodynyuuxx'*/]
})

client.connect();

client.on("chat", (channel, user, message, self) => {
     let isSuscriber = user.subscriber
     if (self) {
          return;
     }

     //console.log(user)
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
     console.log("RESUB")
     console.log(`channel: ${channel} - username: ${username} - months: ${months} - message: ${message} - userstate.messages: ${messages} - cumulativeMonths: ${cumulativeMonths}`)
     socket.emit('resub',  {'username': username, 'cumulativeMonths': cumulativeMonths, 'months': months, 'message': message});
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     console.log("SUBGIFT")
     console.log(`channel: ${channel} - username: ${username} - streakMonths: ${streakMonths} - recipient: ${recipient} - senderCount: ${senderCount}`)
     socket.emit('subgift', { 'username': username, 'streakMonths': streakMonths, 'recipient' : recipient , 'senderCount': senderCount });
});

client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     console.log("SUBMYSTERYGIFT")
     console.log(`channel: ${channel} - username: ${username} - numbOfSubs: ${numbOfSubs} - senderCount: ${senderCount}`)
     socket.emit('submysterygift', { 'username': username, 'senderCount': senderCount });
});

client.on("subscription", (channel, username, method, message, userstate) => {
     console.log("SUBSCRIPTION")
     console.log(`channel: ${channel} - username: ${username} - message: ${message}`)
     socket.emit('subscription', {'username': username, 'message' : message});
});

client.on("cheer", (channel, userstate, message) => {
     console.log("CHEER")
     console.log(`channel: ${channel} - message: ${message} - howManyBits: ${userstate.bits} - username: ${userstate.username}`)
     socket.emit('cheer', {'username' : userstate.username ,'message' : message, 'howManyBits' : userstate.bits});   
});

client.on("hosted", (channel, username, viewers, autohost) => {
     console.log("HOSTED")
     console.log(`channel: ${channel} - username: ${username} - viewers: ${viewers}`)
     socket.emit('hosted', {'username' : username, 'viewers' : viewers});
});
