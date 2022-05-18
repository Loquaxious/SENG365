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
import FilterListIcon from '@mui/icons-material/FilterList';

const Auctions = () => {
    const auctions = useAuctionStore(state => state.auctions)
    const setAuctions = useAuctionStore(state => state.setAuctions)
    const [count, setCount] = React.useState(0)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [filterQuery, setFilterQuery] = React.useState("")
    const [openFilterDialog, setOpenFilterDialog] = React.useState(false)

    const handleFilterDialogOpen = () => {
        setOpenFilterDialog(true)
    }

    const handleFilterDialogClose = () => {
        setFilterQuery("")
        setOpenFilterDialog(false)
    }

    const handleKeyDownSearch = (event: any) => {
        if (event.key ==='Enter') {
            queryAuctions()
        }
    }

    const queryAuctions = () => {
        axios.get('http://localhost:4941/api/v1/auctions?q=' + searchQuery + filterQuery)
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
    <AuctionObject key={auction.auctionId + auction.title} auction={auction}/>)

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
                   InputProps={{startAdornment: <InputAdornment position={"start"}><SearchIcon/></InputAdornment>}} onKeyDown={(event) => handleKeyDownSearch(event)}/>
            <Button variant={"outlined"} onClick={() => queryAuctions()}>Search</Button>
            <Button variant={"outlined"} onClick={() => setOpenFilterDialog(true)}><FilterListIcon/> Filter</Button>
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
            <Dialog
                open={openFilterDialog}
                onClose={handleFilterDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Filter Auctions"}
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterDialogClose}>Cancel</Button>
                    <Button variant="outlined" color="success" onClick={() => searchQuery} autoFocus>
                        Filter
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}

export default Auctions;