require('dotenv').config()
const tmi = require('tmi.js');
const axios = require('axios');
const { exec } = require('child_process');
const twitchApi = require('./utils/twitchApi');
let socket = require('socket.io-client')(process.env.SOCKET || 'http://localhost:9922/');

/*
TOKEN
CLIENT_ID
CLIENT_SECRET
*/

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

     channels: ['trainwreckstv']
});

//Connect default
client.connect();

//Show message on connect
socket.on("connect", () => {
     console.log('Bot WORKING');
});

//When time out, reconnect
client.on("timeout", (channel, username, reason, duration, userstate) => {
     exec("pm2 restart 18", (err, stdout, stderr) => {
          console.log('reset')
     });
     console.log("TIME OUT")
     console.log(reason)
});


//when messages arrive
client.on("chat", (channel, user, message, self) => {

     if (self) {
          return;
     }

     if(user.mod && message == "!help"){
          client.say(channel,"Pues no hay muchos comandos por ahora\n!reset : Si el chat de voz no funciona, usa este comando")
     }

     if(user.mod && message == "!reset"){
          client.say(channel,"El bot se va a reinciar... Los mensajes de los proximos 5 segundos, no seran recibidos por titus.")
          exec("pm2 restart 18", (err, stdout, stderr) => {
               console.log('reset')
               console.log(stdout)
          });
     }


     console.log(user["badge-info"])

     //if is "founder" also is suscriber
     let isSuscriber = user.subscriber
     let rawBadges = Object.values(user)
     if (rawBadges[rawBadges.length - 3] != null) {
          if (rawBadges[rawBadges.length - 3].includes("founder")) {
               isSuscriber = true
          }
     }

     socket.emit('voiceChat', { message: message, badge: user['badge-info'], isMod: user.mod || false, isSuscriber: isSuscriber, author: user.username });
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
     let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
     let messages = userstate["msg-param-should-share-streak"];
     socket.emit('resub', { 'username': username, 'cumulativeMonths': cumulativeMonths, 'months': months, 'message': message });
     console.log('resub')
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     socket.emit('subgift', { 'username': username, 'streakMonths': streakMonths, 'recipient': recipient, 'senderCount': senderCount });
     console.log('subgift')
});

client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     socket.emit('submysterygift', { 'username': username, 'senderCount': senderCount });
     console.log('submysterygift')
});

client.on("subscription", (channel, username, method, message, userstate) => {
     socket.emit('subscription', { 'username': username, 'message': message });
     console.log('subscription')
});

client.on("cheer", (channel, userstate, message) => {
     socket.emit('cheer', { 'username': userstate.username, 'message': message, 'howManyBits': userstate.bits });
     console.log('cheer')
});

client.on("hosted", (channel, username, viewers, autohost) => {
     socket.emit('hosted', { 'username': username, 'viewers': viewers });
     console.log('hosted')
});

client.on("raided", (channel, username, viewers) => {
     socket.emit('raided', { 'username': username, 'viewers': viewers })
     console.log('raided')
});



setInterval(async () => {
     let currentStreamStatus = await twitchApi.getStream(client.opts.channels[0].replace('#', ''))
     socket.emit('infoAboutStream', { "viewer_count": currentStreamStatus[0].viewer_count, "type": currentStreamStatus[0].type })
     console.log(currentStreamStatus[0].type)
     console.log(currentStreamStatus[0].viewer_count)
}, 60000 * 2);


//TEST AREA
//https://dev.twitch.tv/docs/api/reference#get-streams
//token & client ID



//TEST AREA