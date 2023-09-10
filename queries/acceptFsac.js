const getQueryResult = require('../logic/getQueryResult.js')

const acceptFsac = async (user1, user2) => {

  try{
      
    let query = "update friendship set fsac = -1 where user1_id = ? and user2_id = ?" 
    let queryResult = await getQueryResult(query, [user1, user2]);
      
    const chatroomId = user1 + "-" + user2
      
    console.log("chatroomId", chatroomId)
    
    query = "insert into chatroom values (?)" 
    queryResult = await getQueryResult(query, [chatroomId]);

    console.log("popo")
    
    query = "update friendship set chatroomId = ? where (user1_id = ? and user2_id = ?) or (user2_id = ? and user1_id) " 
    queryResult = await getQueryResult(query, [chatroomId, user1, user2, user1, user2]);
  
    return chatroomId;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = acceptFsac; 