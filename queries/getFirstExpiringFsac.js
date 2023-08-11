const getQueryResult = require('../logic/getQueryResult.js')

const getFirstExpiringFsac = async () => {
  
    try{


        const queryResult = await getQueryResult(
        'select min(fsac) from friendship where fsac <> 1'
        ,[]);
    
        console.log("queryResult:", queryResult)

        return true

        return queryResult['min(fsac)'];

    }catch(err){
        return false;
    }
    return true
}

  module.exports = getFirstExpiringFsac 