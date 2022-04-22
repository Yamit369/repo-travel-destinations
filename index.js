const express = require('express');
const app = express();
const PORT = 8000;
const Travels = require('./dbHelpers');
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const bcrypt = require('bcryptjs') // this for hashing password but remember to install it 

//ROUTE
app.get('/',(req,res)=>{
    res.status(200).json({message:"server running!!!"})
})

app.get('/users',(req,res)=>{

    Travels.getAllUsers()
    .then(users=>{
        res.status(200).json(users) //remember here we need to connect to the data base in order to se the users 
    })
    .catch(error=>{
        res.status(500).json(error)
    })
    
})


app.post('/users/register',(req,res)=>{
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
app.post('/users/login',(req,res)=>{
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
app.get('/users/:username',(req,res)=>{
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

app.delete('/users/:id',(req,res)=>{
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
app.get('/users/:id/destinations',(req,res)=>{
    const {id}=req.params;
    Travels.getUsersDestinations(id)
    .then(destinations=>{
        res.status(200).json(destinations)
    })
    .catch(error=>{
        res.status(500).json({message:"Cannot get that destination"})
    })
})  



//DESTINATIONS ROUTS


//to get the destinations
app.get('/destinations', (req, res)=>{
    Travels.getAllDestinations()
    .then(destinations=>{
        res.status(200).json(destinations)
    })
    .catch(error=>(500).json({message:"Cannot get destinations"}))
})


//to post information or to creat destinations into our data base -- remember that this can not be created by it self it needs its parent.

app.post('/users/:id/destinations',(req, res)=>{
    const {id}=req.params;
    const newDestination = req.body; //this two variables are created in order 
        if(!newDestination.user_id){
            newDestination["user_id"] = parseInt(id,10)  // this is done in order to combine into our object newDestination the id that can be sent through body or params --but since the id the we are receiving is a stream we need to convert it into a integer and tha is the special function 
        }

        //here before sent it to the data base we need to know who is the user that is sent it.
    Travels.findUserById(id)
        .then(user=>{
            if(!user){
                res.status(404).json({message:"User does not exist"})
            }
            if(!newDestination.title || !newDestination.description){
                res.status(400).json({message:"All fields must be completed"})
            }

            Travels.addDestination(newDestination, id)
            .then(destination=>{
                    res.status(200).json(destination)
            })
            .catch(error=>{
                res.status(500).json({message:"server has failed"})
            })
    })
    

})

app.delete("/destinations/:id",(req,res)=>{
    const {id}=req.params;

    Travels.removeDestination(id)
    .then(count =>{
        if(count>0){
            res.status(200).json({message:"Destination is deleted."})
        }else{
            res.status(404).json({message:"No destination with that id"})
        }
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})

app.patch('/destinations/:id',(req,res)=>{
    const {id}=req.params;
    Travels.updateDestination(id,req.body)
    .then(destination=>{
        res.status(200).json({message:"destination updated"})
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})  // the differences between patch and put is that patch updates the part of the data that you one to change, like username, but if you use put it is for the entire object that data base may have


//GROUP OF DESTINATIONS

app.get('/destinationsNumbers',(req,res)=>{
    Travels.groupDestinations()
    .then(destination=>{
        res.status(200).json(destination)
    })
    .catch(error=>{
        res.status(500).json(error)
    })

    
})



//LISTENING METHOD
app.listen(PORT, ()=>{
    console.log(`server running`)
})