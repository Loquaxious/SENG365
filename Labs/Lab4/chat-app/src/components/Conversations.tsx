import React from "react";
import Conversation from "./Conversation";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Conversations = () => {
    const [convos, setConvos] = React.useState<Array<Conversation>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();

    React.useEffect(() => {
        getConversations()
    }, [])

    const getConversations = () => {
      axios.get("http://localhost:8080/api/conversations")
          .then((response) => {
              setErrorFlag(false)
              setErrorMessage("")
              setConvos(response.data)
          }, (error) => {
              setErrorFlag(true)
              setErrorMessage(error.toString())
          })
    }

    const list_of_conversations = () => {
        return convos.map((item: Conversation) =>
            <tr key={item.convo_id}>
                <th scope="row">{item.convo_id}</th>
                <td>{item.username}</td>
                <td><Link to={"/conversations/" + item.convo_id}>Go to conversation</Link></td>
                <td>
                   <button type={"button"}>Delete</button>
                    <button type={"button"}>Edit</button>
                </td>
            </tr>
        )
    }

    if(errorFlag) {
        return (
            <div>
                <h1>Conversations</h1>
                <div style={{color:"red"}}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Conversations</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">name</th>
                        <th scope="col">created on</th>
                        <th scope="col">link</th>
                        <th scope="col">actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list_of_conversations()}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default Conversations;