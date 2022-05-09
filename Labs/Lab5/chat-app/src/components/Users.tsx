import axios from 'axios';
import React from "react";
import User from "./User";
import {Link, useNavigate} from "react-router-dom";
import {Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';

const Users = () => {
    const [users, setUsers] = React.useState<Array<User>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [usernameEdit, setUsernameEdit] = React.useState("")
    const [usernameAdd, updateUsernameAddState] = React.useState("")
    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [dialogUser, setDialogUser] = React.useState<User>({username:"", user_id:-1})


    const handleDeleteDialogOpen = (user:User) => {
        setDialogUser(user)
        setOpenDeleteDialog(true);
    };
    const handleDeleteDialogClose = () => {
        setDialogUser({username:"", user_id:-1})
        setOpenDeleteDialog(false);
    };

    const handleEditDialogOpen = (user:User) => {
        setDialogUser(user)
        setOpenEditDialog(true);
    };
    const handleEditDialogClose = () => {
        setDialogUser({username:"", user_id:-1})
        setOpenEditDialog(false);
    };
    // TODO Make the below method work
    const updateUsernameEditState = () => {
      setUsernameEdit()
    }

    React.useEffect(() => {
        getUsers()
    }, [])

    const addUser = () => {
        if (usernameAdd === "") {
            alert("Please enter an username!")
        } else {
            axios.post('http://localhost:3000/api/users', {"username":usernameAdd})
        }
    }

    const deleteUser = () => {
        axios.delete('http://localhost:3000/api/users/' + dialogUser.user_id)
            .then((response) => {
                navigate('/users')
                window.location.reload()
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const editUser = () => {
        if (usernameEdit === "") {
            alert("Please enter a username!")
        } else {
            axios.put('http://localhost:3000/api/users/' + dialogUser.user_id, {"username": usernameEdit})
                .then((response) => {
                    navigate('/users/' + dialogUser.user_id)
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
                    <Button variant="outlined" endIcon={<EditIcon/>} onClick={() =>
                    {handleEditDialogOpen(item)}}>
                        Edit
                    </Button>
                    <Button variant="outlined" endIcon={<DeleteIcon/>} onClick={() =>
                    {handleDeleteDialogOpen(item)}}>
                        Delete
                    </Button>
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
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Delete User?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() => {deleteUser()}} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openEditDialog}
                    onClose={handleEditDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Edit User?"}
                    </DialogTitle>
                    <DialogContent>
                        <TextField id="outlined-basic" label="Username" variant="outlined"
                                   value={usernameEdit} onChange={updateUsernameEditState} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="success" onClick={() => {editUser()}} autoFocus>
                            Edit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default Users;