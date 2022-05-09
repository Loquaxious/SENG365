import {Link, useNavigate, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";

const Conversation = () => {
    const {id} = useParams()
    const [convo, setConvo] = React.useState<Conversation>({convo_id:0, convo_name:"", created_on:""})
    const [convoName, setConvoName] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();
    return (<h1>Conversation</h1>)
}
export default Conversation;