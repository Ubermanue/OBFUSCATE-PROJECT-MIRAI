const axios = require('axios');
const japans = require("japanese-wotd");
const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "japan-greet",
    schedule: "13 hours",
    version: "30.0.0",
    credits: "Choru Tikrokers",
    description: "japan-greet Schedule"
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
    api.getThreadList(30, null, ["INBOX"], async (err, list) => {
        if (err) return console.log("ERR: " + err);
        list.forEach(async (now) => {
            if (now.isGroup == true && now.threadID != list.threadID) {
                const japan = await japans.getJapaneseWordOfTheDay();
                const word = japan.word;
                const romaji = japan.romaji;
                const english = japan.english;
                const ss = japan.wotd_class;
                const date = japan.date;
                const ex_audio = japan.example.ex_audio;
                const ex = japan.example.ex;
                const ex_kana = japan.example.ex_kana;
                const ex_romaji = japan.example.ex_romaji;
                const ex_english = japan.example.ex_english;

                
                const link = ex_audio;

                var callback = () => {
                    api.sendMessage({
                        body: `Word of the Day: ${word}\nRomaji: ${romaji}\nEnglish: ${english}\nExample: ${ex}\nKana: ${ex_kana}\nRomaji Example: ${ex_romaji}\nEnglish Example: ${ex_english}`,
                        attachment: fs.createReadStream(__dirname + "/cache/japan.mp3")
                    }, now.threadID, () => fs.unlinkSync(__dirname + "/cache/japan.mp3"));
                };

                if (!fs.existsSync(__dirname + "/cache")) {
                    fs.mkdirSync(__dirname + "/cache");
                }

                if (!fs.existsSync(__dirname + "/cache/japan.mp3")) {
                    var file = fs.openSync(__dirname + "/cache/japan.mp3", 'w');
                    fs.closeSync(file);
                }

                var stream = request(encodeURI(link))
                    .pipe(fs.createWriteStream(__dirname + "/cache/japan.mp3"));
                stream.on("finish", callback);
            }
        });
    });
};
