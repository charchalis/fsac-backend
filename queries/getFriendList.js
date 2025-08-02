const fs = require('fs');

const getQueryResult = require('../logic/getQueryResult.js')

const getFriendList = async (userId) => {

  
  const query = `select distinct user.id, user.username, user.firstName, user.lastName,
  user.imagePath, friendship.chatroom_id as chatroom_id 
  from user
  
  inner join friendship on (
    (friendship.user1_id = user.id and friendship.user2_id = ?)
    or
    (friendship.user2_id = user.id and friendship.user1_id = ?)
  ) 
    
    
  left join fsac as fsacSender on fsacSender.sender = user.id and fsacSender.receiver = ?
  left join fsac as fsacReceiver on fsacReceiver.receiver = user.id and fsacReceiver.sender = ?
  `


  const friendList = await getQueryResult(query,[userId,userId,userId,userId]);

  console.log(friendList)

  const friendListWithMessages = async (friends) => {

    console.log("friends: ", friends)

    for(let i = 0; i<friends.length; i++){
      const friend = friends[i]
      if(!friend.chatroomId) continue

      const query2 = 'select * from message where chatroomId = ?'
      console.log("query:", query2)
      const messages = await getQueryResult(query2,[friend.chatroomId]);
      console.log("messages:", messages)
      friend.messages = messages
    }
    
    return friends

  }

  const popo = await friendListWithMessages(friendList)
  
  const friendListWithProfilePics = popo.map((friend) => {
    const image = fs.readFileSync('./images/' + friend.imagePath, { encoding: 'base64' });
    friend.image = image;
    delete friend.imagePath;
    return friend;
  });

  return friendListWithProfilePics.sort((a,b) => {
    if (a.statuss === 'accepted' && b.statuss != 'accepted') return -1; // a comes first
    if (a.statuss === 'received fsac' && b.statuss != 'accepted' && b.statuss != 'received fsac') return -1; // a comes first
    if (a.statuss === 'sent fsac' && b.statuss != 'accepted' && b.statuss != 'received fsac' && b.statuss != 'sent fsac') return -1; // a comes first
    if (a.statuss === 'no fsac' && b.statuss != 'accepted' && b.statuss != 'received fsac' && b.statuss != 'sent fsac' && b.statuss != 'no fsac') return -1; // a comes first
    //return a.timespan - b.timespan; // compare ages for non -1 values
    return 1;
  });


}

module.exports = getFriendList
