require('dotenv').config()
const tmi = require('tmi.js');
const axios = require('axios');
const { exec } = require('child_process');
const twitchApi = require('./utils/twitchApi');
let socket = require('socket.io-client')(process.env.SOCKET || 'http://localhost:9922/');

const client = new tmi.Client({
     options: { debug: true },

     connections: {
          reconnect: true,
          secure: true
     },
     identity: {
          username: 'fasterchatter',
          password: process.env.TOKEN
     },

     channels: []
});

//Connect default
client.connect();

//Show message on connect
socket.on("connect", () => {
     console.log('Bot WORKING');
});

//new channel to go
socket.on('JoinTwitchChat' , (data) =>{
     console.log(`Entrando en el canal de : ${data.body.user}`)
     client.join(data.body.user)
})

//When time out, reconnect
client.on("timeout", (channel, username, reason, duration, userstate) => {
     console.log(`TIMEOUT : ${reason}`) //null
     console.log("time out.... init restart")
     exec("pm2 restart 18", (err, stdout, stderr) => {
          console.log('Reset done.')
     });
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

     //if is "founder" also is suscriber
     let isSuscriber = user.subscriber
     let rawBadges = Object.values(user)
     if (rawBadges[rawBadges.length - 3] != null) {
          if (rawBadges[rawBadges.length - 3].includes("founder")) {
               isSuscriber = true
          }
     }

     socket.emit('voiceChat', {"actualChat" : channel , message: message, badge: user['badge-info'], isMod: user.mod || false, isSuscriber: isSuscriber, author: user.username });
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
     let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
     let messages = userstate["msg-param-should-share-streak"];
     socket.emit('resub', {"actualChat" : channel , 'username': username, 'cumulativeMonths': cumulativeMonths, 'months': months, 'message': message });
     console.log('resub')
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     socket.emit('subgift', {"actualChat" : channel , 'username': username, 'streakMonths': streakMonths, 'recipient': recipient, 'senderCount': senderCount });
     console.log('subgift')
});

client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
     let senderCount = ~~userstate["msg-param-sender-count"];
     socket.emit('submysterygift', {"actualChat" : channel , 'username': username, 'senderCount': senderCount });
     console.log('submysterygift')
});

client.on("subscription", (channel, username, method, message, userstate) => {
     socket.emit('subscription', {"actualChat" : channel , 'username': username, 'message': message });
     console.log('subscription')
});

client.on("cheer", (channel, userstate, message) => {
     socket.emit('cheer', {"actualChat" : channel , 'username': userstate.username, 'message': message, 'howManyBits': userstate.bits });
     console.log('cheer')
});

client.on("hosted", (channel, username, viewers, autohost) => {
     socket.emit('hosted', {"actualChat" : channel , 'username': username, 'viewers': viewers });
     console.log('hosted')
});

client.on("raided", (channel, username, viewers) => {
     socket.emit('raided', {"actualChat" : channel , 'username': username, 'viewers': viewers })
     console.log('raided')
});

/*
setInterval(async() => {
     for(let i = 0 ; i < client.opts.channels.length; i++){
          try {
               let currentStreamStatus = await twitchApi.getStream(client.opts.channels[i].substr(1))
               if(currentStreamStatus){
                    //FAIL THIS LINE
                    socket.emit('infoAboutStream', { "actualChat" : client.opts.channels[i].substr(1) ,"viewer_count": currentStreamStatus[0].viewer_count, "type": currentStreamStatus[0].type })
                    console.log(currentStreamStatus)
               }
          } catch (error) {
               console.log('--- ERROR --- Not important, we keep going on')               
          }
     }
},   60000 * 5);
*/