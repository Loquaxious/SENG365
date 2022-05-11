import React from "react";
import axios from 'axios';
import {Link} from "react-router-dom";
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TextField, Paper, Table, TableBody,
    TableContainer, TableRow, TableCell, TableHead, Stack, Alert, AlertTitle, Snackbar
} from "@mui/material";
// TODO Get is working, Follow UserList in lab 5
const Auctions = () => {
    const [auctions, setAuctions] = React.useState<Array<Auction>>([])
    const [count, setCount] = React.useState(0)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        const getAuctions = () => {
            axios.get('http://localhost:4941/api/v1/auctions')
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setAuctions(response.data.auctions)
                    setCount(response.data.count)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
            })
        }
    })

    return (
        <div>
            <h1 style={{textAlign: "left", paddingLeft: "20px"}}>Auctions</h1>
            {errorFlag && <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
            </Alert>}

        </div>

    )
}

export default Auctions;