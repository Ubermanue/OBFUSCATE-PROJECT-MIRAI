const axios = global.nodemodule["axios"];

module.exports.config = {
  name: "uptimerobot",
  version: "30.0.0",
  hasPermssion: 0,
  credits: "Choru Tiktokers",
  description: "admin or monitor",
  commandCategory: "uptime",
  usages: "uptime monitor [text]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const prefix = global.config.PREFIX;
  
api.sendMessage(`usage ⚠️:\n${prefix}uptimerobot monitor link | user\n${prefix}uptimerobot unmonitor link \n${prefix}uptimerobot add admin mention \nCode by Choru Tiktokers`, event.threadID, event.messageID);

  switch (args[0]) {
    case "help": {
      api.sendMessage(`usage ⚠️:\n${prefix}uptimerobot monitor link | user\n${prefix}uptimerobot unmonitor link \n${prefix}uptimerobot add admin mention \nCode by Yazky Cliffsword`, event.threadID, event.messageID);
      break;
    }

    case "monitor": {
    const input = args.slice(1).join(' ');  // remove the "monitor" keyword
    const [link, user] = input.split(' | ');

    if (!link || !user) {
        return api.sendMessage(
            "Please provide link and user separated by |",
            event.threadID,
            event.messageID
        );
    }

    try {
        const apiUrl = `https://uptimerobot--uptimevisionaries.repl.co/add?link=${encodeURIComponent(link)}&user=${encodeURIComponent(user)}`;
        console.log("Calling API with URL:", apiUrl);
        const res = await axios.get(apiUrl);
        console.log("API Response:", res.data);
        const responseMessage = res.data.message || res.data.error;
        return api.sendMessage(responseMessage, event.threadID, event.messageID);
    } catch (error) {
        console.error("Error fetching data:", error);
        return api.sendMessage("There was an error processing your request.", event.threadID, event.messageID);
    }

    break;
}

case "unmonitor": {
    const input = args.slice(1).join(' ');  
    const [link] = input.split(' ');  

    if (!link) {
        return api.sendMessage(
            "Please provide link",
            event.threadID,
            event.messageID
        );
    }

    try {
        const apiUrl = `https://uptimerobot--uptimevisionaries.repl.co/remove?link=${encodeURIComponent(link)}`;
        console.log("Calling API with URL:", apiUrl);
        const res = await axios.get(apiUrl);
        console.log("API Response:", res.data);
        const responseMessage = res.data.message || res.data.error;
        return api.sendMessage(responseMessage, event.threadID, event.messageID);
    } catch (error) {
        console.error("Error fetching data:", error);
        return api.sendMessage("There was an error processing your request.", event.threadID, event.messageID);
    }

    break;
}
}
};
