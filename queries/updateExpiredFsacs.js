const getQueryResult = require('../logic/getQueryResult.js')

const updateExpiredFsacs = async (currentTime) => {

    

    console.log("updating expired fsacs")

    console.log(currentTime)

    try{

        const queryResult = await getQueryResult(
            'update friendship set fsac = NULL where fsac < ?  --this no work for some reason'  
        ,[currentTime]);
      
        console.log("queryResult:", queryResult)
        
        return true;
    
    }catch(err){
        console.log(err)
        return false;
    }

    return true

}

module.exports = updateExpiredFsacs