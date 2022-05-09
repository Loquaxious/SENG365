import React from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Message from "./Message";

const Messages = () => {
    const {id} = useParams()
    const [convo, setConvo] = React.useState<Conversation>({convo_id:0, convo_name:"", created_on:""})
    const [convoName, setConvoName] = React.useState("")
    const [messages, setMessages] = React.useState<Array<Message>>([])
    const [messageText, setMessageText] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate()

    const deleteConversation = (convo: Conversation) => {
        axios.delete('http://localhost:3000/api/conversations/' + convo.convo_id)
            .then((response) => {
                navigate('/conversations')
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

    const addMessage = () => {
        if (messageText === "") {
            alert("Please enter an message!")
        } else {
            axios.post('http://localhost:3000/api/conversations', {"message":messageText})
        }
    }

    const list_of_messages = () => {
        return messages.map((item: Message) =>
            <tr key={item.message_id}>
                <th scope="row">{item.message_id}</th>
                <td>{item.user_id}</td>
                <td>{item.message}</td>
                <td><Link to={"/conversations/" + item.convo_id + "/messages/" + item.message_id}>Go to
                    message</Link></td>
            </tr>
        )
    }

    React.useEffect( () => {
        getConversation()
        getMessages()
    }, [])

    const getConversation = () => {
        axios.get('http://localhost:3000/api/conversations/'+ id)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setConvo(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getMessages = () => {
        axios.get("http://localhost:3000/api/conversations/" + id + "/messages")
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setMessages(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    if(errorFlag) {
        return (
            <div>
                <h1>Messages</h1>
                <div style={{color:"red"}}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Conversation {convo.convo_id}</h1>
                <h3>{convo.convo_name} {" "}</h3>
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
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
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
                        data-bs-target="#deleteConversationModal">
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
                <div>
                    <Link to={"/conversations"}>Back to conversations</Link>
                </div>
                <h2>Messages</h2>
                <button type="button" className="btn btn-secondary" data-bs-toggle="modal"
                        data-bs-target="#addMessageModal">
                    Add Message
                </button>
                <div className="modal fade" id="addMessageModal" tabIndex={-1} role="dialog"
                     aria-labelledby="addMessageModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"
                                    id="addMessageModalLabel">Add Message</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                </button>
                            </div>
                            <div className="modal-body">
                                Message Text:
                                <form onSubmit={addMessage}>
                                    <input type={"text"} value={messageText} onChange={(event) =>  setMessageText(event.target.value)}/>
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
                        <th scope="col">user id</th>
                        <th scope="col">message</th>
                        <th scope="col">link</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list_of_messages()}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default Messages;