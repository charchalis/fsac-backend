const getQueryResult = require('../logic/getQueryResult.js')

const getPrivateChatroomId = async (user1, user2) => {
  try{
      
    const query = `SELECT id
    FROM chatroom
    WHERE id IN (
        SELECT DISTINCT id
        FROM chatroomUser
        WHERE userId IN (?, ?)
        GROUP BY chatroomId
        HAVING COUNT(DISTINCT userId) = 2
    );` 

    const queryResult = await getQueryResult(query, [user1, user2]);
  
    console.log("queryResult:", queryResult)

    if(queryResult.length > 0) return queryResult[0];
    
    //aqui
    
    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = getPrivateChatroomId 