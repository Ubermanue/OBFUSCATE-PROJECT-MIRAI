module.exports.config = {
	name: "spam",
	version: "30.0.0",
	hasPermssion: 0,
	credits: "Choru Tiktokers",
	description: "Spams a message 100 times every second.",
	commandCategory: "text",
	usages: "[text]",
	cooldowns: 5
};

module.exports.run = ({ api, event, args }) => {
    const spamCount = 100;
    const message = args.join(" ");
    let i = 0;

    const interval = setInterval(() => {
        if (i >= spamCount) {
            clearInterval(interval);
            return;
        }

        api.sendMessage(message, event.threadID);
        i++;
    }, 100); // 1000 milliseconds = 1 second
}
