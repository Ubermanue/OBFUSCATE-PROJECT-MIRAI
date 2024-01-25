const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
	name: "playstore",
	version: "30.0.0",
	hasPermission: 0,
	credits: "Choru TikTokers ",
	description: "Get information about an playstore",
	usages: "[appstore name]",
	commandCategory: "Information",
	cooldown: 5
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, event, args }) => {
    try {
        const AppStoreName = args.join(" ");

        if (!AppStoreName) {
            return api.sendMessage("Please provide a package name.", event.threadID, event.messageID);
        }

        const appInfoResponse = await axios.get(`https://facebook-bot.nextgen0.repl.co/playstore?name=${AppStoreName}`);
        const appInfo = appInfoResponse.data;

        if (appInfo) {
            const formattedMessage = `
Title: ${appInfo.title}
Summary: ${appInfo.summary}
Developer: ${appInfo.developer}
Price: ${appInfo.price}
Ratings: ${appInfo.ratings}
Installs: ${appInfo.install}
Genre: ${appInfo.genre}
Release Date: ${appInfo.releaseDate}
App Link: ${appInfo.appLink}
Comment: ${appInfo.comment}
`;

            const imagePath = path.join(__dirname, "..", "cache", "icon.png");
            const imageResponse = await axios.get(appInfo.icon, { responseType: "stream" });

            imageResponse.data.pipe(fs.createWriteStream(imagePath));

            imageResponse.data.on('end', async () => {
                await sleep(1000);

                api.sendMessage({
                    body: formattedMessage,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => fs.unlinkSync(imagePath));
            });
        } else {
            api.sendMessage("Sorry, playstore and/or image not found for that package.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while trying to fetch the playstore and image.", event.threadID, event.messageID);
    }
};
