const getQueryResult = require('../logic/getQueryResult.js')

const getFirstExpiringFsac = async () => {
  
    try{


        const queryResult = await getQueryResult(
        'select min(fsac) from friendship where fsac <> 1 and fsac <> -1'
        ,[]);

        return queryResult[0]['min(fsac)'];

    }catch(err){
        return false;
    }
    return true
}

  module.exports = getFirstExpiringFsac 