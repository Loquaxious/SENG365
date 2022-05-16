import React from "react";
import axios from 'axios';
import CSS from 'csstype';
import {useAuctionStore} from "../store";
import {Link} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TableHead,
    Stack,
    Alert,
    AlertTitle,
    Snackbar,
    InputAdornment,
    FormControl,
    Input
} from "@mui/material";
import AuctionObject from "./Auction";
import SearchIcon from '@mui/icons-material/Search';
// TODO Get is working, Follow UserList in lab 5
const Auctions = () => {
    const auctions = useAuctionStore(state => state.auctions)
    const setAuctions = useAuctionStore(state => state.setAuctions)
    const [count, setCount] = React.useState(0)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const queryAuctions = () => {
        axios.get('http://localhost:4941/api/v1/auctions?q=' + searchQuery)
            .then((response) => {
                setAuctions(response.data.auctions)
                setCount(response.data.count)
            },(error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

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
                    setErrorMessage(error.toString() + " defaulting to old auction changes app may not work as expected")
            })
        }
        getAuctions()
    }, [setAuctions])

    const auction_rows = () => auctions.map((auction: Auction) =>
    <AuctionObject key={auction.title} auction={auction}/>)

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }

    return (
        <div>
            <h1 style={{textAlign: "left", paddingLeft: "20px"}}>Auctions</h1>
            <TextField
                   id={"search-bar"}
                   value={searchQuery}
                   onChange={(event) => setSearchQuery(event.target.value)}
                   InputProps={{startAdornment: <InputAdornment position={"start"}><SearchIcon/></InputAdornment>}}/>
            <Button variant={"outlined"} onClick={() => queryAuctions()}>Search</Button>
            <Paper elevation={3} style={card}>
                <div style={{display:"inline-block", maxWidth:"965px", minWidth:"320"}}>
                    {errorFlag?
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                        :""}
                    {auction_rows()}
                </div>
            </Paper>
        </div>

    )
}

export default Auctions;