const fs = require('fs');
const path = require('path');

const wordsbotPath = path.join(__dirname, './includes/database/wordsbot.json');

function getBadWords() {
    try {
        const rawData = fs.readFileSync(wordsbotPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading wordsbot.json:", error);
        return [];
    }
}

module.exports.config = {
    name: "autoban",
    version: "30.0.0",
    hasPermssion: 0,
    credits: "Choru tiktokers",
    description: "autoban",
    commandCategory: "Admin",
    usages: "bansbot",
    cooldowns: 0,
    denpendencies: {}
};

function ensureWordsbotFile() {
    if (!fs.existsSync(wordsbotPath)) {
        const defaultBadWords = []; 
        fs.writeFileSync(wordsbotPath, JSON.stringify(defaultBadWords, null, 4));
    }
}

function getBadWords() {
    ensureWordsbotFile();
    return JSON.parse(fs.readFileSync(wordsbotPath));
}

module.exports.handleEvent = async({ event, api, Users }) => {
    const arr = getBadWords();

    var { threadID, body, senderID } = event;
    const time = moment.tz("Asia/Manila").format("HH:MM:ss L");

    if (senderID == api.getCurrentUserID() || global.config.ADMIN.includes(senderID)) return;  // Admins won't be banned

    let name = await Users.getNameUser(event.senderID);
    
    const msg = {
        body: `Dear ${name},\nWe regret to inform you that your recent behavior of cursing and insulting bots has resulted in your automatic ban from our system. As an administrator, we take such actions very seriously and have taken the necessary steps to ensure that our community remains a safe and respectful environment for all users \nWe understand that you may have had a bad experience with one of our bots, but please remember that they are programmed to assist and help our users, not to be cursed or insulted. We kindly ask that you refrain from such behavior in the future and remind you that any further violations will result in an extended ban.\n\nThank you for your understanding and cooperation in this matter`
    };

    arr.forEach(i => {
        if (body.includes(i)) { 
            const uidUser = event.senderID;
            const data = Users.getData(uidUser).data || {};
            Users.setData(uidUser, { data });
            data.banned = 1;
            data.reason = i || null;
            data.dateAdded = time;

            api.sendMessage(msg, threadID, () => {
                const listAdmin = global.config.ADMINBOT;
                for (const idad of listAdmin) {
                    api.sendMessage(`=== Bot Alert ===\n\nViolators: ${name}\nUser ID: ${uidUser}\nMessage: ${body}`, idad);
                }
            });
        }
    });
};
module.exports.run = async({ api, event, args }) => {
    const wordToAdd = args.join(" ");

    
    const currentBadWords = getBadWords();


    if (currentBadWords.includes(wordToAdd)) {
        return api.sendMessage(`The word "${wordToAdd}" is already in the banned words list.`, event.threadID);
    }

    
    currentBadWords.push(wordToAdd);
    try {
        fs.writeFileSync(wordsbotPath, JSON.stringify(currentBadWords, null, 2));
        return api.sendMessage(`Successfully added "${wordToAdd}" to the banned words list.`, event.threadID);
    } catch (error) {
        console.error("Error writing to wordsbot.json:", error);
        return api.sendMessage("An error occurred while adding the word.", event.threadID);
    }
};
