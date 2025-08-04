const getQueryResult = require('../logic/getQueryResult.js')

const sendFsac = async (userId, friendId, endDate) => {
  try{
    
    console.log("userid: ", userId)
    console.log("friendid: ", friendId)
    console.log("endDate: ", endDate)


    const query = "insert into fsac (sender, receiver) values (?,?)"

    const queryResult = await getQueryResult(query,[userId, friendId]);
  
    console.log("queryResult:", queryResult)

    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = sendFsac 