import axios from 'axios';
import React from "react";
import User from "./User";
import {Link} from "react-router-dom";
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TextField, Paper, Table, TableBody,
    TableContainer, TableRow, TableCell, TableHead, Stack, Alert, AlertTitle, Snackbar
} from
        "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import CSS from 'csstype';


const Users = () => {
    const [users, setUsers] = React.useState<Array<User>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [usernameEdit, setUsernameEdit] = React.useState("")
    const [usernameAdd, setUsernameAdd] = React.useState("")
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [dialogUser, setDialogUser] = React.useState<User>({username: "", user_id: -1})
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px"
    }

    interface HeadCell {
        id: string;
        label: string;
        numeric: boolean;
    }

    const headCells: readonly HeadCell[] = [
        {id: 'ID', label: 'id', numeric: false},
        { id: 'username', label: 'Username', numeric: true },
        { id: 'link', label: 'Link', numeric: true },
        { id: 'actions', label: 'Actions', numeric: true }
    ];

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

    React.useEffect(() => {
        getUsers()
    }, [])

    const addUser = () => {
        if (usernameAdd === "") {
            alert("Please enter an username!")
        } else {
            axios.post('http://localhost:3000/api/users', {"username":usernameAdd})
                .then((response) => {
                    const usersCopy = [...users]
                    usersCopy.push({"user_id": response.data.user_id, "username": usernameAdd})
                    setUsers(usersCopy)
                    setUsernameAdd("")
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }

    const deleteUser = () => {
        axios.delete('http://localhost:3000/api/users/' + dialogUser.user_id)
            .then((response) => {
                handleDeleteDialogClose()
                for (let i = 0; i < users.length; i++) {
                    if (users[i].user_id === dialogUser.user_id) {
                        users.splice(i, 1)
                    }
                }
                setUsers(users)
                setSnackMessage("User deleted successfully")
                setSnackOpen(true)
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
                    handleEditDialogClose()
                    for (const user of users) {
                        if (user.user_id === dialogUser.user_id) {
                            user.username = usernameEdit
                        }
                    }
                    setUsers(users)
                    setSnackMessage("Username changed successfully")
                    setSnackOpen(true)
                    setUsernameEdit("")
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
        return users.map((row: User) =>
            <TableRow hover
                    tabIndex={-1}
                    key={row.user_id}>
                <TableCell>
                    {row.user_id}
                </TableCell>
                <TableCell align={"right"}>{row.username}</TableCell>
                <TableCell align={"right"}><Link to={"/users/"+row.user_id}>Go to user</Link></TableCell>
                <TableCell align={"right"}>
                    <Button variant={"outlined"} endIcon={<EditIcon/>} onClick={() => {handleEditDialogOpen(row)}}>
                        Edit
                    </Button>
                    <Button variant={"outlined"} endIcon={<DeleteIcon/>} onClick={() => {handleDeleteDialogOpen(row)}}>
                        Delete
                    </Button>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <div>
            <h1>Users</h1>
            {errorFlag && <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
            </Alert>}
            <Paper elevation={3} style={card}>
                <h1>Add a new user</h1>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <TextField id="outlined-basic" label="Username"
                               variant="outlined" value={usernameAdd} onChange={(event) => setUsernameAdd(event.target.value)}
                    />
                    <Button variant="outlined" onClick={() => {addUser()}}>
                        Submit
                    </Button>
                </Stack>
            </Paper>
            <Paper elevation={3} style={card}>
                <h1>Users</h1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={'normal'}>
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list_of_users()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
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
                               value={usernameEdit} onChange={(event) => setUsernameEdit(event.target.value)} autoFocus/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button variant="outlined" color="success" onClick={() => {editUser()}}>
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                autoHideDuration={6000}
                open={snackOpen}
                onClose={handleSnackClose}
                key={snackMessage}>
                <Alert onClose={handleSnackClose} severity="success" sx={{
                    width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default Users;