require('dotenv').config()
const axios = require('axios');

async function getStream(user){
    let request = await axios({
        method : "GET",
        headers : {'Client-ID' : process.env.CLIENT_ID},
        url : `https://api.twitch.tv/helix/streams?user_login=${user}`
    })

    if(request.data.data.length !== 0){
        return request.data.data
    }else{
        return false
    }
}




module.exports = { getStream }