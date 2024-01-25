const fs = require('fs');
const request = require('request');
const axios = require('axios');

module.exports.config = {
    name: "bible",
    schedule: "1 hours",
    version: "30.0.0",
    credits: "Choru Tikrokers",
    description: "Bible Schedule"
};

module.exports.create = {
    cron: {
        config: {
            owner: "Choru TikTokers",
            description: `how to set time in scheduled, The schedule: 1 hours, you can change that to 1 hour It can be done in 1 minutes, 1 hours, 1 months, 1 year`
        }
    }
};//dont change owner/description


module.exports.onLoad = ({ api }) => {
    api.getThreadList(30, null, ["INBOX"], async (err, list) => { 
        if (err) return console.log("ERR: "+err);
        list.forEach(async (now) => { 
            if (now.isGroup == true && now.threadID != list.threadID) {
                const response = await axios.get("https://labs.bible.org/api/?passage=random&type=json");
                const { bookname, chapter, verse, text } = response.data[0];

                const imageResponse = await axios.get(`https://source.unsplash.com/1600x900/?${bookname}, God story`);
                const link = imageResponse.request.res.responseUrl;

                var callback = () => {
                    api.sendMessage({
                        body: `bookname: ${bookname}\nchapter: ${chapter}\nverse: ${verse}\ntitle: ${text}\nevery ${this.config.schedule}`, 
                        attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
                    }, now.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));
                };

                if (!fs.existsSync(__dirname + "/cache")) {
                    fs.mkdirSync(__dirname + "/cache");
                }

                if (!fs.existsSync(__dirname + "/cache/1.jpg")) {
                    var file = fs.openSync(__dirname + "/cache/1.jpg", 'w');
                    fs.closeSync(file);
                }

                var stream = request(encodeURI(link))
                    .pipe(fs.createWriteStream(__dirname+"/cache/1.jpg"));
                stream.on("finish", callback);
            }
        });
    });
};
