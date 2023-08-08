const fs = require('fs');

const getQueryResult = require('../logic/getQueryResult.js')

const getFriendList = async (userId) => {
    const friendList = await getQueryResult(
      'select user.id, user.username, user.firstName, user.lastName, user.imagePath, friendship.fsac as timespan from user, friendship where user.id = friendship.user2_id and friendship.user1_id = ?'
    ,[userId]);
  
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
