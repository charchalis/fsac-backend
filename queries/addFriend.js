const getQueryResult = require('../logic/getQueryResult.js')

const addFriend = async (userId, friendId) => {
  try{

    const queryResult = await getQueryResult(
      'insert into friendship values (?,?)'
    ,[userId, friendId]);
  
    console.log("queryResult:", queryResult)
    
    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = addFriend 
