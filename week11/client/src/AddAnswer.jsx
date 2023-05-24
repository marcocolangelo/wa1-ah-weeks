import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AddOrEditAnswer } from "./AnswerForm";
import { addAnswer } from "./API";

function AddAnswer(props) {

    const {idQuestion} = useParams() ;
    const navigate = useNavigate() ;

    const handleCancel = () => {
        navigate(`/answers/${idQuestion}`);
    }

    const handleAdd = async (date,text,author) => {
        //will be something like
        /*POST {{APIURL}}/questions
        Content-Type: application/json
        
        { 
            "text": "who won Eurovision?",
            "author": "music fan",
            "date": "2023-05-15"
        }*/
        
        await addAnswer(date,text,author,idQuestion);
       
        navigate(`/answers/${idQuestion}`);
    }

    return <div>
        <p>ADD A NEW ANSWER FOR QUESTION {idQuestion}</p>
        <AddOrEditAnswer mode='add' handleCancel={handleCancel} handleAdd={handleAdd}/>
    </div>

}

export {AddAnswer} ;