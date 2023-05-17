'use strict' ;

const express = require('express') ;
//morgan for logging
const morgan = require('morgan') ;

const app = express() ;
app.use(morgan());

//we have to activate the json decoding ability which 'll allow us to
//extract data from the URL parameters 
app.use(express.json());

//this below is for logging purpose but we can use
//MORGAN middleware just importing it

// const logging = (req,res,next) => {
//     console.log(req.method + ' ' + req.path) ;
//     next() ;
// }

// app.use(logging) ;  -> in this way we shouldn't specify the middleware for every response


//we extract parameters from the URL using req.query.param_name
app.get('/', (req, res) => {
    const lang = req.query.lang ;
    //it's better to check if the param exists with && condition
    if(lang && lang==='IT') {
        res.send('Buongiorno!') ;
    } else {
         res.send('Hello there!') ;
    }
}) ;

//post for adding some data
app.post('/add/:container', (req,res) => {
    const container = req.params.container ;
    console.log('adding to container number '+ container)
    console.log(req.body.id);
    console.log(req.body.name);
    res.end();
});


app.get('/info', (req,res)=>{

    const info = { name: 'xyz', values:[3,6,8]}

    //it converts onjects into JSON and then it returns them
    res.json(info) ;

}) ;


app.listen(3000, ()=>{console.log("Server started")}) ;