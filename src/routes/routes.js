//const axios = require('axios');
const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
     res.render('beta.ejs')
});


router.post('/sendMessage' ,(req,res) => {
     socket.emit('news', { hello: 'world' });
})


module.exports = router;