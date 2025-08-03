const runQuery = require('../logic/runQuery.js')
const getQueryResult = require('../logic/getQueryResult.js')

const notFsacosoAnymore = async (userId) => {
  try{

    const toBeDeletedFriends = await getQueryResult(
        'select receiver from fsac where sender = ?',
        [userId]
    );

    const queryResult = await runQuery(
      'delete from fsac where sender = ?',
      [userId]
    );

    return toBeDeletedFriends.map(friend => friend.receiver)

  }catch(err){
    console.log(err)
    return false;
  }
  return true
}

  module.exports = notFsacosoAnymore 