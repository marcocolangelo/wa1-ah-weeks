import { Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import { TestInput } from "./testInput";

function QuestionWithAnswers(props) {

    //here we handle the hooks inserted before inside the props to manage the several objects state
    const q = props.question;
    const answers = props.answers ;

    if (q) {
        return (<>
            <QuestionDetails author={q.author} text={q.text} />
            <AnswerDetails answers={answers} deleteAnswer={props.deleteAnswer} upVoteAnswer={props.upVoteAnswer} />
        </>)

    } else {
        return <div>"QUESTION UNDEFINED"</div>
    }

}

function QuestionDetails(props) {
    return <div>
        <Row>
            <Col md={8}>
                <p className='lead'>{props.text}</p>
            </Col>
            <Col md={4} className='text-end'>
                Asked by <Badge pill bg='secondary'>{props.author}</Badge>
            </Col>
        </Row>

    </div>
}

function AnswerDetails(props) {

    const [sorted,setSorted] = useState(false);

    //LOCAL COMPUTATION => sorting an array on display is a visualization problem so it's possible to manage it LOCALLY
    //so directly inside the interested component not necessary inside the parent node
    //but here we have a static implementation which doesn't manage possible changes in the properties during the webpage execution
    //so props changing doesn't trigger a NEW RENDER which would make the display change

    //hence we have to implement a little logic to update the STATE with sortByScore function and force the re-rendering of the component
    
    let sortedAnswers = [...props.answer];
    let sortSymbol = "N";

    if (sorted == 'up'){
        sortedAnswers.sort((a,b) => (a.score - b.score));
        sortSymbol = "U";
    }else if (sorted == 'down'){
        sortedAnswers.sort((a,b) => -(a.score - b.score));
        sortSymbol = "D";
    }

    //logic to change the state and re-render the component thanks to hook implementation
    function sortByScore () {
        if (sorted=='none'){
            setSorted('up');
            
        }
        else if (sorted == 'up'){
            setSorted('down');
            
        }
        else if (sorted == 'down'){
            setSorted('none');
            
        }

    }

    //DERIVED STATE - generally a bad idea
    //in this way we take a snapshot of props conditions at this time but so the state doesn't change in case of props changing
/*const [sortedAnswers,setSortedAnswers] = useState(props.answers); 
    function sortByScore () {
    setSortedAnswers((old) => {
        let temp = [...old] 
        temp.sort() 
        return temp})
    }*/

    return <>
        <h2>Answers:</h2>
        <Table hover>
            <thead >
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Text</th>
                    <th scope="col">Author</th>
                    {/*implement sortByScore inside the Score button to force the new state and re-render the component */}
                    <th scope="col" onClick={sortByScore}> Score {sortSymbol}</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {props.answers.map(a => <AnswerRow key={a.id} answer={a} deleteAnswer={props.deleteAnswer} upVoteAnswer={props.upVoteAnswer} />)}
            </tbody>
            <tfoot>
                <NewAnswerForm />

            </tfoot>
        </Table>
        <TestInput/>
    </>
}

function AnswerRow(props) {
    //we add button hook functionalities below
    //the button callback in onClick call the upVoteAnswer wrapper function or the deleteAnswer function 
    //you find these functions in App.jsx
    return <tr>
        <td>{props.answer.date.format('DD/MM/YYYY')}</td>
        <td>{props.answer.text}</td>
        <td>{props.answer.author}</td>
        <td>{props.answer.score}</td>
        <td><Button variant='secondary' onClick={()=>{props.upVoteAnswer(props.answer.id)}}>VOTE</Button>{' '}
        <Button variant='warning' onClick={()=>{props.deleteAnswer(props.answer.id)}}>DELETE</Button></td>
    </tr>
}

function NewAnswerForm(props) {
    return <tr>
        <td><Form.Group controlId="answerDate">
            <Form.Label className='fw-light'>Date</Form.Label>
            <Form.Control type="date" name="date" placeholder="Enter date" />
        </Form.Group></td>

        <td><Form.Group controlId="answerText">
            <Form.Label className='fw-light'>Answer text</Form.Label>
            <Form.Control type="text" name="text" placeholder="Enter Answer" />
        </Form.Group></td>

        <td><Form.Group controlId="answerAuthor">
            <Form.Label className='fw-light'>Author</Form.Label>
            <Form.Control type="text" name="author" placeholder="Author's name" />
        </Form.Group></td>

        <td></td>
        <td><Form.Group controlId="addButton">
        <Form.Label className='fw-light'>&nbsp;</Form.Label><br/>
            <Button variant='success' id="addbutton">ADD</Button>
            </Form.Group>
            </td>
    </tr>;
}

export { QuestionWithAnswers };