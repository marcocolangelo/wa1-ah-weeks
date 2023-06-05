'use strict';

const PORT = 3000;

const express = require('express');

// middleware modules
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

// passport
const passport = require('passport');
const LocalStrategy = require('passport-local');

// import Dao and Data Model
const dao = require('./qa-dao');
//used to access to users' data during authentication
const userdao = require('./user-dao');
const { Question, Answer } = require('./qa');

// Create App
const app = express();

// Configure and register middlewares

/*morgan è un logger di richieste HTTP per Node.js. In questo caso, morgan è configurato con l’opzione 'combined', 
che indica che il logger utilizzerà il formato di log combinato Apache predefinito 
per registrare le informazioni sulle richieste HTTP in arrivo.*/ 
app.use(morgan('combined'));

app.use(express.json());

/*con CORS solo le richieste provenienti dall’origine http://localhost:5173 sono autorizzate ad accedere alle risorse del server. 
Inoltre, l’opzione credentials: true indica che i cookie e le credenziali di autenticazione HTTP 
possono essere inviati insieme alla richiesta.*/
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// see: https://expressjs.com/en/resources/middleware/session.html
app.use(session({
    //secret is used to generate the cookie
    //resalve:false means that the sessions shouldn't be resaved again in the datastore if has not been modified during the request
    //saveUninitialized: false means that the sessions shouldn't be saved in the datastore if it has not been initialized
    secret: 'xxxxyyyyzzz', resave: false, saveUninitialized: false
}));

// Configure and register Passport

passport.use(new LocalStrategy((username, password, callback) => {
    // verify function
    userdao.getUser(username, password).then((user) => {
        callback(null, user);
    }).catch((err) => {
        callback(null, false, err)
    });
}));

passport.serializeUser((user, callback) => {
    callback(null, { id: user.id, email: user.email, name: user.name });
});
passport.deserializeUser((user, callback) => {
    callback(null, user);
});

app.use(passport.authenticate('session'));

// Custom middleware: artificial delay
function delay(req, res, next) {
    setTimeout(() => { next() }, 1000);
}
// app.use(delay) ; // if you want to add an extra latency (ONLY FOR DEBUG!!)


// Custom middleware: check login status
const isLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(500).send("NOT AUTHENTICATED - GO AWAY");
    }
}

/******* LOGIN - LOGOUT OPERATIONS *******/

// POST /api/login
app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
    req.logout(()=>{res.end()});
})

// POST /api/testlogin
/* Used only to illustrate how the 'real' /api/login works
app.post('/api/testlogin', async (req,res) => {
    const username = req.body.username ;
    const password = req.body.password ;
    try {
        const user = await userdao.getUser(username, password) ;
        res.json(user) ;
    }catch(error) {
        res.status(500).send(error.message) ;
    }
}) ;
*/

/******* PUBLIC APIs (NO AUTHENTICATION) *******/

// GET /api/questions
// List all questions
app.get('/api/questions', (req, res) => {
    dao.listQuestions().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

// GET /api/questions/:questionId/answers
// List all answers to a specific question
app.get('/api/questions/:questionId/answers', async (req, res) => {
    const questionId = req.params.questionId;

    try {
        const answers = await dao.listAnswers(questionId);
        res.json(answers);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


/******* PRIVATE APIs (REQUIRE AUTHENTICATION) *******/

app.use(isLogged);  // middleware installed for the APIs below this line

// POST /api/questions
// Create a new question
app.post('/api/questions', (req, res) => {
    const question = new Question(null, req.body.text, req.body.author, req.body.date);
    dao.createQuestion(question).then((result) => {
        res.end();
    }).catch((error) => {
        res.set('Content-Type: text/plain')
        res.status(500).send(error.message);
    });
});



// POST /api/questions/:questionId/answers
// Create a new answer to a specific question
// Returns the ID of the new answer (simple text in the body)
app.post('/api/questions/:questionId/answers', async (req, res) => {
    const questionId = req.params.questionId;

    const bodyanswer = req.body;
    const answer = new Answer(undefined, bodyanswer.text, bodyanswer.author, undefined, bodyanswer.date, questionId);

    try {
        let id = await dao.createAnswer(questionId, answer);
        console.log(id);
        res.send(String(id));
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// DELETE /api/answers/:answerId
// Delete a specific answer
app.delete('/api/answers/:answerId', async (req, res) => {
    const answerId = req.params.answerId;

    try {
        await dao.deleteAnswer(answerId);
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// PUT /api/answers/:answerId
// Replace an existing answer with new values (score is forced to 0, id is unchanged)
app.put('/api/answers/:answerId', async (req, res) => {
    const answerId = req.params.answerId;

    const bodyanswer = req.body;

    // The answer ID is unchanged
    // The answer score is reset to ZERO
    const answer = new Answer(answerId, bodyanswer.text, bodyanswer.author, 0, bodyanswer.date);  // questionId is undefined

    try {
        await dao.updateAnswer(answerId, answer);
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST /api/answers/:answerId/vote
// Increase (+1) the score of an answer
app.post('/api/answers/:answerId/vote', isLogged, async (req, res) => {
    const answerId = req.params.answerId;

    const vote = req.body.vote;

    if (vote === "up") {
        await dao.upVoteAnswer(answerId);
        const my_ans = await dao.readAnswer(answerId);

        res.json({ score: my_ans });
    } else {
        res.status(403).send("Invalid command");
    }
});


/******* APPLICATION STARTUP *******/

app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });