const cron = require('node-cron');
const updateExpiredFsacs = require('../queries/updateExpiredFsacs.js')
const getFirstExpiringFsac = require('../queries/getFirstExpiringFsac.js')

const cronJobExpireNextFsac = async () => {

    const nextFsacTimestamp = await getFirstExpiringFsac();

    const validTime = nextFsacTimestamp - Date.now() > 0

    if (validTime) {

        const fsacDate = new Date(nextFsacTimestamp)

        const seconds = fsacDate.getSeconds()
        const minutes = fsacDate.getMinutes()
        const hours = fsacDate.getHours()

        const cronExpression = `${seconds} ${minutes} ${hours} * * *`;
        
        const job = cron.schedule(cronExpression, async () => {
            console.log('Cron job is running!');
            await updateExpiredFsacs();
            cronJobExpireNextFsac();  //this fsac is gone so onto the next one
            console.log("destroying previous cron job ")
            job.destroy(); // This will destroy the cron job after it runs once
        });
        
        console.log(`\nNext fsac expiring at ${new Date(nextFsacTimestamp)}`);
    } else {
        console.log('Target time has already passed.');
    }
}

module.exports = cronJobExpireNextFsac