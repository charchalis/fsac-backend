DROP TRIGGER IF EXISTS addFriendshipChatroom;
DROP TRIGGER IF EXISTS removeChatroom;


CREATE TRIGGER addFriendshipChatroom
AFTER INSERT ON Friendship 
BEGIN
  INSERT INTO Chatroom (created_at) VALUES (CURRENT_TIMESTAMP);
  UPDATE Friendship SET chatroom_id = (SELECT last_insert_rowid()) where user1_id = NEW.user1_id AND user2_id = NEW.user2_id;
END;

CREATE TRIGGER removeChatroom 
AFTER UPDATE ON Fsac 
WHEN OLD.status = 'accepted' and NEW.status != 'accepted'
BEGIN

  --THIS DOES NOT WORK
  DELETE FROM chatroom where id = (NEW.sender || '-' || NEW.receiver) or id = (NEW.receiver || '-' || NEW.sender);
  DELETE FROM privatechatroom where id = (NEW.sender || '-' || NEW.receiver) or id = (NEW.receiver || '-' || NEW.sender);

END;