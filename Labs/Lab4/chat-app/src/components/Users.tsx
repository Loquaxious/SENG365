import axios from 'axios';
import React from "react";
import User from "./User";
import {Link, useNavigate} from "react-router-dom";

const Users = () => {
    const [users, setUsers] = React.useState<Array<User>>([])
    const [user, setUser] = React.useState<User>({user_id:0, username:""})
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [username, setUsername] = React.useState("")
    const navigate = useNavigate();


    React.useEffect(() => {
        getUsers()
    }, [])

    const addUser = () => {
        if (username === "") {
            alert("Please enter an username!")
        } else {
            axios.post('http://localhost:3000/api/users', {"username":username})
        }
    }

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

    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setUsers(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const list_of_users = () => {
        return users.map((item: User) =>
            <tr key={item.user_id}>
                <th scope="row">{item.user_id}</th>
                <td>{item.username}</td>
                <td><Link to={"/users/" + item.user_id}>Go to user</Link></td>
                <td>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#editUserModal" onClick={() => setUser(item)}>
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
                            data-bs-target="#deleteUserModal" onClick={() => setUser(item)}>
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
                </td>
            </tr>
        )
    }

    if (errorFlag) {
        return (
            <div>
                <h1>Users</h1>
                <div style={{color:"red"}}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Users</h1>
                <button type="button" className="btn btn-secondary" data-bs-toggle="modal"
                        data-bs-target="#addUserModal">
                    Add User
                </button>
                <div className="modal fade" id="addUserModal" tabIndex={-1} role="dialog"
                     aria-labelledby="addUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"
                                    id="addUserModalLabel">Add User</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                </button>
                            </div>
                            <div className="modal-body">
                                Update Username:
                                <form onSubmit={addUser}>
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

                <table className={"table"}>
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope={"col"}>username</th>
                        <th scope={"col"}>link</th>
                        <th scope={"col"}>actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list_of_users()}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default Users;