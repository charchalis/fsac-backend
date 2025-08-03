const fs = require('fs');

const getQueryResult = require('../logic/getQueryResult.js')

const getFriendList = async (userId) => {

  
  const query = `select distinct user.id, user.username, user.firstName, user.lastName,
  user.imagePath, friendship.chatroom_id as chatroom_id,
  CASE 
    WHEN fsac.sender IS NOT NULL THEN true 
    ELSE false 
  END AS fsacoso
  from user
  
  inner join friendship on (
    (friendship.user1_id = user.id and friendship.user2_id = ?)
    or
    (friendship.user2_id = user.id and friendship.user1_id = ?)
  ) 
    
    
  left join fsac on sender = user.id and receiver = ?
  `

  let friendList = await getQueryResult(query,[userId,userId,userId]);

  friendList.forEach(friend => friend.fsacoso = friend.fsacoso === 1 ? true : false)

  console.log("friends: ")
  friendList.forEach(friend => console.log(friend))
  
  friendList = friendList.map((friend) => {
    const image = fs.readFileSync('./images/' + friend.imagePath, { encoding: 'base64' });
    friend.image = image;
    delete friend.imagePath;
    return friend;
  });

  return friendList


}

module.exports = getFriendList
