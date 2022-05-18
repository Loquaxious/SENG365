import React from "react";
import axios from 'axios';
import {useAuctionStore} from "../store";
import CSS from 'csstype';
import {Delete, Edit} from "@mui/icons-material";
import {
    Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, TableContainer, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface IAuctionProps {
    auction: Auction
}

const AuctionObject = (props: IAuctionProps) => {
    const [auction] = React.useState<Auction>(props.auction)
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [categoryId, setCategoryId] = React.useState(-1)
    const [endDate, setEndDate] = React.useState("")
    const [reserve, setReserve] = React.useState(-1)
    const navigate = useNavigate();
    // const [openEditDialog, setOpenEditDialog] = React.useState(false)
    // const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    // const deleteAuctionFromStore = useAuctionStore(state => state.removeAuction)
    // const editAuctionFromStore = useAuctionStore(state => state.editAuction)
    //
    // const deleteAuction = () => {
    //     axios.delete('http://localhost:4941/api/v1/auctions/' + auction.auctionId)
    //         .then((response) => {
    //             deleteAuctionFromStore(auction)
    //         })
    // }
    //
    // const editAuction = () => {
    //     axios.put('http://localhost:4941/api/v1/auctions/' + auction.auctionId, {"title": title,
    //         "description": description, "categoryId": categoryId, "endDate": endDate, "reserve": reserve})
    //         .then((response) => {
    //             editAuctionFromStore(auction, title, description, categoryId, endDate, reserve)
    //         })
    // }

    const daysTillClosing = () => {
        const currentDate = new Date()
        const endDate = new Date(auction.endDate)
        const daysLeft = Math.floor(Math.ceil(endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        if (daysLeft < 0) {
            return 'Auction closed'
        } else if (daysLeft === 1) {
            return "Closes tomorrow"
        } else {
            return `Closes in ${daysLeft} days`
        }
    }

    const auctionCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "600px",
        width: "400px",
        margin: "10px",
        padding: "0px"
    }

    return (
        <Card sx={auctionCardStyles}>
            <CardMedia
                component="img"
                height="300"
                width="300"
                sx={{objectFit:"cover"}}
                image={`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`}
                alt="Auction hero image"
            />
            <CardContent>
                <Typography variant="h5">
                    {auction.title}
                </Typography>
                <Typography variant={"h6"}>
                    {daysTillClosing()}
                </Typography>
                <Typography>
                    {`Category: ${auction.categoryId}`}
                </Typography>
                <Typography>
                    {auction.highestBid?`Current Highest Bid: $${auction.highestBid}`:`Current Highest Bid: $0`}
                </Typography>
                <Typography>
                    {auction.highestBid > auction.reserve?`Reserve: met`: `Reserve: $${auction.reserve}`}
                </Typography>
                <Card onClick={() => navigate('/users/' + auction.sellerId)}>
                    <CardMedia
                        component="img"
                        height="40"
                        width="40"
                        sx={{objectFit:"scale-down"}}
                        image={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}
                        alt="Seller hero image"
                    />
                    <Typography style={{display:"inline"}}>{auction.sellerFirstName + " " + auction.sellerLastName}</Typography>
                </Card>
            </CardContent>
            <CardActions>
                {/*<IconButton onClick={() => {setOpenEditDialog(true)}}>*/}
                {/*    <Edit/>*/}
                {/*</IconButton>*/}
                {/*<IconButton onClick={() => {setOpenDeleteDialog(true)}}>*/}
                {/*    <Delete/>*/}
                {/*</IconButton>*/}
            </CardActions>
        </Card>
    )
}
export default AuctionObject