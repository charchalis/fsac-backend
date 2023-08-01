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

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


const connectedClients = []

/*SOCKET*/ 

io.on("connection", (socket, token) => {
  console.log("user connected")
  console.log("papers please")
  //console.log(socket)

  socket.emit("papers please")
  
  
  
  
  socket.on('disconnect', () => {
    // Remove the socket ID when a client disconnects
    console.log("user disconnected")
    delete connectedClients[socket.id];
  console.log("connectedClients: ", Object.keys(connectedClients).length)
  });
  
  socket.on('authenticate client socket', token => {
    
    console.log("authenticating client socket")

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Proceeding")
      connectedClients[socket.id] = {userId: authenticated.user, socket: socket}
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
  
  socket.on("add friend", async ({token, friendId})=> {
    console.log("add friend request")
    
    console.log("token: ", token)
    console.log("friendId: ", friendId)

    const authenticated = verifyToken(token) 

    if(authenticated.success){
      console.log("Trusty socket. Adding friendship")
      console.log("authenticated.user:", authenticated.user)
      const friendshipConfirmation = await addFriend(authenticated.user, friendId)
      console.log(friendshipConfirmation)
      if(friendshipConfirmation){
        socket.emit("new friend", friendId)
      }
    }else{
      console.log("Untrusty socket. Disconnecting it")
      socket.emit("untrusty socket")
      socket.disconnect()
    }


  })

})





/*activate posts*/
activatePosts(app)







/*SERVER LISTEN*/
server.listen(3000, () => {
  console.log('listening on *:3000');
});