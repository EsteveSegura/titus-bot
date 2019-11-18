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
          console.log(body)
          socket.broadcast.emit('voiceChat', {body})
     })
})

server.listen(9922, () =>{
     console.log('Chat!')
});