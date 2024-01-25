module.exports.config = {
    name: "meaning",
    version: "30.0.0",
    hasPermssion: 0,
    credits: "Choru Tiktokers",
    description: "dictionary",
    commandCategory: "search",
    usages: "meaning search",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args, utils, Users, Threads }) {
    try {
        const googlethis = require('googlethis');
        const request = require('request');
        const fs = require('fs-extra');

        let { threadID, senderID, messageID } = event;

        const words = args.join(" ");
        const searchResult = await googlethis.search('meaning of ' + words);

        const audio = searchResult.dictionary.audio;
        const dictionary = searchResult.dictionary;

        const word = dictionary.word;
        const phonetic = dictionary.phonetic;
        const definition = dictionary.definitions[0];
        const example = dictionary.examples[0] || 'Not found';

        let callback = function() {
            return api.sendMessage({
                body:`dictionary: ${dictionary}\nword: ${word}\nphonetic: ${phonetic}\ndefinition: ${definition}\nexample: ${example}`,
                attachment: fs.createReadStream(__dirname + `/cache/audio.mp4`)
            }, threadID, () => fs.unlinkSync(__dirname + `/cache/audio.mp4`), messageID);
        };

        return request(encodeURI(audio)).pipe(fs.createWriteStream(__dirname + `/cache/audio.mp4`)).on("close", callback);
        
    } catch (err) {
        console.log(err)
        return api.sendMessage(`Error`, threadID);
    }
};
