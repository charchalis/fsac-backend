const getQueryResult = require('../logic/getQueryResult.js')

const reportSeenMessages = async (userId, chatroomId, seenDate) => {
  try{
      
    const queryResult = await getQueryResult(
      "update message set seen=1 where chatroomId = ? and userId != ? and date <= ?" 
    ,[chatroomId, userId, seenDate]);
      
    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = reportSeenMessages 