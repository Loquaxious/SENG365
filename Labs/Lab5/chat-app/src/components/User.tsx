import {Link, useNavigate, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";

const User = () => {
    const {id} = useParams()
    const [user, setUser] = React.useState<User>({user_id:0, username:""})
    const [username, setUsername] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();

    const deleteUser = (user: User) => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                navigate('/users')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const editUser = () => {
        if (username === "") {
            alert("Please enter a username!")
        } else {
            axios.put('http://localhost:3000/api/users/' + user.user_id, {"username": username})
                .then((response) => {
                    navigate('/users/' + user.user_id)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }

    React.useEffect(() => {
        const getUser = () => {
            axios.get('http://localhost:3000/api/users/'+id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setUser(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getUser()
    }, [id])

    if (errorFlag) {
        return (
            <div>
                <h1>User</h1>
                <div style={{color:"red"}}>
                    {errorMessage}
                </div>
                <Link to={"/users"}>Back to users</Link>
            </div>
        )
    } else {
        return (
            <div>
                <h1>User</h1>
                {user.user_id}: {user.username}
                <Link to={"/users"}>Back to users</Link>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#editUserModal">
                    Edit
                </button>
                <div className="modal fade" id="editUserModal" tabIndex={-1} role="dialog"
                     aria-labelledby="editUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"
                                    id="editUserModalLabel">Edit User</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                </button>
                            </div>
                            <div className="modal-body">
                                Update Username:
                                <form onSubmit={editUser}>
                                    <input type={"text"} value={username} onChange={(event) =>  setUsername(event.target.value)}/>
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
                        data-bs-target="#deleteUserModal">
                    Delete
                </button>
                <div className="modal fade" id="deleteUserModal" tabIndex={-1} role="dialog"
                     aria-labelledby="deleteUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"
                                    id="deleteUserModalLabel">Delete User</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure that you want to delete this user?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                        onClick={() => deleteUser(user)}>
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default User;