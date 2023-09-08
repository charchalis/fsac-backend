Drop TABLE IF EXISTS User;
Drop TABLE IF EXISTS Friendship;
Drop TABLE IF EXISTS Chatroom;
Drop TABLE IF EXISTS ChatroomUser;
Drop TABLE IF EXISTS Message;

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
    chatroomId  VARCHAR(50) REFERENCES Chatroom DEFAULT NULL,
    
    PRIMARY KEY (user1_id, user2_id)
);

CREATE TABLE Chatroom(
    id VARCHAR(50) PRIMARY KEY
);

CREATE TABLE ChatroomUser(
    userId REFERENCES User,
    chatroomId  VARCHAR(50) REFERENCES Chatroom
);

CREATE TABLE Message(
    id          INTEGER, 
    chatroomId  VARCHAR(50) REFERENCES Chatroom,
    userId      VARCHAR(50) REFERENCES User,
    text        VARCHAR(500),
    seend       INTEGER,
    date        INTEGER,

    PRIMARY KEY (id, chatroomId)
);

