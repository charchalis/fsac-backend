
/*----------IMPORTS----------*/

const express     =   require('express');
const app         =   express();

const http        =   require('http');
const server      =   http.createServer(app);
const { Server }  =   require("socket.io");
const io          =   new Server(server);

require('./socket.js')(io);  //socket related stuff
const {activatePosts} = require('./posts.js') //endpoint stuff

const updateExpiredFsacs = require('./queries/updateExpiredFsacs.js')
const getFirstExpiringFsac = require('./queries/getFirstExpiringFsac.js')
const cronJobExpireNextFsac = require('./logic/cronJobExpireNextFsac.js')



/*----------MAIN----------*/

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



/*activate posts*/
activatePosts(app, io)


//updateExpiredFsacs()
//cronJobExpireNextFsac()


/*SERVER LISTEN*/
server.listen(3000, () => {
  console.log('\nlistening on *:3000');
});

module.exports = {app, io}