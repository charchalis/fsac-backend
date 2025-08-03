const getQueryResult = require('../logic/getQueryResult.js')
const getChatroomMessages = require('./getChatroomMessages.js')

const getChatrooms = async (userId) => {
  try{
      
    const query = `
    SELECT DISTINCT c.id, c.owner_id, c.created_at
    FROM Chatroom c
    LEFT JOIN Friendship f ON c.id = f.chatroom_id AND (f.user1_id = ? OR f.user2_id = ?)
    LEFT JOIN PublicChatroomUser pcu ON c.id = pcu.chatroomId AND pcu.userId = ?
    WHERE f.chatroom_id IS NOT NULL OR pcu.chatroomId IS NOT NULL OR c.owner_id = ?;
    `

    const queryResult = await getQueryResult(query, [userId,userId,userId,userId]);
      
    const chatrooms = await Promise.all(
      queryResult.map(async chatroom => {
        const messages = await getChatroomMessages(chatroom.id)
        chatroom.messages = messages
        return chatroom
      })
    )

    chatrooms.forEach(r => console.log(r))

    return chatrooms;

  }catch(err){
    return false;
  }
  return true
}

  module.exports = getChatrooms 