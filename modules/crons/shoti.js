  // made by hiroshikim big credit for boss yan
  cron.schedule('*/10 * * * *', async () => {
    const currentTime = Date.now();
    if (currentTime - lastMessageTime < minInterval) {
      console.log("Skipping message due to rate limit");
      return;
    }

    try {
      let response = await axios.post('https://shoti-api.libyzxy0.repl.co/api/get-shoti', { apikey: "shoti-1hd2fm5fcuh97qt26c" });
      var file = fs.createWriteStream(path.join(__dirname, "cache", "shoti.mp4"));
      var rqs = request(encodeURI(response.data.data.url));
      rqs.pipe(file);

      file.on('finish', () => {
        api.getThreadList(25, null, ['INBOX'], async (err, data) => {
          if (err) return console.error("Error [Thread List Cron]: " + err);
          let i = 0;
          let j = 0;

          while (j < 20 && i < data.length) {
            if (data[i].isGroup && data[i].name != data[i].threadID && !messagedThreads.has(data[i].threadID)) {
              api.sendMessage({
                body: `AUTO RND TIKTOK VID EVERY 20 MINUTES\n\nUser: @${response.data.user.username}`,
                attachment: fs.createReadStream(path.join(__dirname, "cache", "shoti.mp4"))
              }, data[i].threadID, (err) => {
                if (err) return;
                messagedThreads.add(data[i].threadID);
              });
              j++;
              const CuD = data[i].threadID;
              setTimeout(() => {
                messagedThreads.delete(CuD);
              }, 1000);
            }
            i++;
          }
        });
      });

      file.on('error', (err) => {
        console.error("Error downloading video:", err);
      });
    } catch (error) {
      console.error("Error retrieving Shoti video:", error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });
};