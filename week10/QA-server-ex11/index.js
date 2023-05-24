'use strict';

const PORT = 3000 ;

//this will be the server side, the other one belongs to the client  

const express = require('express') ;
const morgan = require('morgan') ;

const dao = require('./qa-dao') ;
const {Question, Answer} = require('./qa') ;

const app = express();
app.use(morgan('combined'));
app.use(express.json());

app.post('/api/questions', (req, res) => {
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
app.get('/api/questions/:questionId/answers', async (req, res) => {
    const questionId = req.params.questionId;
    
    try {
        const answers = await dao.listAnswers(questionId);
        res.json(answers);
    } catch (error) {
        res.status(500).send(error.message)
    }

})

//add a new answer to a specific question
app.post('/api/questions/:questionId/answers', async (req, res) => {
    const questionId = req.params.questionId;

    //we need to know what to insert into the answer to add in the db
    //so we take all the infos from the request's body
    const bodyanswer = req.body;
    const answer = new Answer(undefined, bodyanswer.text, bodyanswer.author, undefined, bodyanswer.date, questionId);

    try {
        await dao.createAnswer(questionId, answer);
        //no informations to be sent in response are needed (just okay or not)
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
})

//delete a specific answer for a specific question
app.delete('/api/answers/:answerId', async (req, res) => {
    const answerId = req.params.answerId ;

    try {
        await dao.deleteAnswer(answerId) ;
        res.end() ;
    } catch(error) {
        res.status(500).send(error.message);
    }

})

//update the content of an existing answer
app.put('/api/answers/:answerId', async (req, res) => {
    const answerId = req.params.answerId;

    const bodyanswer = req.body;

    // The answer ID is unchanged
    // The answer score is reset to ZERO
    const answer = new Answer(answerId, bodyanswer.text, bodyanswer.author, 0, bodyanswer.date);  // questionId is undefined

    try {
        await dao.updateAnswer(answerId, answer) ;
        res.end();
    } catch(error) {
        res.status(500).send(error.message);
    }

})

//vote an answer
app.post('/api/answers/:answerId/vote', async (req, res) => {
    const answerId = req.params.answerId ;

    const vote = req.body.vote ;

    if(vote==="up") {
        await dao.upVoteAnswer(answerId) ;
        const my_ans = await dao.readAnswer(answerId) ;

        res.json({score: my_ans}) ;
    } else {
        res.status(403).send("Invalid command") ;
    }

})


app.listen(PORT, 
    () => { console.log(`Server started on http://localhost:${PORT}/`) });