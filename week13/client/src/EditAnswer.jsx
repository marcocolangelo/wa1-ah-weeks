import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AddOrEditAnswer } from "./AnswerForm";
import { Answer } from "./qa";
import { updateAnswer } from "./API";

function EditAnswer(props) {
    const navigate = useNavigate() ;
    const { idQuestion, idAnswer } = useParams() ;

    const location = useLocation() ;

    let editedAnswer = undefined ;
    if(location.state) {
        editedAnswer = location.state ;
        editedAnswer = new Answer(editedAnswer.id, editedAnswer.text, editedAnswer.author, editedAnswer.score, editedAnswer.date) ;
    }

    const handleCancel = () => {
        navigate(`/answers/${idQuestion}`)
    }

    const handleSave = async (id, date, text, author) => {
        await updateAnswer(date,text,author,id) ;
        navigate(`/answers/${idQuestion}`)
    }

    return <AddOrEditAnswer mode='edit' handleCancel={handleCancel} handleSave={handleSave} initialValue={editedAnswer}/>

}

export { EditAnswer };