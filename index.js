const express = require('express');
const app = express();
const PORT = 8000;
const bodyParser = require('body-parser')
app.use(bodyParser.json())

//IMPORT ROUTE FROM THE ROUTS LOCATION
const usersRouter = require('./routes/user-routes')
const destinationsRouter = require('./routes/destinations-route')

//NOw using the router
app.use('/',usersRouter)  //important wherever you put after the / ex= '/api' in the browser need to be put in order to call the a particular route. 
app.use('/',destinationsRouter) // so it can be use that we write ex= '/users' so on the routes file of user we not need to write it any more 



app.get('/',(req,res)=>{
    res.status(200).json({message:"server running!!!"})
})


//LISTENING METHOD
app.listen(PORT, ()=>{
    console.log(`server running`)
})