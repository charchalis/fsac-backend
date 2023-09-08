const getQueryResult = require('../logic/getQueryResult.js')

const createChatroom = async (users) => {
  try{

    const queryResult = await getQueryResult(
      'insert into friendship (user1_id, user2_id) values (?,?)'
    ,[userId, friendId]);
  
    console.log("queryResult:", queryResult)
    
    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = createChatroom 