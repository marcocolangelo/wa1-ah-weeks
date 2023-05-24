import { Answer } from "./qa";

const APIURL = 'http://localhost:3000/api'

async function listQuestions() {
    try {
        const response = await fetch(APIURL+'/questions');
        if (response.ok) {
            const questions = await response.json();
            return questions ;
        } else {
            // if response is not OK
            const message = await response.text() ;
            throw new Error("Application error: "+message) ;
        }
    } catch (error) {
        throw new Error("Network error: "+error.message)
    }
}

async function listAnswers(questionId) {
    try {
        const response = await fetch(APIURL+`/questions/${questionId}/answers`);
        if (response.ok) {
            const answers = await response.json();
            return answers.map(a => new Answer(a.id, a.text, a.author, a.score, a.date)) ;
        } else {
            // if response is not OK
            const message = await response.text() ;
            throw new Error("Application error: "+message) ;
        }
    } catch (error) {
        throw new Error("Network error: "+error.message)
    }
}

async function deleteAnswer(answerId) {
    try {
        const response = await fetch(APIURL+`/answers/${answerId}`, {
            method:'DELETE'
        });

        if (response.ok) {
            return true ;
        } else {
            // if response is not OK
            const message = await response.text() ;
            throw new Error("Application error: "+message) ;
        }
    } catch (error) {
        throw new Error("Network error: "+error.message)
    }
}

async function upVote(answerId){
    try{
    //use a fetch to increase the vote in the database using a POST
    //this trigger the route in index.js
    const response  = await fetch(APIURL+`/answers/${answerId}/vote`, {
        //second fetch's parameter is an object containing method, headers and body (if needed) of the request
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({"vote":"up"}) //so i can send it as a string from a JSON object
        
    });

    if (response.ok){
        return true;
    } else {
        // if response is not OK because of application errors
        const message = response.text() ;
        throw new Error("Application error: "+ message) ;
    }

    //in case of network errors
    }catch(err){
        throw new Error("Network error:" + err.message);
    }
}

async function addAnswer(date,text,author,idQuestion){
    try{
        //use a fetch to increase the vote in the database using a POST
        //this trigger the route in index.js
        const response  = await fetch(APIURL+`/questions/${idQuestion}/answers`, {
            //second fetch's parameter is an object containing method, headers and body (if needed) of the request
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                "text": text,
                "author": author,
                "date": date //in this web app date is traited as a string
            }) //so i can send it as a string from a JSON object
            
        });
    
        if (response.ok){
            return true;
        } else {
            // if response is not OK because of application errors
            const message = response.text() ;
            throw new Error("Application error: "+ message) ;
        }
    
        //in case of network errors
        }catch(err){
            throw new Error("Network error:" + err.message);
        }
}

export { listQuestions, listAnswers, deleteAnswer, upVote,addAnswer };