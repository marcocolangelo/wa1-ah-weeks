import { useNavigate, useParams } from "react-router-dom";
import { AddOrEditAnswer } from "./AnswerForm";

function EditAnswer(props) {
    //navigate is useful to jumpt straight to a specific path
    const navigate = useNavigate() ;
    const { idQuestion, idAnswer } = useParams() ;

    const handleCancel = () => {
        //this is the way to create a path using mutable parameters
        navigate(`/answers/${idQuestion}`)
    }

    const handleSave = (id, date, text, author) => {
        props.editAnswer(id, date, text, author, idQuestion)
        navigate(`/answers/${idQuestion}`)
    }

    const editedAnswer = props.answers.filter((a)=>(a.id == idAnswer))[0] ;

    return <AddOrEditAnswer mode='edit' handleCancel={handleCancel} handleSave={handleSave} initialValue={editedAnswer}/>

}

export { EditAnswer };