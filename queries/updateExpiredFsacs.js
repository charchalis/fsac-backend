const getQueryResult = require('../logic/getQueryResult.js')

const updateExpiredFsacs = async (currentTime) => {

    console.log(currentTime)

    console.log("updating expired fsacs")

    try{

        const queryResult = await getQueryResult(
            'update friendship set fsac = NULL where fsac < ?'
        ,[parseInt(currentTime)]);
      
        console.log("queryResult:", queryResult)
        
        return true;
    
    }catch(err){
        console.log(err)
        return false;
    }

    return true

}

module.exports = updateExpiredFsacs