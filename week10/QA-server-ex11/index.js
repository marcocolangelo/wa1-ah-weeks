'use strict' ;

//this will be the server side, the other one belongs to the client  

const express = require('express') ;
const morgan = require('morgan') ;

const dao = require('./qa-dao') ;
const {Question, Answer} = require('./qa') ;

const app = express() ;
app.use(morgan());
app.use(express.json());

app.post('/api/questions', (req,res)=>{
    // console.log(req.body)
    //we have createQuestion from qa_dao.js
    //id in Question is null because it''l not be used anyway
    //because real id will be assigned by the system
    const question = new Question(null, req.body.text, req.body.author, req.body.date) ;
    dao.createQuestion(question).then((result)=>{
        //nothing to tell you if all goes okay
        res.end() ;
    }).catch((error)=>{
        //send an error msg if something goes wrong
        res.status(500).send(error) ;
    })

})


//get the list of all questions with full details
app.get('/api/questions', (req, res)=>{
    //we have the right JS function yet, it's listAnswers(questionId)
    //from qa_dao.js
    dao.listQuestions().then((result)=>{
        //it sends a JSON of the result
        res.json(result) ;
    }).catch((error)=>{
        res.status(500).send(error) ;
    })
})

//get list of all answers to a specific question
app.get('/api/questions/:questionId/answers', (req, res)=>{
    

})

//add a new answer to a specific question
app.post('/api/questions/:questionId/answers', (req, res)=>{

})

//delete a specific answer for a specific question
app.delete('/api/answers/:answerId', (req,res)=>{

})

//update the content od an existing answer
app.put('/api/answers/:answerId', (req,res)=>{

})

//vote an answer
app.put('/api/answers/:answerId/vote', (req,res)=>{

})


app.listen(3000, ()=>{console.log("Server started")}) ;