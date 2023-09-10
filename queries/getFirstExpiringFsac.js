const getQueryResult = require('../logic/getQueryResult.js')

const getFirstExpiringFsac = async () => {
  
    try{


        const queryResult = await getQueryResult(
        'select min(endDate) from fsac',[]);

        return queryResult[0]['min(endDate)'];

    }catch(err){
        return false;
    }
    return true
}

  module.exports = getFirstExpiringFsac 