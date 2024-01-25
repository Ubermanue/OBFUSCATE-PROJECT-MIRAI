const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "30.0.0",
    credits: "Cliff vincent",
    description: "Notification of bots or people entering groups with canvas",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

module.exports.run = async function ({
    api, event
}) {
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " ": global.config.BOTNAME}`, event.threadID, api.getCurrentUserID());
        return api.sendMessage({
            body: `BOT Connected successfully\nUsage: ${global.config.PREFIX}help`
        }, event.threadID);
    } else {
        try {
            let threadID = event.threadID;
            let {
                threadName,
                participantIDs,
                imageSrc
            } = await api.getThreadInfo(threadID);
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            var mentions = [],
            nameArray = [],
            memLength = [],
            i = 0;

        
            let addedParticipants1 = event.logMessageData.addedParticipants;
            for (let newParticipant of addedParticipants1) {
                userID = newParticipant.userFbId; // Update userID in each iteration
                const data = await api.getUserInfo(parseInt(userID));
                var obj = Object.keys(data);
                var userName = data[obj].name.replace("@", "");
                if (userID !== api.getCurrentUserID()) {
                    nameArray.push(userName);
                    mentions.push({
                        tag: userName, id: userID, fromIndex: 0
                    });
                    memLength.push(participantIDs.length - i++);
                    memLength.sort((a, b) => a - b);



            let msg = (typeof threadData.customJoin === "undefined")
            ? "Hi, {name}. Welcome to {threadName}.\nYou're the {soThanhVien}th member of this group, please enjoy! 🥳♥": threadData.customJoin;
            msg = msg
            .replace(/{name}/g, nameArray.join(', '))
            .replace(/{type}/g, (memLength.length > 1) ? 'Friends': 'Friend')
            .replace(/{soThanhVien}/g, memLength.join(', '))
            .replace(/{threadName}/g, threadName);

            const lol = [
`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/welcome?word=${nameArray.join(', ').substring(0, 8)}&fbid=${userID}&wc=${threadName.substring(0, 8)}&member=${memLength.join(', ')}&fullname=${nameArray.join(', ')}&link=https://www.facebook.com/profile.php?id=${userID}`
            ];

            const randomm = lol[Math.floor(Math.random() * lol.length)];

            const filePath = __dirname + "/cache/Avtmot.png";

            request(encodeURI(randomm)).pipe(fs.createWriteStream(filePath)).on("close", () => {
                fs.ensureFile(filePath, (err) => {
                    if (err) {
                        console.error("ERROR: " + err);
                    } else {
                        fs.stat(filePath, (err, stats) => {
                            if (err) {
                                console.error("ERROR: " + err);
                            } else {
                                if (stats.size > 0) {
                                    api.sendMessage({
                                        body: msg,
                                        attachment: fs.createReadStream(filePath),
                                        mentions
                                    }, event.threadID, () => fs.unlinkSync(filePath));
                                } else {
                                    console.error("ERROR: Image file is empty");
                                    fs.unlinkSync(filePath);
                                }
                            }
                        });
                    }
                });
            });
                }
            }
        } catch (err) {
            console.error("ERROR: " + err);
        }
    }
};