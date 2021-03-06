import React from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Grid,
    Button,
    DialogTitle,
    DialogContent,
    Dialog,
    DialogContentText,
    DialogActions,
    TextField,
    FormControl,
    InputLabel, Select, MenuItem, InputAdornment, CardMedia, Snackbar
} from "@mui/material";
import AuctionObject from "./AuctionObject";
import Navbar from "./Navbar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import DatePicker from "react-datepicker";
import Container from "@mui/material/Container";

const Auction = () => {
    const {id} = useParams();
    let userId = localStorage.getItem('user');
    let authToken = localStorage.getItem('token');
    const [auction, setAuction] = React.useState<Auction>({auctionId: -1, endDate:"", sellerLastName:"",
        sellerFirstName:"", sellerId:-1, reserve:-1, highestBid:-1, categoryId:-1, title:"", numBids:-1,
        description:""});
    const [bids, setBids] = React.useState<Array<Bid>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [similarCategoryAuctions, setSimilarCategoryAuctions] = React.useState<Array<Auction>>([]);
    const [similarSellerAuctions, setSimilarSellerAuctions] = React.useState<Array<Auction>>([]);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [title, setTitle] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [endDate, setEndDate] = React.useState<Date|null>(null);
    const [description, setDescription] = React.useState("");
    const [reserve, setReserve] = React.useState<number>(NaN);
    const [image, setImage] = React.useState<File | null>();
    const [bid, setBid] = React.useState(0);
    const [imageErrorFlag, setImageErrorFlag] = React.useState(false);
    const navigate = useNavigate();
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");

    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    const handleDeleteDialogOpen = () => {
        setOpenDeleteDialog(true);
    };
    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleEditDialogOpen = () => {
        setOpenEditDialog(true);
    };
    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    };

    const filterPassedTime = (time: Date) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();
    };

    const prepareEditData = () => {
        let resultDict = {};
        const editDict = {
            title: title,
            description: description,
            categoryId: category,
            endDate: endDate?.toISOString().split('T')[0]+' '+endDate?.toTimeString().split(' ')[0],
            reserve: reserve
        }
        for (let key in editDict) {
            // @ts-ignore
            if (editDict[key]) {
                // @ts-ignore
                if (typeof editDict[key] === "number") {
                    // @ts-ignore
                    if(!isNaN(editDict[key])) {
                        // @ts-ignore
                        resultDict[key] = editDict[key]
                    }
                } else {
                    // @ts-ignore
                    if (editDict[key].length !== 0) {
                        // @ts-ignore
                        resultDict[key] = editDict[key]
                    }
                }
            }
        }
        console.log(endDate?.toISOString().split('T')[0]+' '+endDate?.toTimeString().split(' ')[0])
        console.log(resultDict)
        return resultDict
    }

    const deleteAuction = () => {
        axios.delete(`http://localhost:4941/api/v1/auctions/${auction.auctionId}`, {
            // @ts-ignore
            headers: {'X-Authorization': authToken}
        }).then(res => {
            setErrorFlag(false);
            setErrorMessage("");
            navigate(`/auctions/`)
        }, (error) => {
            setErrorFlag(true);
            if(error.toString().includes('404')) {
                setErrorMessage("NOT FOUND: Auction not found")
            } else if (error.toString().includes('401')) {
                setErrorMessage("UNAUTHORISED: Invalid authentication token to delete this auction")
            } else if (error.toString().includes('403')) {
                setErrorMessage("FORBIDDEN: Auction has bids on it, cannot delete")
            } else if (error.toString().includes('500')) {
                setErrorMessage("Something when wrong with the server... Oops our bad")
            } else {
                setErrorMessage(error.toString())
            }
        })
    }
    
    const updateImage = () => {
      axios.put(`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`, image, {
          // @ts-ignore
          headers: {'X-Authorization': authToken, 'Content-Type': image['type']}
      }).then(res => {
          setErrorFlag(false);
          setErrorMessage("");
          getAuctionImage()
          setSnackMessage("Image successfully changed")
          setSnackOpen(true)
      }, (error) => {
          setErrorFlag(true);
          if(error.toString().includes('400')) {
              setErrorMessage("BAD REQUEST: Image file type is invalid (only accept .png, .jpeg, .gif)")
          } else if (error.toString().includes('401')) {
              setErrorMessage("UNAUTHORISED: Invalid authentication token to change this auction's image")
          } else if (error.toString().includes('403')) {
              setErrorMessage("FORBIDDEN: Auction has bids on it, cannot edit image")
          } else if (error.toString().includes('404')) {
              setErrorMessage("NOT FOUND: Auction not found")
          } else if (error.toString().includes('500')) {
              setErrorMessage("Something when wrong with the server... Oops our bad")
          } else {
              setErrorMessage(error.toString())
          }
      })
    }

    const editAuction = () => {
      axios.patch(`http://localhost:4941/api/v1/auctions/${auction.auctionId}`, prepareEditData(), {
          // @ts-ignore
          headers: {'X-Authorization': authToken}
      }).then(res => {
          setErrorFlag(false);
          setErrorMessage("");
          if (image) {
              updateImage()
          }
          getAuction()
          handleEditDialogClose()
          setSnackMessage("Auction details successfully changed")
          setSnackOpen(true)
      }, (error) => {
          handleEditDialogClose()
          setErrorFlag(true);
          if(error.toString().includes('400')) {
              setErrorMessage("BAD REQUEST: Invalid data in one of the form fields")
          } else if (error.toString().includes('401')) {
              setErrorMessage("UNAUTHORISED: Invalid authentication token to edit this auction")
          } else if (error.toString().includes('403')) {
              setErrorMessage("FORBIDDEN: Invalid data input on edit")
          } else if (error.toString().includes('404')) {
              setErrorMessage("NOT FOUND: Auction not found")
          } else if (error.toString().includes('500')) {
              setErrorMessage("Something when wrong with the server... Oops our bad")
          } else {
              setErrorMessage(error.toString())
          }
      })
    }

    const handlePlaceBid = () => {
      axios.post(`http://localhost:4941/api/v1/auctions/${auction.auctionId}/bids`, {"amount": bid}, {
          // @ts-ignore
          headers: {'X-Authorization': authToken}
      }).then(res => {
          setErrorFlag(false)
          setErrorMessage("")
          getBidders()
          getAuction()
          setSnackMessage("Bid placed")
          setSnackOpen(true)
      }, (error) => {
          handleEditDialogClose()
          setErrorFlag(true)
          if(error.toString().includes('400')) {
              setErrorMessage("BAD REQUEST: Invalid bid")
          } else if (error.toString().includes('401')) {
              setErrorMessage("UNAUTHORISED: Invalid authentication token to bid on this auction")
          } else if (error.toString().includes('403')) {
              setErrorMessage("FORBIDDEN: Bid value is invalid, ensure the bid is above the current highest bid")
          } else if (error.toString().includes('404')) {
              setErrorMessage("NOT FOUND: Auction not found")
          } else if (error.toString().includes('500')) {
              setErrorMessage("Something when wrong with the server... Oops our bad")
          } else {
              setErrorMessage(error.toString())
          }
      })
    }

    const getSameCategoryAuctions = (categoryId: number) => {
        axios.get(`http://localhost:4941/api/v1/auctions/?categoryIds=${categoryId}`)
            .then((res) => {
                setErrorFlag(false)
                setErrorMessage("")
                setSimilarCategoryAuctions(res.data.auctions)
            }, (error) => {
                setErrorFlag(true)
                if (error.toString().includes('400')) {
                    setErrorMessage("BAD REQUEST: Invalid request when retrieving auctions of the same category")
                } else if (error.toString().includes('500')) {
                    setErrorMessage("Something when wrong with the server... Oops our bad")
                } else {
                    setErrorMessage(error.toString())
                }
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
                setErrorFlag(true)
                if (error.toString().includes('400')) {
                    setErrorMessage("BAD REQUEST: Invalid request when retrieving auctions of the same seller")
                } else if (error.toString().includes('500')) {
                    setErrorMessage("Something when wrong with the server... Oops our bad")
                } else {
                    setErrorMessage(error.toString())
                }
            })
    }

    const similarAuctionRows = () => {
        const filteredSimilarSellerAuctions = similarSellerAuctions.filter(similarAuction => similarAuction.auctionId !== auction.auctionId)
        const filteredSimilarCategoryAuctions = similarCategoryAuctions.filter(similarAuction => similarAuction.auctionId !== auction.auctionId)

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
            <AuctionObject key={auction.auctionId} auction={auction} />)
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

    const getBidders = () => {
        axios.get(`http://localhost:4941/api/v1/auctions/${id}/bids`)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setBids(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorFlag(true)
                if (error.toString().includes('404')) {
                    setErrorMessage("NOT FOUND: Auction not found when trying to retrieve bids")
                } else if (error.toString().includes('500')) {
                    setErrorMessage("Something when wrong with the server... Oops our bad")
                } else {
                    setErrorMessage(error.toString())
                }
            })
    }

    const list_of_bidders = () => {
      if (bids.length === 0) {
          return <TableRow hover tabIndex={-1} key={0}>
              <TableCell> <Typography>No bids yet!</Typography></TableCell>
              <TableCell align={"right"}>...</TableCell>
              <TableCell align={"right"}>...</TableCell>
              <TableCell align={"right"}>...</TableCell>
          </TableRow>
      } else{
          return bids.map((row: Bid) =>
              <TableRow hover tabIndex={-1} key={row.bidderId.toString() + row.amount.toString()}>
                  <TableCell align={"right"}>
                      <Grid alignItems={"right"}>
                          <img src={`http://localhost:4941/api/v1/users/${row.bidderId}/image`}
                               onError={({currentTarget}) => {
                                   currentTarget.onerror = null;
                                   currentTarget.src=  "https://via.placeholder.com/150.jpg?text=Default+User+Avatar"}}
                               height={"50px"}
                               width={"50px"}
                          />
                      </Grid>
                  </TableCell>
                  <TableCell align={"right"}>{`${row.firstName} ${row.lastName}`}</TableCell>
                  <TableCell align={"right"}>{`$${row.amount}`}</TableCell>
                  <TableCell align={"right"}>{`${new Date(row.timestamp).toLocaleTimeString('en-NZ')} on ${new Date(auction.endDate).toLocaleDateString()}`}</TableCell>
              </TableRow>
          )
      }
    }

    const getAuction = () => {
        axios.get(`http://localhost:4941/api/v1/auctions/${id}`)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuction(response.data)
                setBid(response.data.highestBid + 1)
                setTitle(response.data.title)
                setDescription(response.data.description)
                if (new Date(response.data.endDate) < new Date()) {
                    setEndDate(new Date(new Date().getTime() + 30 * 60000))
                } else {
                    setEndDate(new Date(response.data.endDate))
                }

                setCategory(response.data.categoryId)
                setReserve(response.data.reserve)
                getSameSellerAuctions(response.data.sellerId)
                getSameCategoryAuctions(response.data.categoryId)

            }, (error) => {
                setErrorFlag(true)
                setErrorFlag(true)
                if (error.toString().includes('400')) {
                    setErrorMessage("BAD REQUEST: Invalid request when retrieving all auctions")
                } else if (error.toString().includes('500')) {
                    setErrorMessage("Something when wrong with the server... Oops our bad")
                } else {
                    setErrorMessage(error.toString())
                }
            })
    }

    const getAuctionImage = () => {
        axios.get(`http://localhost:4941/api/v1/auctions/${id}/image`)
            .then(res => {
                setImageErrorFlag(false)
            }, (error) => {
                setImageErrorFlag(true)
            })
    }

    React.useEffect(() => {
        const getCategories = () => {
            axios.get('http://localhost:4941/api/v1/auctions/categories')
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setCategories(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorFlag(true)
                     if (error.toString().includes('500')) {
                        setErrorMessage("Something when wrong with the server... Oops our bad (retrieving auction categories)")
                    } else {
                        setErrorMessage(error.toString())
                    }
                });
        }
        getAuction()
        getCategories()
        getBidders()
        getAuctionImage()
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
            <h1 style={{textAlign: "left", paddingLeft: "20px"}}>{auction.title}</h1>
            {authToken && userId && parseInt(userId, 10) === auction.sellerId?
                <div>
                    <Button variant={"outlined"}
                            endIcon={<EditIcon/>}
                            onClick={handleEditDialogOpen}
                            disabled={auction.numBids !== 0}>
                        Edit
                    </Button>
                    <Button variant={"outlined"}
                            endIcon={<DeleteIcon/>}
                            onClick={handleDeleteDialogOpen}
                            disabled={auction.numBids !== 0}>
                        Delete
                    </Button>
                    {auction.numBids === 0?"":<Typography variant={"caption"} color={"grey"}>Cannot edit or delete as there is bids on this auction</Typography>}
                </div>
                 : ""}
            <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs={12}>
                    <Card style={{display: "inline-flex", maxWidth: "960px", minWidth: "320px",}}>
                        {imageErrorFlag?
                            <CardMedia
                                component={"img"}
                                height={500}
                                width={500}
                                sx={{objectFit: "cover"}}
                                image={"https://via.placeholder.com/500.jpg?text=No+Auction+Image"}
                                alt={"User avatar image"}
                            /> :
                            <CardMedia
                                component={"img"}
                                height={500}
                                width={500}
                                sx={{objectFit: "cover"}}
                                image={`http://localhost:4941/api/v1/auctions/${id}/image`}
                                alt={"User avatar image"}
                            />}
                    </Card>
                </Grid>
            </Grid>
            <Card variant={"outlined"}>
                <Typography variant={'h5'}>Details</Typography>
                <Card>
                    <Typography variant={"h6"}>Title:</Typography>
                    <Typography variant={"subtitle1"}>{auction.title}</Typography>
                </Card>
                <Card>
                    <Typography variant={"h6"}>Description:</Typography>
                    <Typography variant={"subtitle1"}>{auction.description}</Typography>
                </Card>
                <Card>
                    <Typography variant={"h6"}>End Date:</Typography>
                    <Typography variant={"subtitle1"}>{`${new Date(auction.endDate).toLocaleTimeString('en-NZ')} on ${new Date(auction.endDate).toLocaleDateString()}`}</Typography>
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
                    <img src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}
                         onError={({currentTarget}) => {
                             currentTarget.onerror = null;
                             currentTarget.src=  "https://via.placeholder.com/40.jpg?text=Auction+Seller"}}
                         height={"40px"}
                         width={"40px"}
                    />
                    <CardContent>
                        <Typography style={{display:"inline"}}>{auction.sellerFirstName + " " + auction.sellerLastName}</Typography>
                    </CardContent>
                </Card>
            </Card>
            <Card>
                <Container>
                    <Box
                        sx={{
                            marginTop: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant={"h5"}>Place Bid</Typography>
                        <Box sx={{mt:3}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        disabled={!authToken ||
                                            (userId && parseInt(userId, 10) === auction.sellerId) ||
                                        new Date(auction.endDate) < new Date()? true:false}
                                        InputProps={{startAdornment: <InputAdornment position={"start"}>$</InputAdornment>}}
                                        type={"number"}
                                        value={bid}
                                        onChange={event => setBid(parseInt(event.target.value, 10))}
                                        />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                            disabled={!authToken || (userId && parseInt(userId, 10) === auction.sellerId) ||
                                        bid <= auction.highestBid || bid <= 0 || !bid ||
                                        new Date(auction.endDate) < new Date()? true:false}
                                        onClick={handlePlaceBid}
                                    >Place Bid</Button>
                                </Grid>
                                {/* Display prompt when auction has ended*/}
                                {new Date(auction.endDate) < new Date()?
                                    <Typography variant={"subtitle1"} color={"red"}>The auction is closed. Cannot bid anymore</Typography>: ""}
                                {/*Display prompt when user is not logged in and auction is still active*/}
                                {!authToken && new Date(auction.endDate) > new Date() &&
                                    userId && parseInt(userId, 10) !== auction.sellerId?
                                    <Typography variant={"subtitle1"} color={"red"}>You must be logged in to place a bid</Typography>: ""}
                                {/*Display prompt when user is the same as the auction seller and auction is till active*/}
                                {userId && parseInt(userId, 10) === auction.sellerId && new Date(auction.endDate) > new Date()?
                                    <Typography variant={"subtitle1"} color={"gray"}>Cannot bid on your own auction</Typography>: ""}
                                {/*Display prompt when bid value is not as high as the current bid*/}
                                {bid <= auction.highestBid && authToken && new Date(auction.endDate) > new Date() &&
                                // @ts-ignore
                                parseInt(userId, 10) !== auction.sellerId?
                                    <Typography variant={"subtitle1"} color={"red"}>Bid must be higher than $0 or the current bid</Typography>: ""}

                            </Grid>
                        </Box>
                    </Box>
                </Container>
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
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Delete Auction?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this Auction?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button variant="outlined" color="error" onClick={deleteAuction} autoFocus>
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
                    {"Edit Auction?"}
                </DialogTitle>
                <DialogContent>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="title"
                                            fullWidth
                                            id="title"
                                            label="Auction Title"
                                            value={title}
                                            onChange={event => setTitle(event.target.value)}
                                            autoFocus
                                        />
                                        {title.length === 0 || title.length <= 128? "":
                                            <Typography variant={"caption"} color={'red'}>Title must be no longer than 128 characters</Typography> }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            value={description}
                                            multiline
                                            id="description"
                                            label="Auction Description"
                                            name="description"
                                            onChange={event => setDescription(event.target.value)}
                                        />
                                        {description.length === 0 || description.length <= 2048? "":
                                            <Typography variant={"caption"} color={'red'}>Description must be no longer than 2048 characters</Typography> }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id={"category-select-label"}>Categories *</InputLabel>
                                            <Select
                                                labelId={"category-select-label"}
                                                id={"category-select-box"}
                                                value={category}
                                                // @ts-ignore
                                                onChange={event => setCategory(event.target.value)}
                                                label={"Category"}
                                                required
                                            >
                                                {categories.map((category) => (
                                                    <MenuItem value={category.categoryId}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <DatePicker
                                            selected={endDate}
                                            minDate={new Date()}
                                            onChange={(date) => setEndDate(date)}
                                            showTimeSelect
                                            filterTime={filterPassedTime}
                                            timeIntervals={1}
                                            dateFormat={"MMMM d, yyyy h:mm aa"}
                                            placeholderText={"Select the auction end date *"}
                                        />
                                        {endDate? "" : <Typography variant={"caption"} color={"red"}>Select an auction end date</Typography>}
                                        {/*// @ts-ignore*/}
                                        {endDate > new Date()? "":
                                            <Typography variant={"caption"} color={"red"}>Auction end date must be in the future</Typography> }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            value={reserve}
                                            type={"number"}
                                            label={"Reserve"}
                                            id={'reserve'}
                                            InputProps={{startAdornment: <InputAdornment position={"start"}>$</InputAdornment>}}
                                            onChange={event => setReserve(parseInt(event.target.value))}
                                        />
                                        {reserve < 1 ? <Typography color={"red"}>Reserve must be 1 or above</Typography>:""}
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            <input
                                                type="file"
                                                // @ts-ignore
                                                onChange={(event => setImage(event.target.files[0]))}
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={reserve > 1 && title.length <= 128 && description.length <= 2048? false: true}
                                    onClick={() => {editAuction()}}
                                >
                                    Edit Auction
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                autoHideDuration={6000}
                open={snackOpen}
                onClose={handleSnackClose}
                key={snackMessage}
            >
                <Alert onClose={handleSnackClose} severity="success" sx={{
                    width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default Auction;