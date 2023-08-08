const getQueryResult = require('../logic/getQueryResult.js')

const sendFsac = async (userId, friendId, timespan) => {
  try{

    const queryResult = await getQueryResult(
      'update friendship set fsac = ? where user1_id = ? and user2_id = ?'
    ,[timespan, userId, friendId]);
  
    console.log("queryResult:", queryResult)
    
    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = sendFsac 