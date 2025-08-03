Drop TABLE IF EXISTS User;
Drop TABLE IF EXISTS Friendship;
Drop TABLE IF EXISTS Fsac;
Drop TABLE IF EXISTS Chatroom;
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
    chatroom_id  REFERENCES Chatroom DEFAULT NULL,
    PRIMARY KEY (user1_id, user2_id)  --TODO: prevent duplicate keys
);

CREATE TABLE Fsac (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    sender      REFERENCES User,
    receiver    REFERENCES User
);

CREATE TABLE Chatroom(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id     REFERENCES User DEFAULT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PublicChatroomUser(
    userId      REFERENCES User,
    chatroomId  INTEGER REFERENCES Chatroom
);

CREATE TABLE Message(
    id          INTEGER PRIMARY KEY AUTOINCREMENT, 
    chatroomId  INTEGER REFERENCES Chatroom,
    userId      VARCHAR(50) REFERENCES User,
    text        VARCHAR(500),
    seen        INTEGER,
    date        INTEGER,

    UNIQUE (id, chatroomId)
);

