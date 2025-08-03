const getQueryResult = require('../logic/getQueryResult.js')

const acceptFsac = async (receiver, sender) => {

  try{
      
    let query = "update fsac set status = 'accepted' where sender = ? and receiver = ?"
    let queryResult = await getQueryResult(query, [sender, receiver]);
      
    const chatroomId = sender + "-" + receiver 
      
    const chatroomEndDate = Date.now() + 4 * 60 * 60 * 1000 //current unix time + 4 hours
    
    //update chatroom.endDate to chatroomEndDate maybe ???

  
    return chatroomId;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = acceptFsac; 