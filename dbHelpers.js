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
    return db('users')
}

function finUserByUserName (username){
    return db('users').where({username:username}).first();
}

//function of getting user by id
function findUserById (id){
    return db('users').where({id:id}).first();
}

//function for removing user
function removeUser (id){
    return db('users')
    .where({id:id})
    .del()
}

//DESTINATION FUNCTIONS
function getAllDestinations () {
    return db('destinations')
}

async function addDestination (newDestination, user_id) {
    await db("destinations")
    .where({user_id:user_id})
    .insert(newDestination)
    // return db('destinations')
}



module.exports ={
    addUser,
    getAllUsers,
    finUserByUserName,
    findUserById,
    removeUser,
    getAllDestinations,
    addDestination

}