const fs = require('fs-extra');
const moment = require("moment-timezone");
const path = require('path');

const consoleStatusPath = __dirname + '/cache/console.txt';

const messageBasePath = path.join(__dirname, '..', '..', 'includes', 'database', 'messagebase');

if (!fs.existsSync(consoleStatusPath)) {
  fs.writeFileSync(consoleStatusPath, 'false');
}

if (!fs.existsSync(messageBasePath)){
    fs.mkdirSync(messageBasePath, { recursive: true });
}

module.exports.config = {
    name: "console",
    version: "30.0.0",
    hasPermission: 0,
    credits: "Choru Tiktokers",
    description: "receive message from gc",
    commandCategory: "console logs",
    usages: "console on/off",
    cooldowns: 0
};

module.exports.handleEvent = async function ({ api, args, Users, event, Threads, utils, client }) {
    let { messageID, threadID, senderID, mentions } = event;

    const thread = global.data.threadData.get(event.threadID) || {};

    if (typeof thread["console"] !== "undefined" && thread["console"] == true) return;
    if (event.senderID == api.getCurrentUserID()) return;
if (fs.readFileSync(consoleStatusPath, 'utf-8') === 'disable') return;
    const threadInfo = await api.getThreadInfo(event.threadID);
    const nameBox = threadInfo.threadName;
    const time = moment.tz("Asia/Manila").format("LLLL");
    
    const nameUser = await Users.getNameUser(event.senderID);
    
    const userInfos = await api.getUserInfo(event.senderID);
    
    const namebot = await Users.getNameUser(api.getCurrentUserID());
    
  const userMapping = userInfos[event.senderID];
  
    const msg = event.body || "Photos, videos, or special characters";
var genderMap = {
    1: "female",
    2: "male"
};

var Genders = genderMap[userMapping.gender] || userMapping.gender;
const profilePicUrl = `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    /*const userList = threadInfo.userInfo.map(user => ({
        ID: user.id,
        Name: user.name,
        "First Name": user.firstName,
        "Profile URL": `https://www.facebook.com/profile.php?id=${user.id}`,
        Image: `https://graph.facebook.com/${user.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
    }));*/

    const lolz = {
        //listUser: userList,
        User: {
            MessageID: messageID || "null",
            SenderID: senderID || "null",
            Name: nameUser || "null",
            Vanity: userMapping.vanity || "null",
            "Profile URL": userMapping.profileUrl || "null",
            Gender: Genders || "null",
            image: profilePicUrl
        },
        
        Thread: {
            ThreadId: event.threadID || "null",
            ThreadName: nameBox || "null"
        },
        Bot: {
            BotId: global.data.botID || api.getCurrentUserID() || "null",
  BotId: global.data.botID || api.getCurrentUserID() || "null",
  BotName: (namebot === "Facebook users") ? global.config.BOTNAME : "null"
},
        EventBody: msg || "null",
        Time: time
    };

 //   console.log();
    const messageFilePath = path.join(messageBasePath, `mesange-[${nameBox}]-.json`);
  
    fs.appendFileSync(messageFilePath, JSON.stringify(lolz, null, 4) + '\n');
};

module.exports.run = async ({ api, event, args }) => {
    const permission = [`${global.config.Permission}`, `${global.config.Permissionv2}`];
    if (!permission.includes(event.senderID)) return api.sendMessage("You don't have permission to use this command", event.threadID, event.messageID);
    if (module.exports.config.credits !== "Choru Tiktokers") {
        return api.sendMessage("lmao change credits", event.threadID, event.messageID);
    }
    try {
        if (args[0] === 'on') {
            api.sendMessage('Console has been enabled', event.threadID, event.messageID);
        } else if (args[0] === 'off') {
            api.sendMessage('Console has been disabled', event.threadID, event.messageID);
        } else {
            api.sendMessage('Incorrect syntax', event.threadID, event.messageID);
        }
    } catch (e) {
        console.log(e);
    }
};
