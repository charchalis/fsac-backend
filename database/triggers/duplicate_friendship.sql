DROP TRIGGER IF EXISTS duplicate_friendship;

CREATE TRIGGER duplicate_friendship
AFTER INSERT ON Friendship
FOR EACH ROW
BEGIN
  INSERT INTO Friendship (user1_id, user2_id)
    VALUES (NEW.user2_id, NEW.user1_id);
END;