const getQueryResult = require('../logic/getQueryResult.js')

const getChatroomMessages = async (chatroomId) => {
  try{
      
    const query = `SELECT * FROM message WHERE chatroomId = ?`

    const queryResult = await getQueryResult(query, [chatroomId]);
  
    return queryResult.map(message => {message.seen = message.seen === 1; return message});

  }catch(err){
    return false;
  }
  return true
}

  module.exports = getChatroomMessages 