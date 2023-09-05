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

    return friendListWithProfilePics.sort((a,b) => {
      if (a.timespan === 1 && b.timespan !== 1) {
        return -1; // a comes first
      } else if (a.timespan !== 1 && b.timespan === 1) {
        return 1; // b comes first
      } else {
        return a.timespan - b.timespan; // compare ages for non -1 values
      }
    });
  

  }

  module.exports = getFriendList
