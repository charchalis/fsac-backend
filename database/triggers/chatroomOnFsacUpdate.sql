DROP TRIGGER IF EXISTS addChatroom;
DROP TRIGGER IF EXISTS removeChatroom;

CREATE TRIGGER addChatroom 
AFTER UPDATE ON Fsac 
WHEN OLD.status != 'accepted' and NEW.status = 'accepted' 
BEGIN
  INSERT INTO chatroom VALUES (NEW.sender || '-' || NEW.receiver, OLD.endDate);
  INSERT INTO privatechatroom (id, user1_id, user2_id) VALUES (NEW.sender || '-' || NEW.receiver, NEW.sender, NEW.receiver);
END;

CREATE TRIGGER removeChatroom 
AFTER UPDATE ON Fsac 
WHEN OLD.status = 'accepted' and NEW.status != 'accepted'
BEGIN

  --THIS DOES NOT WORK
  DELETE FROM chatroom where id = (NEW.sender || '-' || NEW.receiver) or id = (NEW.receiver || '-' || NEW.sender);
  DELETE FROM privatechatroom where id = (NEW.sender || '-' || NEW.receiver) or id = (NEW.receiver || '-' || NEW.sender);

END;