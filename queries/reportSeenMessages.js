const getQueryResult = require('../logic/getQueryResult.js')

const reportSeenMessages = async (userId, chatroomId, smallestId, biggestId) => {
  try{
      
    const queryResult = await getQueryResult(
      "update message set seen=1 where chatroomId = ? and userId != ? and id>=? and id<=?" 
    ,[chatroomId, userId, smallestId, biggestId]);
      
    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = reportSeenMessages 