const knex = require('knex');
const config = require('./knexfile')
const db = knex(config.development);



//USER
//function for creating the user 
async function addUser(user){
 await db('users').insert(user)  
  return db('users').where({username:user.username})//way to get back the info on the registration process
} // async and await work together since this is in order that program will wait until this process is over before moving. 

//for every end point we need to creat a user
function getAllUsers(){
    return db('users').orderBy('id','desc')
}

function finUserByUserName (username) {
    return db('users').where({username:username}).first();
}

//function of getting user by id
function findUserById (id) {
    return db('users').where({id:id}).first();
}

//function for removing user
function removeUser (id) {
    return db('users')
    .where({id:id})
    .del()
}

function getUsersDestinations (user_id) {
return db("users")
.join("destinations","users.id","destinations.user_id")
.select(
    "users.id as UserId",
    "users.imageUrl as UserImage",
    "destinations.id as DestinationId",
    "destinations.title as DestinationTitle"
)
    .where({user_id:user_id})
}

//DESTINATION FUNCTIONS
function getAllDestinations () {
    return db('destinations').orderBy('id','desc')
}

async function addDestination (newDestination,user_id) {
    await db("destinations")
    .where({user_id:user_id})
    .insert(newDestination,["id"])
}

function removeDestination (id) {
return db("destinations")
.where({id:id})
.del()
}

function updateDestination (id,newDestination) {
return db("destinations")
.where({id:id})
.update(newDestination)
}

function groupDestinations () {
    return db("destinations")
    .groupBy("title")
    .select(
        "destinations.id",
        "destinations.title"
    )
}




module.exports ={
    addUser,
    getAllUsers,
    finUserByUserName,
    findUserById,
    removeUser,
    getAllDestinations,
    addDestination,
    removeDestination,
    updateDestination,
    getUsersDestinations,
    groupDestinations

}