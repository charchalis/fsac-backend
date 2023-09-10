const getQueryResult = require('../logic/getQueryResult.js')

const sendFsac = async (userId, friendId, endDate) => {
  try{
    
    console.log("userid: ", userId)
    console.log("firnedid: ", friendId)
    console.log("endDate: ", endDate)


    const query = "insert into fsac (sender, receiver, endDate, status) values (?,?,?, 'standby')"

    const queryResult = await getQueryResult(query,[userId, friendId, endDate]);
  
    console.log("queryResult:", queryResult)

    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = sendFsac 