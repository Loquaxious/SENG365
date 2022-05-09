import {Link, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";

const Message = () => {
    const {id, mid} = useParams()
    const [message, setMessage] = React.useState<Message>({message_id:0, convo_id:0, user_id:0, time_sent:"", message:""})
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        const getMessage = () => {
            axios.get('http://localhost:3000/api/conversations/'+ id +'/messages/' + mid)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setMessage(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getMessage()
    }, [id, mid])

    if(errorFlag) {
        return (
            <div>
                <h1>Message</h1>
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
                <Link to={"/conversations/" + id + "/messages"}>Back to messages</Link>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Message {message.message_id}</h1>
                {message.message}
                <div>
                    <Link to={"/conversations/" + id + "/messages"}>Back to messages</Link>
                </div>

            </div>
        )
    }
}
export default Message;