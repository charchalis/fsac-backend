DROP TRIGGER IF EXISTS addChatroom;
DROP TRIGGER IF EXISTS removeChatroom;

CREATE TRIGGER addChatroom 
AFTER UPDATE ON Fsac 
WHEN OLD.status != 'accepted' and NEW.status = 'accepted' 
BEGIN
  INSERT INTO chatroom VALUES (NEW.sender || '-' || NEW.receiver, OLD.endDate);
  --INSERT INTO privatechatroom (id, user1_id, user2_id) VALUES (NEW.sender + '-' + NEW.receiver, NEW.sender, NEW.receiver);
END;

CREATE TRIGGER removeChatroom 
AFTER UPDATE ON Fsac 
WHEN OLD.status = 'accepted' and NEW.status != 'accepted'
BEGIN
  DELETE FROM chatroom where chatroom.id in (select privatechatroom.id from privatechatroom where (user1_id = NEW.sender and user2_id = NEW.receiver) or (user1_id = NEW.receiver and user2_id = NEW.sender) );
END;