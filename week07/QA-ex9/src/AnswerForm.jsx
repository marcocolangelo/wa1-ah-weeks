import dayjs from 'dayjs';
import { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function AddOrEditAnswer(props) {

    //hooks to manage the answer's date,text and author states
    //remember to initialize the defualt value inside hooks or this will be defined and the object will consider as UNCONTROLLED
    //(in contrapposition to CONTROLLED REACT OBJECTS )

    //we initialized the form with a initialValue passed by the parent thorugh props
    //this allow us to save uncommitted changes inside the interface
   
   //conditional initialization to take info from the yet present answer in case we would edit them
   //so the edit interface will filled by the actual info 
    const [date, setDate] = useState(
        props.mode==='edit' ? props.initialValue.date.format('YYYY-MM-DD') :
        dayjs().format('YYYY-MM-DD')) ;
    const [text, setText] = useState(
        props.mode==='edit' ? props.initialValue.text : '') ;
    const [author, setAuthor] = useState(
        props.mode==='edit' ? props.initialValue.author :'') ;

    //here an error managing too using hooks
    const [err, setErr] = useState('')

    //the AnswerForm handleAdd is different from handleAdd specificed in Components by the parent QuestionWithAnswer
    //and passed as AnswerForm props

    //here the functions are used to validate data or the throw errors
    function handleAdd() {
        
        if(text!=='' && author!=='') {
            props.handleAdd(date, text, author);
        } else {
            //look at how errors are managed using hooks so we have to adopt setEtt to set err=errValue
            setErr('Some data are missing') ;
        }
    }

    function handleSave() {
        if(text!=='' && author!=='') {
            props.handleSave(props.initialValue.id, date, text, author);
        } else {
            setErr('Some data are missing') ;
        }
    }

    return <div>
        {/*the error message appears only in case of errors */}
        {err && <p>{err}</p>}

            <Form.Group controlId="answerDate">
            <Form.Label className='fw-light'>Date</Form.Label>
            <Form.Control value={date} onChange={(ev)=>{setDate(ev.target.value)}} type="date" name="date" placeholder="Enter date" />
        </Form.Group>

        <Form.Group controlId="answerText">
            <Form.Label className='fw-light'>Answer text</Form.Label>
            <Form.Control value={text} onChange={(ev)=>{setText(ev.target.value)}} type="text" name="text" placeholder="Enter Answer" />
        </Form.Group>

        <Form.Group controlId="answerAuthor">
            <Form.Label className='fw-light'>Author</Form.Label>
            <Form.Control value={author} onChange={(ev)=>{setAuthor(ev.target.value)}}type="text" name="author" placeholder="Author's name" />
        </Form.Group>

        <Form.Group controlId="addButton">
            <Form.Label className='fw-light'>&nbsp;</Form.Label><br />
            {/*only in edd add and edit mode the tow buttonw will show up */}
            {props.mode==='add' && <Button variant='success' id="addbutton" onClick={handleAdd}>ADD</Button>}
            {props.mode==='edit' && <Button variant='success' id="addbutton" onClick={handleSave}>SAVE</Button>}
            {/**but the cancel button will be present anyway */}
            {' '}<Button variant='secondary' id="addbutton" onClick={props.handleCancel}>CANCEL</Button>
        </Form.Group>
    </div>
}

export {AddOrEditAnswer}


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
            <Form.Label className='fw-light'>&nbsp;</Form.Label><br />
            <Button variant='success' id="addbutton">ADD</Button>
        </Form.Group>
        </td>
    </tr>;
}
