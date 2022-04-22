const express = require('express');
const Travels = require('../dbHelpers');
const router = express.Router();








//DESTINATIONS ROUTS


//to get the destinations
router.get('/destinations', (req, res)=>{
    Travels.getAllDestinations()
    .then(destinations=>{
        res.status(200).json(destinations)
    })
    .catch(error=>(500).json({message:"Cannot get destinations"}))
})


//to post information or to creat destinations into our data base -- remember that this can not be created by it self it needs its parent.

router.post('/users/:id/destinations',(req, res)=>{
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

router.delete("/destinations/:id",(req,res)=>{
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

router.patch('/destinations/:id',(req,res)=>{
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

router.get('/destinationsNumbers',(req,res)=>{
    Travels.groupDestinations()
    .then(destination=>{
        res.status(200).json(destination)
    })
    .catch(error=>{
        res.status(500).json(error)
    })

    
})


module.exports =router;