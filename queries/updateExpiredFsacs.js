const getQueryResult = require('../logic/getQueryResult.js')

const updateExpiredFsacs = async () => {

    console.log("updating expired fsacs")

    const currentTime = Date.now()

    console.log(currentTime)

    try{

        await getQueryResult(
            'update friendship set fsac = NULL where fsac < ? and fsac <> 1'  
        ,[currentTime]);
        
        return true;
    
    }catch(err){
        console.log(err)
        return false;
    }

    return true

}

module.exports = updateExpiredFsacs