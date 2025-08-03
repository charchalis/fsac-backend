const fs = require('fs');

const getQueryResult = require('../logic/getQueryResult.js')

const getPossibleFriends = async (userId, userSearch) => {
    
    const friendList = await getQueryResult(
      'select id, username, firstName, lastName, imagePath from user where (username like ? or id like ? or firstName like ? or lastName like ? ) and id <> ? and id not in (select user1_id as user_id from friendship where user2_id = ? UNION select user2_id from friendship where user1_id = ?)'
    ,[`${userSearch}%`, `${userSearch}%`, `${userSearch}%`, `${userSearch}%`, userId, userId, userId]);
  
    console.log(friendList)
  
    
    const friendListWithProfilePics = friendList.map((friend) => {
      const image = fs.readFileSync('./images/' + friend.imagePath, { encoding: 'base64' });
      friend.image = image;
      delete friend.imagePath;
      friend.endDate = null;
      friend.statuss = "no fsac";
      friend.chatroomId = null
      return friend;
    });
  
  
    return friendListWithProfilePics;

  }

  module.exports = getPossibleFriends 
