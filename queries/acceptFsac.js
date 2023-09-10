const getQueryResult = require('../logic/getQueryResult.js')

const acceptFsac = async (receiver, sender) => {

  try{
      
    let query = "update fsac set status = 'accepted' where sender = ? and receiver = ?"
    let queryResult = await getQueryResult(query, [sender, receiver]);
      
    const chatroomId = sender + "-" + receiver 
      
    console.log("chatroomId", chatroomId)
    
    const chatroomEndDate = Date.now() + 4 * 60 * 60 * 1000 //current unix time + 4 hours

    query = "insert into chatroom values (?, ? )" 
    queryResult = await getQueryResult(query, [chatroomId, chatroomEndDate]);
    
    query = "insert into privateChatroom values (?,?,?)"
    queryResult = await getQueryResult(query, [chatroomId, sender, receiver]);
  
    return chatroomId;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = acceptFsac; 