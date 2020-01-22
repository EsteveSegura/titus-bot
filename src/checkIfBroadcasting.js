const apiTwitch = require('./utils/twitchApi');

const streamersToCheck = ["girlazo","kaquka","hirodreams"];

(async () => {
    console.log(streamersToCheck.length)
        for(let i = 0 ; i < streamersToCheck.length;i++){
            console.log(streamersToCheck[i])
            let actualStreamer = await apiTwitch.getStream(streamersToCheck[i])
            console.log(actualStreamer)
        }
})();