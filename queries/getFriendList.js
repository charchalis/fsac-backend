const fs = require('fs');

const getQueryResult = require('../logic/getQueryResult.js')

const getFriendList = async (userId) => {
    const friendList = await getQueryResult(
      'select id, username, firstName, lastName, imagePath from user where id in (select user1_id as user_id from friendship where user2_id = ? UNION select user2_id from friendship where user1_id = ?)'
    ,[userId, userId]);
  
    console.log(friendList)
  
    
    const friendListWithProfilePics = friendList.map((friend) => {
      const image = fs.readFileSync('./images/' + friend.imagePath, { encoding: 'base64' });
      friend.image = image;
      delete friend.imagePath;
      return friend;
    });
  
  
    return friendListWithProfilePics;

  }

  module.exports = getFriendList
