const express = require('express');
const bcrypt = require('bcryptjs') // this for hashing password but remember to install it 
const Travels = require('../dbHelpers');
const router = express.Router();






router.get('/users',(req,res)=>{

    Travels.getAllUsers()
    .then(users=>{
        res.status(200).json(users) //remember here we need to connect to the data base in order to se the users 
    })
    .catch(error=>{
        res.status(500).json(error)
    })
    
})


router.post('/users/register',(req,res)=>{
    const credentials = req.body
    const {username, password} = credentials;
    if(!(username && password)){
        return res.status(404).json({message:"User name and password required"})
    }
// the hashing needs to be before the password and the user are sent to the variable, also the number 12 is the common practice of encryption
    const hash = bcrypt.hashSync(credentials.password,12)
    credentials.password=hash;

    Travels.addUser(credentials)
    .then(user =>{
        res.status(200).json(user)
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})

//here is in order to check that password that is giving and the password that is stored is the same. 
router.post('/users/login',(req,res)=>{
    const {username,password} = req.body;
    Travels.finUserByUserName(username,password)
    .then(user=>{
        if(user && bcrypt.compareSync(password,user.password)){
            res.status(200).json(user)
        }else{
            res.status(404).json({message:"User does not exist"})
        }
    })
    .catch(error=>{
        res.status(500).json(error)
    })
}) 



//remember all end-points are the server that is like the carrier man who brings to and brings back from user to database and contrary
router.get('/users/:username',(req,res)=>{
    const {username}=req.params
    Travels.finUserByUserName(username)
    .then(user=>{
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({message:"User does not exist"})
        }
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})// important to mention that here the catch is when our server fails not to sent responses to fronted from the data base since the catch does not see to it


//deleting the user 

router.delete('/users/:id',(req,res)=>{
    const {id}=req.params
    Travels.removeUser(id)
    .then(count =>{
        if(count>0){
            res.status(200).json({message:"user is deleted."})
        }else{
            res.status(404).json({message:"No user with that id"})
        }
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})
//the path or route can be the same but the method is different for one is post the other one is get
router.get('/users/:id/destinations',(req,res)=>{
    const {id}=req.params;
    Travels.getUsersDestinations(id)
    .then(destinations=>{
        res.status(200).json(destinations)
    })
    .catch(error=>{
        res.status(500).json({message:"Cannot get that destination"})
    })
})  

module.exports =router;