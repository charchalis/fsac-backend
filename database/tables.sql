Drop TABLE IF EXISTS User;
Drop TABLE IF EXISTS Friendship;

CREATE TABLE User (
    id		VARCHAR(500) PRIMARY KEY,
    username 	VARCHAR(50),
    password    VARCHAR(50),
    firstName 	VARCHAR(50),
    lastName	VARCHAR(50),
    imagePath 	VARCHAR(100)
);

CREATE TABLE Friendship (
    user1_id 	REFERENCES User,
    user2_id	REFERENCES User,
    fsac        INTEGER DEFAULT NULL,
    chatroomID  VARCHAR(50) DEFAULT NULL,
    
    PRIMARY KEY (user1_id, user2_id)
);

CREATE TABLE Message(
    id          INTEGER, 
    chatroomId  VARCHAR(50),
    userId      VARCHAR(50) REFERENCES User,
    text        VARCHAR(500),
    date        INTEGER,

    PRIMARY KEY (id, chatroomId)
);

