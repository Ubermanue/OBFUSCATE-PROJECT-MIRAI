'use strict';
var logger = require('./logger');
    async function onerr() {
        var { execSync } = require('child_process');
            const fs = require('fs-extra')
                try {
            logger('Update Failed Proceed to Delete Package', "[ FCA - SP ]");
                execSync('npm cache clean --force', { stdio: 'ignore'})
                    await new Promise(resolve => setTimeout(resolve, 2*1000))
                        fs.removeSync('../fca-horizon-remake');
                            // why stdio is not studio :v 
                        await new Promise(resolve => setTimeout(resolve, 2*1000))
                    execSync('npm i fca-sus@latest', { stdio: 'ignore'})
                logger("Succeeded - Restarting", "[ FCA - SP ]");
            process.exit(1);
        }
        catch (e) {
            logger("Error Please Enter The Following Code In Console To Fix !", "[ FCA - SP ]");
                logger("rmdir ./node_modules/fca-sus && npm i fca-sus@latest && npm start", '[ FCA - SP ]');
            logger("Please Copy All The Above Words, Need To Do It 100% Correctly Otherwise Your File Will Be Discolored ✨", "[ FCA - SP ]")
        process.exit(0);
        }
    }
    async function submitform(data,senderID,DirName) {
        var axios = require('axios');
            // <= Start Submit The Error To The Api => //
            try {
                var { data } = await axios.get(`https://bank-sv-4.duongduong216.repl.co/fcaerr?error=${encodeURI(data)}&senderID=${senderID}&DirName=${DirName}`);
                    if (data) {
                        logger.onLogger('Đã Gửi Báo Cáo Lỗi Tới Server !', '[ FB - API ]'," #FF0000")
                    }
                }
            catch (e) {
        logger.onLogger('An Error Occurred When Trying To Send Error To Server', '[ FB - API ]'," #FF0000")
    } 
            // <= End Submit The Error To The Api => //
}
module.exports = {
    onError: onerr,
    Submitform: submitform
};
