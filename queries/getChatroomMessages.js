const getQueryResult = require('../logic/getQueryResult.js')

const getChatroomMessages = async (chatroomId) => {
  try{
      
    const query = `SELECT * FROM message WHERE chatroomId = ?`

    const queryResult = await getQueryResult(query, [chatroomId]);
      
    console.log("query: ", queryResult)
  
    return queryResult;
    
    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = getChatroomMessages 