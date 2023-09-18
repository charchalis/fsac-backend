const getQueryResult = require('../logic/getQueryResult.js')

const query = `select distinct user.id, user.username, user.firstName, user.lastName, user.imagePath, fsacReceiver.endDate,
  CASE
    WHEN fsacSender.status = 'standby' THEN 'received fsac'
    WHEN fsacReceiver.status = 'standby' THEN 'sent fsac'
    WHEN fsacSender.status = 'accepted' THEN 'accepted'
    WHEN fsacReceiver.status = 'accepted' THEN 'accepted'
    WHEN fsacSender.status = 'declined' THEN 'declined'
    ELSE 'no fsac'
  END AS statuss, chatroom.id as chatroomId 
  from user
  
  inner join friendship on (
    (friendship.user1_id = user.id and friendship.user2_id = ?)
    or
    (friendship.user2_id = user.id and friendship.user1_id = ?)
  ) 
    
    
  left join fsac as fsacSender on fsacSender.sender = user.id and fsacSender.receiver = ?
  left join fsac as fsacReceiver on fsacReceiver.receiver = user.id and fsacReceiver.sender = ?
  
  left join privateChatroom as chatroom on ((
    (user.id = chatroom.user1_id and chatroom.user2_id = ?)
    or
    (user.id = chatroom.user2_id and chatroom.user1_id = ?)
    )
    and statuss = 'accepted'
  )`

  const userId = 'U'

  getQueryResult(query,[userId,userId,userId,userId, userId, userId]).then((foo) => console.log(foo))