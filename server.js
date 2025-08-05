const express     =   require('express');
const app         =   express();

const http        =   require('http');
const server      =   http.createServer(app);
const { Server }  =   require("socket.io");
const io          =   new Server(server);


require('./socket.js')(io);
const {activatePosts} = require('./posts.js')

const updateExpiredFsacs = require('./queries/updateExpiredFsacs.js')
const getFirstExpiringFsac = require('./queries/getFirstExpiringFsac.js')
const cronJobExpireNextFsac = require('./logic/cronJobExpireNextFsac.js')





app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});




/*SOCKET*/ 







/*activate posts*/
activatePosts(app, io)

//updateExpiredFsacs()
//cronJobExpireNextFsac()






/*SERVER LISTEN*/
server.listen(3000, () => {
  console.log('\nlistening on *:3000');
});

module.exports = {app, io}