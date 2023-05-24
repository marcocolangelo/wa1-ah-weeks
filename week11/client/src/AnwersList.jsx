import { Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Badge, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { deleteAnswer, listAnswers, upVote} from "./API";

function AnswersList(props) {
    const { idQuestion } = useParams();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState([]) ;

    //hook to handle slow HTTP requests (to avoid multiple vote requests)
    const [waiting,setWaiting] = useState(true);

    useEffect(()=>{
        listAnswers(idQuestion).then(list=>{
            setAnswers(list);
            setWaiting(true);
        })
    },[idQuestion])

    useEffect(()=>{
        listAnswers(idQuestion).then(list=>{
            setAnswers(list);
            setWaiting(false);
        })
    }, []);


    const myQuestion = props.questions.filter((q)=>(q.id == idQuestion))[0];

    

    const handleClose = () => {
        navigate('/');
    };

    const handleDelete =  async (id) =>  {
        setWaiting(true);
        await deleteAnswer(id) ;

        const list = await listAnswers(idQuestion); //in this way we request the list of answers asking for the just updated list from the server
        setAnswers(list);
        setWaiting(false);
        // IN SOME WAY, WE MUST UPDATE THE LOCAL STATE, TOO... (coming soon)
    };

    const handleEdit = (id) => {
        let myAnswer = answers.filter(a=>a.id==id)[0];
        myAnswer = {...myAnswer,date:myAnswer.date.toISOString()};
        //i can use a second parameter to save a state
        navigate(`/editAnswer/${idQuestion}/${id}` , {state : myAnswer} ) ;
    }

    const handleVote = async (id) => {
        //now just call the API for increasing the vote because of the new HTTP implementation needed

        //update the value shown in the componente
        try{
            setWaiting(true);
            

            setAnswers((old) => old.map(a => (a.id == id ? {...a,score:a.score+1} : a)));

            const result = await upVote(id);
            
            //be careful : without this command below you update the db (with the command above) but the result it's still not shown in the frontend!!!
            const list = await listAnswers(idQuestion); //in this way we request the list of answers asking for the just updated list from the server
            setAnswers(list);
            setWaiting(false);
        }catch(err){
            //in case of application errors
            console.log(err);
            //TODO : put some error message in the page (add a state with err msg)
            setWaiting(false);
        }

        
    }

    const handleAdd = () => {
        navigate(`/addAnswer/${idQuestion}`) ;
    }

    return <div>
       <QuestionDetails question={myQuestion}/>
       <AnswerDetails answers={answers} deleteAnswer={handleDelete} upVoteAnswer={handleVote} handleEdit={handleEdit} waiting={waiting} />

        <p><Button onClick={handleAdd}>ADD</Button> <Button onClick={handleClose}>CLOSE</Button></p>
    </div>
}

function QuestionDetails(props) {
    return <div>
        <Row>
            <Col md={8}>
                <p className='lead'>{ /*we wait for a fetch response which make question not empty anymore*/props.question ? props.question.text : "Loading..."}</p>
            </Col>
            <Col md={4} className='text-end'>
                Asked by <Badge pill bg='secondary'>{props.question ? props.question.author : "Loading..."}</Badge>
            </Col>
        </Row>

    </div>
}

function AnswerDetails(props) {

    const [sorted, setSorted] = useState('none');

    // LOCAL COMPUTATION
    let sortedAnswers = [...props.answers]
    let sortIcon = '↕'
    if (sorted === 'up') {
        sortedAnswers.sort((a, b) => (a.score - b.score));
        sortIcon = '↑'
    } else if (sorted === 'down') {
        sortedAnswers.sort((a, b) => -(a.score - b.score));
        sortIcon = '↓'
    }


    function sortByScore() {
        if (sorted === 'none')
            setSorted('up')
        else if (sorted === 'up')
            setSorted('down')
        else if (sorted === 'down')
            setSorted('none')
    }

    return <>
        <h2>Answers:</h2>
        <Table hover>
            <thead >
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Text</th>
                    <th scope="col">Author</th>
                    <th scope="col" onClick={sortByScore}>Score {sortIcon}</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {sortedAnswers.map(a => <AnswerRow key={a.id} answer={a} deleteAnswer={props.deleteAnswer} upVoteAnswer={props.upVoteAnswer} handleEdit={props.handleEdit} 
                waiting={props.waiting}/>)}
            </tbody>
        </Table>
    </>
}

function AnswerRow(props) {
    return <tr>
        <td>{props.answer.date.format('DD/MM/YYYY')}</td>
        <td>{props.answer.text}</td>
        <td>{props.answer.author}</td>
        <td>{props.answer.score}</td>
        <td><Button /*to disble the button during waiting state*/ disabled={props.waiting} variant='secondary' onClick={() => { props.upVoteAnswer(props.answer.id) }}>VOTE</Button>{' '}
            <Button disabled={props.waiting} variant='warning' onClick={() => { props.deleteAnswer(props.answer.id) }}>DELETE</Button>{' '}
            <Button disabled={props.waiting} variant='success' onClick={() => { props.handleEdit(props.answer.id) }}>EDIT</Button>
        </td>
    </tr>
}


export { AnswersList };