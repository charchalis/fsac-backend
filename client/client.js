const fetch = require("node-fetch");
const myPost = require('./fetch/myPost.js')
const URL = "http://localhost:3000/"
const { io } = require("socket.io-client");

let socket;

const login = async (username, password) => {
    return await myPost('login', {username: username, password: password})
}

const createAccount = async(username, password, firstName, lastName, profilePicture) => {
    return await myPost('createAccount', {username: username, password: password, firstName: firstName, lastName: lastName, imagePath: profilePicture})
}

const connectToSocketIO = () => {
    console.log("connecting to socket")
    socket = io(URL)
    
    socket.on('spam', ({data}) => {
        console.log(data)
    })
} 

// Access the protected route using the JWT token
const accessProtectedRoute = async (token) => {
    
    try{
        // Make a GET request to the protected route
        const response = await fetch(URL + 'authenticate', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        //console.log('Protected route response:', data);
        console.log(response.status)
    
        const data = await response.json()
        console.log("data: ", data)    
        const userId = data.user
        console.log("userId: ", userId)    
        return userId
    }catch{error => console.error('Access to protected route failed:', error)};
    
    return;
}

/*
const createAccountTest = async (username, password, firstName, lastName, profilePicture) => {
    console.log("createAccountTest")
    console.log("username: ", username, "password: ", password)
    console.log("firstName: ", firstName, "lastName: ", lastName, "profilePicture: ", profilePicture)
    const success = await createAccount(username, password, firstName, lastName, profilePicture)
    console.log("success: ", success)
    if(success.success){
        const loginSuccess = await login(username, password)
        console.log(loginSuccess)
        if(loginSuccess) connectToSocketIO()
    } 

}

createAccountTest('ze', 'ze123', 'jose', 'mantorras', 'profilePicture');
*/



const loginTest = async (username, password) => {
    console.log("loginTest")
    console.log("username: ", username, "password: ", password)
    const authenticated = await login(username, password)
    console.log("authenticated: ", authenticated)
    if(authenticated.success){
        const authenticated2 = await accessProtectedRoute(authenticated.data.token)
        console.log(authenticated2)
        if(authenticated2){
            connectToSocketIO()

        }
    }
}

loginTest('Polaco', 'password123')
