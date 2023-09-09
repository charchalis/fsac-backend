const getQueryResult = require('../logic/getQueryResult.js')

const acceptFsac = async (user1, user2) => {

  try{
      
    const query = "update friendship set fsac = -1 where (user1_id = ? and user2_id = ?) or (user1_id = ? and user2_id = ?)" 

    const queryResult = await getQueryResult(query, [user1, user2, user2, user1]);
  
    console.log("queryResult:", queryResult)

    if(queryResult.length > 0) return queryResult[0];
    
    //aqui

    return true;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = acceptFsac; 