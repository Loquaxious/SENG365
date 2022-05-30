import React from "react";
import {
    Alert, AlertTitle,
    Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, FormControlLabel,
    FormLabel,
    InputLabel, ListItemText, MenuItem,
    OutlinedInput, Pagination, Paper, Radio, RadioGroup, Select, Typography,
} from "@mui/material";
import axios from "axios";
import AuctionObject from "./AuctionObject";
import CSS from "csstype";
import AuctionsNavBar from "./AuctionsNavbar";


const UserAuctions = () => {
    const [sellingAuctions, setSellingAuctions] = React.useState<Array<Auction>>([]);
    const [biddingAuctions, setBiddingAuctions] = React.useState<Array<Auction>>([]);
    const authToken = localStorage.getItem('token');
    const userId = localStorage.getItem('user');
    const [sellingCount, setSellingCount] = React.useState(0);
    const [biddingCount, setBiddingCount] = React.useState(0);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");



    React.useEffect(() => {
        const getSellingAuctions = () => {
            axios.get(`http://localhost:4941/api/v1/auctions?sellerId=${userId}`)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setSellingAuctions(response.data.auctions)
                    setSellingCount(response.data.count)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        const getBiddingAuctions = () => {
            axios.get(`http://localhost:4941/api/v1/auctions?bidderId=${userId}`)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setBiddingAuctions(response.data.auctions)
                    setBiddingCount(response.data.count)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getSellingAuctions()
        getBiddingAuctions()
    }, [setSellingAuctions, setBiddingAuctions])

    const auction_rows = () => {
        const auctions = sellingAuctions.concat(biddingAuctions)
        return auctions.map((auction: Auction) =>
            <AuctionObject key={auction.auctionId} auction={auction}/>)
    }

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }


    return (
        <div>
            {AuctionsNavBar()}
            <h1 style={{textAlign: "left", paddingLeft: "20px"}}>Your Auctions</h1>
            <Paper elevation={3} style={card} >
                {errorFlag? "" :
                    <Card>
                        {`Displaying ${biddingCount + sellingCount}  auction(s) you are involved in`}
                    </Card>}
                <div style={{display:"inline-block", maxWidth:"1920px", minWidth:"320"}}>
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
export default UserAuctions;