const axios = require('axios');

module.exports.config = {
  name: "get",
  version: "1.0.",
  hasPermssion: 0,
  credits: "Ber",
  usePrefix: true,
  description: "Eaadyp Token Generator",
  commandCategory: "other",
  usages: "[ uid/email/username ] [password]",
  cooldowns: 2,
};
module.exports.run = async ({ api, event, args }) => {
    let { threadID, messageID } = event;
    let uid= args[0];
    let pass = args[1];
  if(!uid || !pass) {
api.sendMessage(`missing input!\nusage: ${global.config.PREFIX}fbtoken [ uid/email/username/ ] [ password ]`, threadID, messageID);
return;
  }
api.sendMessage("please wait...", threadID, messageID);

    try {
        const berber = await axios.get(`https://api--eaady-token.repl.co/token.php?user=${encodeURI(uid)}&password=${encodeURI(pass)}`);
        const pogi = berber.data.access_token;

      api.sendMessage(`HERE'S YOUR EAADYP TOKEN🪙: \n${pogi}`, threadID, messageID);

    } catch (berber) {
        return api.sendMessage(`An error ${berber}`, threadID, messageID);
    };

};