const runQuery = require('../logic/runQuery.js')
const getQueryResult = require('../logic/getQueryResult.js')

const addFriend = async (userId, friendId) => {
  try{

    const queryResult = await runQuery(
      'insert into friendship (user1_id, user2_id) values (?,?)',
      [userId, friendId]
    );
  
    console.log("queryResult:\n", queryResult)

    const result = await getQueryResult(
      'select chatroom_id from friendship where user1_id = ? and user2_id = ?',
      [userId, friendId]
    )
    
    return result[0].chatroom_id;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = addFriend 
