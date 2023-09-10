Drop TABLE IF EXISTS User;
Drop TABLE IF EXISTS Friendship;
Drop TABLE IF EXISTS Fsac;
Drop TABLE IF EXISTS Chatroom;
Drop TABLE IF EXISTS PrivateChatroom;
Drop TABLE IF EXISTS PublicChatroomUser;
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
    PRIMARY KEY (user1_id, user2_id)
);

CREATE TABLE Fsac (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    sender      REFERENCES User,
    receiver    REFERENCES User,
    endDate     INTEGER,
    status      VARCHAR(20) --can be 'declined', 'standby', or 'accepted'
);



CREATE TABLE Chatroom(
    id          VARCHAR(50) PRIMARY KEY,
    endDate     INTEGER
);

CREATE TABLE PrivateChatroom(
    id          REFERENCES Chatroom PRIMARY KEY,
    user1_id    REFERENCES User,
    user2_id    REFERENCES User
);

CREATE TABLE PublicChatroomUser(
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

