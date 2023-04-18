import { QuestionWithAnswers } from "./Components";
import { Question, Answer } from "./qa";
import { Container, Navbar } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";

// FAKE DATA
const myquestion = new Question(1, 'Is JavaScript better than Python?', 'Luigi De Russis', '2023-01-01');
myquestion.add(new Answer(1, 'Yes', 'Luca Mannella', -10, '2023-02-15'));
myquestion.add(new Answer(2, 'Both have their pros and cons', 'Mario Rossi', 0, '2023-03-04'));


function App() {

  //we add React Hooks to manage question and answers state, initializing it with an object (here it's because of {} inside)
  // composed by myquestion attributes 

  //we must put hooks at the top level of the function before the other components
  //is because in this way we can be sure about the order we initialize them with
  // so we are sure not to insert them inside loop or if conditions too

  const [question, setQuestion] = useState({ id: myquestion.id, text: myquestion.text, author: myquestion.author, date: myquestion.date });
  const [answers, setAnswers] = useState([...myquestion.answers]);

  const deleteAnswer = (id) => {
    //here we use the answers state to manage the table in the app

    //const newAnswers = answers.filter((ans) => (ans.id !== id)) is a dangerous function because we use and update a value at the same time
    //this could bring to wrong value applications because of the async nature of the hooks
    //use a callback inside setAnswers instead  
    setAnswers((oldAnswers) => (oldAnswers.filter((ans) => (ans.id !== id))));
  }

  const upVoteAnswer = (id) => {
    //we have to re render the answers mapping them inside the table
    //so we ask to bring all the old answers inside the table like just they were before except for the chosen one
    //which is the same than before but with VOTE increased of 1
    console.log('Upvoting answer ' + id);
    setAnswers((oldAnswers) => (
      oldAnswers.map((ans) => (
        ans.id === id ? new Answer(ans.id, ans.text, ans.author, ans.score + 1, ans.date) : ans
      ))
    ));
  }

  const addAnswer = (date, text, author) => {
    // TODO: test/debug
    
    setAnswers((oldAnswers) => {
      const newId = Math.max(...oldAnswers.map(a => a.id)) + 1;
      const newAns = new Answer(newId, text, author, 0, date);
      return [...oldAnswers, newAns];
    });

  }

  // alternative: group all callback functions in one object, to minimize the number of props to pass
  const actions = { deleteAnswer: deleteAnswer, upVoteAnswer: upVoteAnswer }

  //we add the hook state function management in QuestionWithANswers below

  return <>
    <header>
      <Navbar sticky="top" variant='dark' bg="primary" expand="lg" className='mb-3'>
        <Container>
          <Navbar.Brand>HeapOverrun - Question 1</Navbar.Brand>
          <Navbar.Text>
            Signed in as: Tom
          </Navbar.Text>
        </Container>
      </Navbar>
    </header>
    <main>
      <Container>
        <QuestionWithAnswers question={question} answers={answers}
          deleteAnswer={deleteAnswer} upVoteAnswer={upVoteAnswer} />
      </Container>
    </main>
  </>

}

export default App
