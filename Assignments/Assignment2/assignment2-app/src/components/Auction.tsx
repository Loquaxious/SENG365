import React from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Card,
    CardContent,
    CardMedia,
    Table, TableBody,
    TableCell,
    TableContainer, TableHead,
    TableRow,
    Typography
} from "@mui/material";
import AuctionObject from "./AuctionObject";
import Navbar from "./Navbar";

const Auction = () => {
    const {id} = useParams()
    const [auction, setAuction] = React.useState<Auction>({auctionId: -1, endDate:"", sellerLastName:"", sellerFirstName:"", sellerId:-1, reserve:-1, highestBid:-1, categoryId:-1, title:"", numBids:-1, description:""})
    const [bids, setBids] = React.useState<Array<Bid>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categories, setCategories] = React.useState<Category[]>([])
    const [similarCategoryAuctions, setSimilarCategoryAuctions] = React.useState<Array<Auction>>([])
    const [similarSellerAuctions, setSimilarSellerAuctions] = React.useState<Array<Auction>>([])

    const getSameCategoryAuctions = (categoryId: number) => {
        axios.get(`http://localhost:4941/api/v1/auctions/?categoryIds=${categoryId}`)
            .then((res) => {
                setErrorFlag(false)
                setErrorMessage("")
                setSimilarCategoryAuctions(res.data.auctions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const getSameSellerAuctions = (sellerId: number) => {
        axios.get(`http://localhost:4941/api/v1/auctions/?sellerId=${sellerId}`)
            .then((res) => {
                setErrorFlag(false)
                setErrorMessage("")
                setSimilarSellerAuctions(res.data.auctions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const similarAuctionRows = () => {
        const filteredSimilarSellerAuctions = similarSellerAuctions.filter(similarAuction => similarAuction.auctionId !== auction.auctionId)
        const filteredSimilarCategoryAuctions = similarCategoryAuctions.filter(similarAuction => similarAuction.auctionId !== auction.auctionId)
        console.log(similarSellerAuctions)
        console.log(similarCategoryAuctions)

        let similarAuctions: Array<Auction> = []
        for (let i=0; i<filteredSimilarSellerAuctions.length; i++) {
            if (!filteredSimilarCategoryAuctions.includes(filteredSimilarSellerAuctions[i])) {
                similarAuctions.push(filteredSimilarSellerAuctions[i])
            }
        }

        for (let j=0; j<filteredSimilarCategoryAuctions.length; j++) {
            if (!filteredSimilarSellerAuctions.includes(filteredSimilarCategoryAuctions[j])) {
                similarAuctions.push(filteredSimilarCategoryAuctions[j])
            }
        }


        return similarAuctions.map((auction: Auction) =>
            <AuctionObject key={auction.auctionId} auction={auction}/>)
    }

    interface HeadCell {
        id: string;
        label: string;
        numeric: boolean;
    }

    const headCells: readonly HeadCell[] = [
        {id: 'avatar', label: 'Avatar', numeric: false},
        { id: 'names', label: 'Name', numeric: true },
        { id: 'amount', label: 'Amount', numeric: true },
        { id: 'timestamp', label: 'Timestamp', numeric: true }
    ];

    const getCategoryName = (catId: number) => {
        for (let i=0; i < categories.length; i++) {
            if (categories[i].categoryId === catId) {
                return categories[i].name
            }
        }
    }

    const list_of_bidders = () => {
      return bids.map((row: Bid) =>
          <TableRow hover tabIndex={-1} key={row.bidderId.toString() + row.amount.toString()}>
              <TableCell align={"right"}>
                  <Card>
                      <CardMedia
                          component="img"
                          height="50"
                          width="50"
                          sx={{objectFit:"scale-down"}}
                          image={`http://localhost:4941/api/v1/users/${row.bidderId}/image`}
                          alt="Auction hero image"
                      />
                  </Card>
              </TableCell>
              <TableCell align={"right"}>{`${row.firstName} ${row.lastName}`}</TableCell>
              <TableCell align={"right"}>{`$${row.amount}`}</TableCell>
              <TableCell align={"right"}>{row.timestamp}</TableCell>
          </TableRow>
      )
    }

    React.useEffect(() => {
        const getAuction = () => {
            axios.get(`http://localhost:4941/api/v1/auctions/${id}`)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setAuction(response.data)
                    getSameSellerAuctions(response.data.sellerId)
                    getSameCategoryAuctions(response.data.categoryId)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        const getBidders = () => {
            axios.get(`http://localhost:4941/api/v1/auctions/${id}/bids`)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setBids(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }

        const getCategories = () => {
            axios.get('http://localhost:4941/api/v1/auctions/categories')
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setCategories(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                });
        }
        getAuction()
        getCategories()
        getBidders()
    }, [id])

    return (
        <div>
            {Navbar()}
            {errorFlag?
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
                :""}
            <h1>{auction.title}</h1>
            <Card style={{display: "flex", maxWidth: "1000px", minWidth: "320px", alignSelf: "center"}}>
                <CardMedia
                    component="img"
                    height="500"
                    width="500"
                    sx={{objectFit:"scale-down"}}
                    image={`http://localhost:4941/api/v1/auctions/${id}/image`}
                    alt="Auction hero image"
                />
            </Card>
            <Card variant={"outlined"}>
                <Typography variant={'h5'}>Details</Typography>
                <Card>
                    <Typography variant={"h6"}>Description:</Typography>
                    <Typography variant={"subtitle1"}>{auction.description}</Typography>
                </Card>
                <Card>
                    <Typography variant={"h6"}>End Date:</Typography>
                    <Typography variant={"subtitle1"}>{auction.endDate}</Typography>
                </Card>
                <Card>
                    <Typography variant={"h6"}>Category:</Typography>
                    <Typography variant={"subtitle1"}>{getCategoryName(auction.categoryId)}</Typography>
                </Card>
                <Card>
                    <Typography variant={"h6"}>Reserve:</Typography>
                    <Typography variant={"subtitle1"}>{`$${auction.reserve}`}</Typography>
                </Card>
                <Card>
                    <Typography variant={"h6"}>Number of Bids:</Typography>
                    <Typography variant={"subtitle1"}>{`${auction.numBids}`}</Typography>
                </Card>
                <Card>
                    <Typography variant={"h6"}>Current Bid:</Typography>
                    <Typography variant={"subtitle1"}>{auction.highestBid? `$${auction.highestBid}`: `$0`}</Typography>
                </Card>
                <Card>
                    <Typography variant={"h6"}>Seller:</Typography>
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
                </Card>
            </Card>
            <Card>
                <Typography variant={"h5"}>List of Bidders</Typography>
                <TableContainer component={Card}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric? "right": "left"}
                                        padding={"normal"}>
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list_of_bidders()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <Card>
                <Typography variant={"h5"}>Similar Auctions</Typography>
                {<div style={{display:"inline-block", maxWidth:"1920px", minWidth:"320"}}>
                    {similarAuctionRows()}
                </div>}
            </Card>
        </div>
    )
}
export default Auction;