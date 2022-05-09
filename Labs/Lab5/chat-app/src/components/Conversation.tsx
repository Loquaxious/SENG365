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

    React.useEffect(() => {
        getConversation()
    }, [id])

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

    if(errorFlag) {
        return (
            <div>
                <h1>Conversation</h1>
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
                <Link to={"/conversations"}>Back to conversations</Link>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Conversation {convo.convo_id}</h1>
               {convo.convo_name} {" "}
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
            </div>
        )
    }
}
export default Conversation;