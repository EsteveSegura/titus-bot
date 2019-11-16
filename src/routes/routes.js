//const axios = require('axios');
const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
     res.render('index.ejs')
});

router.get('/test', (req,res) => {
     res.render('test.ejs')
});

router.post('/sendMessage' ,(req,res) => {
     socket.emit('news', { hello: 'world' });
})


module.exports = router;