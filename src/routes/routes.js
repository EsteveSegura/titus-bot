require('dotenv').config()
const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
     res.send('Entrar en http://girlazo.com/titusbot/chat')
});

router.get('/chat', (req,res) => {
     res.render('beta.ejs', {
          css: process.env.STYLE || './css/main.css',
          socket : process.env.SOCKET || 'http://localhost:9922',
          audio : process.env.AUDIO || './audio/Alert.wav'
     })
});

router.post('/sendMessage' ,(req,res) => {
     socket.emit('news', { hello: 'world' });
})


module.exports = router;