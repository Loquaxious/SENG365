import React from "react";
import Conversation from "./Conversation";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Conversations = () => {
    const [convos, setConvos] = React.useState<Array<Conversation>>([])
    const [convo, setConvo] = React.useState<Conversation>({convo_id:0, convo_name:"", created_on:""})
    const [convoName, setConvoName] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();

    const addConversation = () => {
        if (convoName === "") {
            alert("Please enter an username!")
        } else {
            axios.post('http://localhost:3000/api/conversations', {"convo_name":convoName})
        }
    }

    const deleteConversation = (convo: Conversation) => {
        axios.delete('http://localhost:3000/api/conversations/' + convo.convo_id)
            .then((response) => {
                navigate('/conversations')
                window.location.reload()
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const editConversation = () => {
        if (convoName === "") {
            alert("Please enter a conversation name!")
        } else {
            axios.put('http://localhost:3000/api/Conversations/' + convo.convo_id, {"convo_name": convoName})
                .then((response) => {
                    navigate('/Conversations/' + convo.convo_id)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }

    React.useEffect(() => {
        getConversations()
    }, [])

    const getConversations = () => {
      axios.get("http://localhost:3000/api/conversations")
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
                <td>{item.convo_name}</td>
                <td>{item.created_on}</td>
                <td><Link to={"/conversations/" + item.convo_id}>Go to conversation</Link></td>
                <td>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#editConversationModal">
                        Edit
                    </button>
                    <div className="modal fade" id="editConversationModal" tabIndex={-1} role="dialog"
                         aria-labelledby="editConversationModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title"
                                        id="editConversationModalLabel">Edit Conversation</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                    onClick={() => setConvo(item)}>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    Update Conversation Name:
                                    <form onSubmit={editConversation}>
                                        <input type={"text"} value={convoName} onChange={(event) =>  setConvoName(event.target.value)}/>
                                        <input type={"submit"} value={"Submit"}/>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#deleteConversationModal" onClick={() => setConvo(item)}>
                        Delete
                    </button>
                    <div className="modal fade" id="deleteConversationModal" tabIndex={-1} role="dialog"
                         aria-labelledby="deleteConversationModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title"
                                        id="deleteConversationModalLabel">Delete Conversation</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                    </button>
                                </div>
                                <div className="modal-body">
                                    Are you sure that you want to delete this Conversation?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                            onClick={() => deleteConversation(convo)}>
                                        Delete Conversation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                <button type="button" className="btn btn-secondary" data-bs-toggle="modal"
                        data-bs-target="#addConversationModal">
                    Add Conversation
                </button>
                <div className="modal fade" id="addConversationModal" tabIndex={-1} role="dialog"
                     aria-labelledby="addConversationModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"
                                    id="addConversationModalLabel">Add Conversation</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                </button>
                            </div>
                            <div className="modal-body">
                                Conversation Name:
                                <form onSubmit={addConversation}>
                                    <input type={"text"} value={convoName} onChange={(event) =>  setConvoName(event.target.value)}/>
                                    <input type={"submit"} value={"Submit"}/>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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