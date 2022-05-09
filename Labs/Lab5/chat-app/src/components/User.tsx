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
                <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#deleteUserModal">
                    Delete
                </button>
            </div>
        )
    }
}
export default User;