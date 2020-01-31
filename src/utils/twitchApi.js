require('dotenv').config()
const axios = require('axios');

async function getStream(user){
    try {
        let request = await axios({
            method : "GET",
            headers : {'Client-ID' : process.env.CLIENT_ID_TWITCH},
            url : `https://api.twitch.tv/helix/streams?user_login=${user}`
        })
    
        if(request.data.data.length !== 0){
            return request.data.data
        }else{
            return false
        }
    } catch (error) {
        console.log('can get data from stream: ' + stream)        
        return false;
    }
}


module.exports = { getStream }