Drop TABLE IF EXISTS User;
Drop TABLE IF EXISTS Friendship;

CREATE TABLE User (
    id		VARCHAR(500) PRIMARY KEY,
    username 	VARCHAR(50),
    password    VARCHAR(50),
    token 	VARCHAR(500),
    firstName 	VARCHAR(50),
    lastName	VARCHAR(50),
    imagePath 	VARCHAR(100),
    fsacoso	INTEGER CHECK (fsacoso IN (0,1)) DEFAULT 0
);

CREATE TABLE Friendship (
    user1_id 	REFERENCES User,
    user2_id	REFERENCES User,
    PRIMARY KEY (user1_id, user2_id)
)
