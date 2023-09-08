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
const getChatroomId = require('./queries/getChatroomId.js')


app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


const connectedClients = []

/*SOCKET*/ 

io.on("connection", (socket) => {
  console.log("user connected")

  
  //wait so clients have time to setup the socket
  const wait = async () => {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    console.log("sleeping")
    await sleep(2000)
    console.log("woke up")
  }

  wait().then(() =>{
    console.log("papers please")
    socket.emit("papers please")
  })
  
  
  
  
  
  socket.on('disconnect', (reason) => {
    // Remove the socket ID when a client disconnects
    console.log("user disconnected")
    console.log("reason: ", reason)
    const disconnectedClient = connectedClients.find((client) => client.socket.id === socket.id)
    if(disconnectedClient) delete connectedClients[disconnectedClient.userId];
    console.log("connectedClients: ", Object.keys(connectedClients).length)
    console.log("connectedClients: ", connectedClients)
  });
  
  socket.on('authenticate client socket', token => {
    
    console.log("authenticating client socket")

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
    console.log("friend list request")

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
    console.log("search friend request")
    
    console.log("token: ", token)
    console.log("usernameSeach: ", usernameSearch)

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Sending possible friends list")
      console.log("authenticated.user:", authenticated.user)
      const possibleFriends = await getPossibleFriends(authenticated.user, usernameSearch)
      socket.emit("take possible friends", possibleFriends)
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }


  })
  
  socket.on("add friend", async ({token, friend})=> {
    console.log("add friend request")
    
    console.log("token: ", token)
    const friendId = friend.id
    console.log("friendId: ", friendId)

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Adding friendship")
      console.log("authenticated.user:", authenticated.user)
      const friendshipConfirmation = await addFriend(authenticated.user, friendId)
      console.log(friendshipConfirmation)
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
    console.log("fsac request")

    console.log("token: ", token)
    console.log("userId: ", userId)
    console.log("friendId: ", friendId)

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Adding sending fsac")
      console.log("authenticated.user:", authenticated.user)

      const timespan = Date.now() + 4 * 60 * 60 * 1000 //current unix time + 4 hours

      const fsacConfirmation = await sendFsac(authenticated.user, friendId, timespan)
      console.log(fsacConfirmation)
      if(fsacConfirmation){

        console.log("fsac on database. sending fsac invite confirmation back to client")
        socket.emit("fsac invite successful", {friendId: friendId, timespan: timespan})

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

  socket.on("sent private message", ({token, message}) => {
    console.log("sent private message")
    
    const authenticated = verifyToken(token)


    if(authenticated.success){

      console.log("Trusty socket. sending message")

      
      
        
      
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }


  })

  socket.on("entered private chatroom", ({token, friend}) => {

    console.log("entered private chatroom")
    
    const authenticated = verifyToken(token)

    if(authenticated.success){

      console.log("Trusty socket. sending chatroom messages")
      
      const chatroomId = getChatroomId(authenticated.user, friend)
      
      // if(chatroomId){
        
      // }

      // socket.emit("take messages", )
      
      
        
      
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