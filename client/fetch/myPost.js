const axios = require('axios');
const URL = "http://localhost:3000/"


const myPost = async (endpoint = null , data = null) => {
    try{
        const response = await axios.post(URL + endpoint, data)
        return {success: response.status === 200, data: response.data, }
    }catch(err){
        console.log(err.response.data.message)
        return {success: false, message: err.response.data.message}
    }

}

const getUser = async (username) => {
    return await myPost('user', {username: username})
}

const getUsers = async () => {
    return await myPost('users');
}

const setFsacoso = async (username, fsacoso) => {
    return await myPost('setFsacoso', {username: username, fsacoso: fsacoso})
}   

const getFriends = async (username)=> {
    return await myPost('getFriends', {username: username})
}

module.exports = myPost;




//TESTS

/*
const getFriendsTest = async (username) => {
    console.log("setFsacosoTest")
    console.log("username: ", username)
    const friends = await getFriends(username)
    console.log("friends: ", friends)
}

getFriendsTest("Polaco")

const setFsacosoTest = async (username,fsacoso) => {
    console.log("setFsacosoTest")
    console.log("username: ", username, "fsacoso: ", fsacoso)
    const user = await setFsacoso(username, fsacoso)
    console.log("user:", user)
}

setFsacosoTest("Polaco", false)




const getUserTest = async (username) => {
    console.log("getUserTest")
    console.log("getting ", username)
    const user = await getUser(username)
    console.log("user:", user)
}

(async () => {
    await getUserTest("Polaco")
    await getUserTest("Miguel")
})()
*/
/*

const getUsersTest = async () => {
    console.log("getUsersTest")
    const users = await getUsers()
    console.log("users:", users)
}

getUsersTest()
*/


/*
const myPostTest = async () => {

    console.log("testing myPost")
    console.log("myPost: ", await myPost("login"))
    console.log("should have myPost by now")
}
myPostTest();
*/