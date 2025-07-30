
const runQuery = require('../logic/runQuery.js')

const insertMessage = async (message) => {
  try{
      
    const query = `INSERT INTO MESSAGE (chatroomId,userId,text,seen,date)
                    VALUES (?,?,?,?,?)`

    const queryResult = await runQuery(query, [message.chatroomId, message.userId, message.text, message.seen, message.date ]);
    
    console.log("query: ", queryResult)
    console.log("lastID: " + queryResult.lastID)
  
    return queryResult.lastID;
    
    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = insertMessage