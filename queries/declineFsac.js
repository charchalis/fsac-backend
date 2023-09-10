const getQueryResult = require('../logic/getQueryResult.js')

const declineFsac = async (user1, user2) => {

  try{
      
    const query = "update fsac set status = 'declined' where receiver = ? and sender = ?" 

    const queryResult = await getQueryResult(query, [user1, user2]);
  
    console.log("queryResult:", queryResult)

    return true;

  }catch(err){
    return false;
  }
  return true
}

module.exports = declineFsac; 