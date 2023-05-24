import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AddOrEditAnswer } from "./AnswerForm";
import { Answer } from "./qa";

function EditAnswer(props) {
    const navigate = useNavigate() ;
    const { idQuestion, idAnswer } = useParams() ;

    const handleCancel = () => {
        navigate(`/answers/${idQuestion}`)
    }

    const location = useLocation();
    
    //so now we don't use hook to save edit state anymore
    let editedAnswer = undefined;
    if(location.state){
        editedAnswer = location.state;
        editedAnswer = new Answer(editedAnswer.id,editedAnswer.text,editedAnswer.author,editedAnswer.score,editedAnswer.date);    
    }

    console.log(editedAnswer);

    const handleSave = (id, date, text, author) => {
        //call the API!!!
        navigate(`/answers/${idQuestion}`)
    }

    //const editedAnswer = props.answers.filter((a)=>(a.id == idAnswer))[0] ;

    return <AddOrEditAnswer mode='edit' handleCancel={handleCancel} handleSave={handleSave} initialValue={editedAnswer}/>

}

export { EditAnswer };