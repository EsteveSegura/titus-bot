const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const routes = require('./routes/routes');
const io = socketIo(server);


app.set('views', './views')
app.set('view engine', 'ejs');

app.use(cors());
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

io.on('connection', (socket) => {
     socket.on('voiceChat', (body) => {
          socket.broadcast.emit('voiceChat', {body})
     });

     socket.on('resub', (body) => {
          console.log(body)
          socket.broadcast.emit('resub', {body})
     });

     socket.on('subgift', (body) => {
          console.log(body)
          socket.broadcast.emit('subgift', {body})
     });

     socket.on('submysterygift', (body) => {
          console.log(body)
          socket.broadcast.emit('submysterygift', {body})
     });

     socket.on('subscription', (body) => {
          console.log(body)
          socket.broadcast.emit('subscription', {body})
     });

     socket.on('cheer', (body) => {
          console.log(body)
          socket.broadcast.emit('cheer', {body})
     });

     socket.on('hosted', (body) => {
          console.log(body)
          socket.broadcast.emit('hosted', {body})
     });

})

server.listen(9922, () =>{
     console.log('Chat!')
});