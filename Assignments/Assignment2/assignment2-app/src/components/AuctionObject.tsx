import React from "react";
import CSS from 'csstype';
import {
    Card, CardActionArea, CardContent, CardMedia, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface IAuctionProps {
    auction: Auction
}

const AuctionObject = (props: IAuctionProps) => {
    const [auction] = React.useState<Auction>(props.auction)
    const navigate = useNavigate();

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
        <Card sx={auctionCardStyles} onClick={() => navigate('/auctions/' + auction.auctionId)}>
            <CardActionArea>
                <img src={`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`}
                     onError={({currentTarget}) => {
                         currentTarget.onerror = null;
                         currentTarget.src=  "https://via.placeholder.com/300.jpg?text=Default+Auction+Image"}}
                     height={"300px"}
                     width={"300px"}
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
                    <Card >
                        <CardActionArea>
                            <img src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}
                                 onError={({currentTarget}) => {
                                     currentTarget.onerror = null;
                                     currentTarget.src=  "https://via.placeholder.com/40.jpg?text=Default+Auction+Seller+Image"}}
                                 height={"40px"}
                                 width={"40px"}
                            />
                            <CardContent>
                                <Typography style={{display:"inline"}}>{auction.sellerFirstName + " " + auction.sellerLastName}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
export default AuctionObject