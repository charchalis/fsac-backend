
const getQueryResult = require('../logic/getQueryResult.js')

const insertMessage = async (message) => {
  try{
      
    const query = `INSERT INTO MESSAGE (chatroomId,userId,text,seen,date)
                    VALUES (?,?,?,?,?)`

    const queryResult = await getQueryResult(query, [message.chatroomId, message.userId, message.text, message.seen, message.date ]);
      
    console.log("query: ", queryResult)
  
    return queryResult;
    
    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = insertMessage