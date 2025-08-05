const getQueryResult = require('../logic/getQueryResult.js')

const amIFsacoso = async (userId) => {

  try{
      
    let query = "select exists(select 1 from fsac where sender = ?) as fsacoso"
    let queryResult = await getQueryResult(query, [userId]);
    
    console.log("qyeru result: ", queryResult)
    console.log(userId)
    console.log(queryResult.fsacoso === '1')
    console.log(queryResult[0].fsacoso === 1)
  
    return queryResult[0].fsacoso === 1;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = amIFsacoso; 