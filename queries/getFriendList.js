const fs = require('fs');

const getQueryResult = require('../logic/getQueryResult.js')

const getFriendList = async (userId) => {

  
  const query = `select user.id, user.username, user.firstName, user.lastName, user.imagePath, fsacReceiver.endDate,
  CASE
    WHEN fsacSender.status = 'standby' THEN 'received fsac'
    WHEN fsacReceiver.status = 'standby' THEN 'sent fsac'
    WHEN fsacSender.status = 'accepted' THEN 'accepted'
    WHEN fsacSender.status = 'declined' THEN 'declined'
    ELSE 'no fsac'
  END AS statuss, chatroom.id as chatroomId 
  from user
  
  inner join friendship on (
    (friendship.user1_id = user.id and friendship.user2_id = ?)
    or
    (friendship.user2_id = user.id and friendship.user1_id = ?)
  ) 
    
    
  left join fsac as fsacSender on fsacSender.sender = user.id
  left join fsac as fsacReceiver on fsacReceiver.receiver = user.id
  
  left join privateChatroom as chatroom on ((
    (user.id = chatroom.user1_id and chatroom.user2_id = ?)
    or
    (user.id = chatroom.user2_id and chatroom.user1_id = ?)
    )
    and statuss = 'accepted'
  )`


  const friendList = await getQueryResult(query,[userId,userId,userId,userId]);

  console.log(friendList)

  
  const friendListWithProfilePics = friendList.map((friend) => {
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
