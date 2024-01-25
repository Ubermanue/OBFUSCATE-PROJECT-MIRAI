const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "quotes",
    schedule: "1 hours",
    version: "30.0.0",
    credits: "Choru TikTokers",
    description: "Cron quotes!"
};

module.exports.create = {
    cron: {
        config: {
            owner: "Choru TikTokers",
            description: `how to set time in scheduled, The schedule: 1 hours, you can change that to 1 hour It can be done in 1 minutes, 1 hours, 1 months, 1 year`
        }
    }
};

module.exports.onLoad = ({ api }) => {
    let quotesFilePath = path.join(__dirname, '../commands/privatecache/text/quote.sql');
    let quotes = fs.readFileSync(quotesFilePath, 'utf-8').split('\n');
    let quotes1 = quotes[Math.floor(Math.random() * quotes.length)].trim();
    
    api.getThreadList(30, null, ["INBOX"], (err, list) => {
        if (err) return console.log("ERR: "+err);
        list.forEach(now => {
            if (now.isGroup == true && now.threadID != list.threadID) {
                api.sendMessage(`${quotes1}`, now.threadID);
            }
        });
    });
};
