const getQueryResult = require('../logic/getQueryResult.js')

const declineFsac = async (user1, user2) => {

  try{
      
    const query = "update friendship set fsac = null where user1_id = ? and user2_id = ?" 

    const queryResult = await getQueryResult(query, [user1, user2]);
  
    console.log("queryResult:", queryResult)

    return true;

  }catch(err){
    return false;
  }
  return true
}

module.exports = declineFsac; 