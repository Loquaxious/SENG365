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
                    <Card >
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="40"
                                width="40"
                                sx={{objectFit:"scale-down"}}
                                image={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}
                                alt="Seller hero image"
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