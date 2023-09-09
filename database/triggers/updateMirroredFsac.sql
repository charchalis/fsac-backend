DROP TRIGGER IF EXISTS UpdateMirroredFsac;

CREATE TRIGGER UpdateMirroredFsac
AFTER UPDATE ON Friendship
WHEN NOT (OLD.fsac = 1 and NEW.fsac IS NULL)
BEGIN
    UPDATE Friendship
    SET fsac = CASE 
                  WHEN NEW.fsac IS NULL THEN NULL
                  WHEN NEW.fsac = 1 THEN NULL
                  ELSE 1
                END
    WHERE (user1_id = NEW.user2_id AND user2_id = NEW.user1_id);
END;

