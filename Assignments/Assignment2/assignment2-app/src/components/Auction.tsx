import React from "react";
import axios from 'axios';
import {useAuctionStore} from "../store";
import CSS from 'csstype';
import {Delete, Edit} from "@mui/icons-material";
import {Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, TextField, Typography} from "@mui/material";

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
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const deleteAuctionFromStore = useAuctionStore(state => state.removeAuction)
    const editAuctionFromStore = useAuctionStore(state => state.editAuction)

    const deleteAuction = () => {
        axios.delete('http://localhost:4941/api/v1/auctions/' + auction.auctionId)
            .then((response) => {
                deleteAuctionFromStore(auction)
            })
    }

    const editAuction = () => {
        axios.put('http://localhost:4941/api/v1/auctions/' + auction.auctionId, {"title": title,
            "description": description, "categoryId": categoryId, "endDate": endDate, "reserve": reserve})
            .then((response) => {
                editAuctionFromStore(auction, title, description, categoryId, endDate, reserve)
            })
    }

    const auctionCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }

    return (
        <Card sx={auctionCardStyles}>
            <CardMedia
                component="img"
                height="200"
                width="200"
                sx={{objectFit:"cover"}}
                image="https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg"
                alt="Auction hero image"
            />
            <CardContent>
                <Typography variant="h5">
                    {auction.title}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton onClick={() => {setOpenEditDialog(true)}}>
                    <Edit/>
                </IconButton>
                <IconButton onClick={() => {setOpenDeleteDialog(true)}}>
                    <Delete/>
                </IconButton>
            </CardActions>
            ADD EDIT/DELETE
        </Card>
    )
}
export default AuctionObject