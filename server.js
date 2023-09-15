const express     =   require('express');
const app         =   express();

const http        =   require('http');
const server      =   http.createServer(app);
const { Server }  =   require("socket.io");
const io          =   new Server(server);



const {activatePosts} = require('./posts.js')
const verifyToken = require('./logic/verifyToken.js')

const getFriendList = require('./queries/getFriendList.js')
const getPossibleFriends = require('./queries/getPossibleFriends.js')
const addFriend = require('./queries/addFriend.js')
const sendFsac = require('./queries/sendFsac.js')
const updateExpiredFsacs = require('./queries/updateExpiredFsacs.js')
const getFirstExpiringFsac = require('./queries/getFirstExpiringFsac.js')
const cronJobExpireNextFsac = require('./logic/cronJobExpireNextFsac.js')
const acceptFsac = require('./queries/acceptFsac.js');
const declineFsac = require('./queries/declineFsac.js');
const getChatroomMessages = require('./queries/getChatroomMessages.js');
const insertMessage = require('./queries/insertMessage.js');
const reportSeenMessages = require('./queries/reportSeenMessages.js');


app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


const connectedClients = []

/*SOCKET*/ 

io.on("connection", (socket) => {
  console.log("Socket: user connected")

  
  //wait so clients have time to setup the socket
  const wait = async () => {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await sleep(2000)
  }

  wait().then(() =>{
    console.log("Socket Emit: papers please")
    socket.emit("papers please")
  })
  
  
  
  
  
  socket.on('disconnect', (reason) => {
    // Remove the socket ID when a client disconnects
    console.log("Socket: user disconnected")
    console.log("reason: ", reason)
    const disconnectedClient = connectedClients.find((client) => client.socket.id === socket.id)
    if(disconnectedClient) delete connectedClients[disconnectedClient.userId];
    console.log("connectedClients: ", Object.keys(connectedClients).length)
  });
  
  socket.on('authenticate client socket', token => {
    
    console.log("Socket: authenticating client socket")

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Proceeding")
      connectedClients[authenticated.user] = {userId: authenticated.user, socket: socket}
      console.log("connectedClients: ", Object.keys(connectedClients).length)
      console.log(connectedClients)
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }
  
  })
  
  socket.on("gimme friends", async token => {
    console.log("Socket: friend list request")

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Sending friend list")
      console.log("authenticated.user:", authenticated.user)
      const friendList = await getFriendList(authenticated.user)
      socket.emit("take friend list", friendList)
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }


  })

  socket.on("search friend", async ({token, usernameSearch})=> {
    console.log("Socket: search friend request")

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Sending possible friends list")
      const possibleFriends = await getPossibleFriends(authenticated.user, usernameSearch)
      socket.emit("take possible friends", possibleFriends)
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }


  })
  
  socket.on("add friend", async ({token, friend})=> {
    console.log("Socket: add friend request")
    
    const friendId = friend.id

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Adding friendship")
      const friendshipConfirmation = await addFriend(authenticated.user, friendId)
      if(friendshipConfirmation){
        socket.emit("new friend", friend)
      }
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }


  })

  socket.on("fsac?", async ({token, userId, friendId})=> {
    console.log("Socket: fsac request from ",userId," to ", friendId)

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Adding sending fsac")
      console.log("authenticated.user:", authenticated.user)

      const endDate = Date.now() + 4 * 60 * 60 * 1000 //current unix time + 4 hours

      const fsacConfirmation = await sendFsac(authenticated.user, friendId, endDate)
      if(fsacConfirmation){

        console.log("fsac on database. sending fsac invite confirmation back to client")
        socket.emit("fsac invite successful", {friendId: friendId, endDate: endDate})

        const friendObject = connectedClients[friendId]
        
        const friendSocketId = friendObject ? friendObject.socket.id : undefined

        if(friendSocketId){
          console.log("found socket")
          io.to(friendSocketId).emit("received fsac", userId);   
        }
        else console.log("friend socket not found")

        //TODO: notification for friend 
        
      }
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }

  })

  socket.on("accepted fsac", async ({token, friendId}) => {
    console.log("Socket: accepted fsac")
    
    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. accepting fsac")
      const acceptFsacSuccess = await acceptFsac(authenticated.user, friendId)
      if(acceptFsacSuccess){
        socket.emit("successful accept fsac", {chatroomId: acceptFsacSuccess, friendId: friendId})
      }
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }
  })

  socket.on("declined fsac", async ({token, friendId}) => {
    console.log("Socket: declined fsac")
    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. declining fsac")
      const databaseSuccess = declineFsac(authenticated.user, friendId)
      
      if(databaseSuccess) socket.emit("successful fsac decline", friendId)

      
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }
  })

  socket.on("sent private message", ({token, message}) => {
    console.log("Socket: sent private message")

    console.log("message: ", message)
    
    const authenticated = verifyToken(token)


    if(authenticated.success){

      console.log("Trusty socket. sending message")

      insertMessage(message)

      const friendId = message.receiverId

      const friendObject = connectedClients[friendId]
        
      const friendSocketId = friendObject ? friendObject.socket.id : undefined

      if(friendSocketId){
        console.log("found socket")
        io.to(friendSocketId).emit("received private message", {userId,message}); 
      }else console.log("friend socket not found")
      
      
        
      
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }


  })

  socket.on("gimme messages", async ({token, chatroomId}) => {

    console.log("Socket: gimme messages")
    
    const authenticated = verifyToken(token)

    if(authenticated.success){

      console.log("Trusty socket. sending chatroom (", chatroomId, ") messages")
      const messages = await getChatroomMessages(chatroomId)
      socket.emit("take messages", messages)
      
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }


  })

  socket.on("seen new messages", async ({token, chatroomId, friendId, smallestMessageId, biggestMessageId}) => {

    console.log("seen new messages")
    
    const authenticated = verifyToken(token)

    if(authenticated.success){

      console.log("Trusty socket. reporting seen messages of ", chatroomId, " chat")
      await reportSeenMessages(authenticated.user, chatroomId, smallestMessageId, biggestMessageId)
      

      const friendObject = connectedClients[friendId]
      const friendSocketId = friendObject ? friendObject.socket.id : undefined

      if(friendSocketId){
        console.log("found socket")
        io.to(friendSocketId).emit("friend seen", {chatroomId, userId: authenticated.user, smallestMessageId, biggestMessageId}); 
      }else console.log("friend socket not found")
      
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }


  })

})





/*activate posts*/
activatePosts(app)

updateExpiredFsacs()
cronJobExpireNextFsac()






/*SERVER LISTEN*/
server.listen(3000, () => {
  console.log('\nlistening on *:3000');
});