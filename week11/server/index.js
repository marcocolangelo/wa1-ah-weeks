'use strict';

const PORT = 3000 ;

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dao = require('./qa-dao');
const { Question, Answer } = require('./qa');

//it allows me to add a delay which force React to wait for the fetch response from the server about the answerList
//it fixs the problem which gave me errors when I asked for a specific answer putting its ID in the URI
function delay(req,res,next){
    //remember to set the callback so don't call next() directly
    setTimeout(()=> next(),1000);
}


const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());
app.use(delay); //add an extra latency (REMOVE ME LATER!)

app.post('/api/questions', (req, res) => {
    // console.log(req.body)
    const question = new Question(null, req.body.text, req.body.author, req.body.date);
    dao.createQuestion(question).then((result) => {
        res.end();
    }).catch((error) => {
        res.status(500).send(error.message);
    })
})

app.get('/api/questions', (req, res) => {
    dao.listQuestions().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    })
})

app.get('/api/questions/:questionId/answers', async (req, res) => {
    const questionId = req.params.questionId;

    try {
        const answers = await dao.listAnswers(questionId);
        res.json(answers);
    } catch (error) {
        res.status(500).send(error.message)
    }
})


app.post('/api/questions/:questionId/answers', async (req, res) => {
    const questionId = req.params.questionId;

    const bodyanswer = req.body;
    const answer = new Answer(undefined, bodyanswer.text, bodyanswer.author, undefined, bodyanswer.date, questionId);

    try {
        await dao.createAnswer(questionId, answer);
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.delete('/api/answers/:answerId', async (req, res) => {
    const answerId = req.params.answerId ;

    try {
        await dao.deleteAnswer(answerId) ;
        res.end() ;
    } catch(error) {
        res.status(500).send(error.message);
    }

})

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

app.post('/api/answers/:answerId/vote', async (req, res) => {
    const answerId = req.params.answerId ;

    const vote = req.body.vote ;

    //it receives the string from a POST HTTP msg wich contains the a body with this state inside (see in API upVote) 
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