const cron = require('node-cron');
const updateExpiredFsacs = require('../queries/updateExpiredFsacs.js')
const getFirstExpiringFsac = require('../queries/getFirstExpiringFsac.js')

const cronJobExpireNextFsac = async () => {

    const nextFsacTimestamp = await getFirstExpiringFsac();
    console.log("popo")
    console.log(nextFsacTimestamp)
    console.log(Date.now())

    const validTime = nextFsacTimestamp - Date.now() > 0

    if (validTime) {

        const fsacDate = new Date(nextFsacTimestamp)
        console.log(fsacDate)

        const seconds = fsacDate.getSeconds()
        const minutes = fsacDate.getMinutes()
        const hours = fsacDate.getHours()

        const cronExpression = `${seconds} ${minutes} ${hours} * * *`;
        //const cronExpression = `* * * * * *`;
        console.log(cronExpression)
        
        const job = cron.schedule(cronExpression, async () => {
            console.log('Cron job is running!');
            await updateExpiredFsacs();
            cronJobExpireNextFsac();  //this fsac is gone so onto the next one
            console.log("destroying previous cron job ")
            job.destroy(); // This will destroy the cron job after it runs once
        });
        
        console.log(`Next fsac expiring at ${new Date(nextFsacTimestamp)}`);
    } else {
        console.log('Target time has already passed.');
    }
}

module.exports = cronJobExpireNextFsac