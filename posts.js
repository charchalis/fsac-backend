const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const fs          =   require('fs');
const multer      =   require('multer');
const upload      =   multer({dest: 'images/'});

const {JWT_SECRET_KEY} = require('./constants.js')

const getQueryResult = require('./logic/getQueryResult.js')
const hashPassword = require('./logic/hashPassword.js')
const verifyToken = require('./logic/verifyToken.js')


const activatePosts = (app) => {






/*AUTHENTICATION*/





app.post('/createAccount', upload.single('fileData'), async (req, res) => {

  console.log("createAccount request");

  console.log(req.file);//this will be automatically set by multer
  console.log(req.body)
  const { username, password, firstName, lastName} = req.body;
  
  const imagePath = req.file.filename

  console.log(imagePath)
  
  const invalidUsername = (await getQueryResult('select * from user where username = ?', [username])).length > 0 
  
  if(invalidUsername) return res.status(404).json({ message: 'username taken' });
  
  const hashedPassword = await hashPassword(password);
  
  try{
    await getQueryResult('insert into user values (?, ?, ?, ?, ?, ?)',
    [username, username, hashedPassword, firstName, lastName, imagePath])
  }catch(err){
    return res.status(404).json({ message: 'error inserting user to database' });
  }

  const token = jwt.sign({ userId: username}, JWT_SECRET_KEY );
  return res.status(200).send({message: 'account created successfully', token: token})

})

  




app.post('/login', async (req, res) => {
  console.log("login request");

  const { username, password } = req.body;
  
  const [user] = await getQueryResult('select id, username, password from user where username = ?', [username])
  

  console.log("user: ", user)

  if(!user) {
    return res.status(404).json({ message: 'User not found' });
  }

    // Compare the entered password with the stored hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ message: 'Authentication failed' });
    }


    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY );
    
    console.log("token: ", token)

    // Return the token to the client
    res.json({ token });
  
    console.log("token sent to client")
  })
})






app.get('/authenticate', async (req, res) => {
  const token = req.headers.authorization;
  
  const authenticated = verifyToken(token)
  
  console.log(authenticated)
  if(!authenticated.success) { res.status(401).json(authenticated); return }

  const [authenticated2] = await getQueryResult('select count(id) as authenticated from user where id=?', [authenticated.user])
  console.log("authenticated2: ", authenticated2['authenticated'])
  
  if(authenticated2['authenticated']){
    const [user] = await getQueryResult('select id, username, firstName, lastName from user where id = ?', [authenticated.user])
    res.status(200).json({success: true,  message: 'Protected route accessed successfullyaaa', user: user });
  }else res.status(401).json({success: false,  message: 'Authentication failed'});

  // Access granted, return a response
  res.end()
});












app.post('/users', async (req, res) => {
    console.log("getUsers request");
    console.log(req.body)
    
    const users = await getUsers()
    console.log("should have users by now")
    
    res.status(200).send(users)
    res.end()

})

app.post('/user', async (req, res) => {
    console.log("getUser Request")
  
    const username = req.body.username
    
    const user = await getUser(username)
    console.log("should have user by now")
    
    res.status(200).send(user)
    res.end()

})

app.post('/setFsacoso', async (req, res) => {
    console.log("setFsacoso Request")
  
    const username = req.body.username
    const fsacoso = req.body.fsacoso

    const user = await setFsacoso(username, fsacoso)
    console.log("should have set fsacoso by now")
    
    res.status(200).send(user)
    res.end()
})

app.post('/getFriends', async (req, res) => {
  console.log("getFriends Request")

  const username = req.body.username

  const friends = await getFriends(username)
  console.log("should have friend list by now")
  
  res.status(200).send(friends)
  res.end()
})



}

module.exports= {activatePosts}

//anything after this line shouldnt be here






const getFriends = async (username) => {
    return await getQueryResult(
      'select user1_id as user_id from friendship where user2_id = ? UNION select user2_id from friendship where user1_id = ?'
    ,[username, username]);

}

const setFsacoso = async (username, fsacoso) => {
    return await getQueryResult("update user set fsacoso = ? where username = ?", [fsacoso ? 1 : 0, username])
}


const getUsers = async () => {
    return await getQueryResult("select * from user")
}

const getUser = async (username) => {
  return await getQueryResult("select * from user where username = ?", [username])
}

