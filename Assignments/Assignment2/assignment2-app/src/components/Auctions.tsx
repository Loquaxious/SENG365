import React from "react";
import axios from 'axios';
import CSS from 'csstype';
import {useAuctionStore} from "../store";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Paper,
    Alert,
    AlertTitle,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    OutlinedInput,
    MenuItem,
    Checkbox,
    ListItemText,
    FormLabel,
    RadioGroup, FormControlLabel, Radio, NativeSelect, Pagination, Card, Grid
} from "@mui/material";
import AuctionObject from "./AuctionObject";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AuctionsNavBar from "./AuctionsNavbar";

const Auctions = () => {
    const auctions = useAuctionStore(state => state.auctions)
    const setAuctions = useAuctionStore(state => state.setAuctions)
    const [count, setCount] = React.useState(0)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [categoryNames, setCategoryNames] = React.useState<string[]>([])
    const [categories, setCategories] = React.useState<Category[]>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [openFilterDialog, setOpenFilterDialog] = React.useState(false)
    const [openClosedAuctions, setOpenClosedAuctions] = React.useState("both")
    const [sortBy, setSortBy] = React.useState("CLOSING_SOON")
    const [pageNum, setPageNum] = React.useState(1)

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(event.target.value)
    }

    const handleOpenClosedAuctions = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOpenClosedAuctions((event.target as HTMLInputElement).value)
    }

    const handleFilterDialogClose = () => {
        setOpenFilterDialog(false)
    }

    const handleKeyDownSearch = (event: any) => {
        if (event.key ==='Enter') {
            queryAuctions(pageNum)
        }
    }

    const handleCategoryChange = (event: SelectChangeEvent<typeof categoryNames>) => {
        const {
            target: {value},
        } = event;
        setCategoryNames(
            typeof value === 'string' ? value.split(",") : value,
        );
    }

     const categoryIdFromName = () => {
        let categoryQueryString = ""
        let first = true;
        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < categoryNames.length; j++) {
                if (categories[i].name === categoryNames[j]) {
                    if (first){
                        first = false
                        categoryQueryString += "categoryIds=" + categories[i].categoryId
                    } else {
                        categoryQueryString += "&categoryIds=" + categories[i].categoryId
                    }
                }
            }
        }
        return categoryQueryString
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

    const queryAuctions = (pageNum:number, filterQuery: string = "") => {
        const startIndex = (pageNum - 1) * 10
        if (searchQuery.length !== 0) {
            if (filterQuery.length !== 0 ) {
                axios.get(`http://localhost:4941/api/v1/auctions?q=${searchQuery}&${filterQuery}&sortBy=${sortBy}&count=10&startIndex=${startIndex}`)
                    .then((response) => {
                        setErrorFlag(false)
                        setErrorMessage("")
                        setAuctions(response.data.auctions)
                        setCount(response.data.count)
                    },(error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.toString())
                    })
            } else {
                axios.get(`http://localhost:4941/api/v1/auctions?q=${searchQuery}&sortBy=${sortBy}&count=10&startIndex=${startIndex}`)
                    .then((response) => {
                        setErrorFlag(false)
                        setErrorMessage("")
                        setAuctions(response.data.auctions)
                        setCount(response.data.count)
                    },(error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.toString())
                    })
            }
        } else if (filterQuery.length !== 0) {
            axios.get(`http://localhost:4941/api/v1/auctions?${filterQuery}&sortBy=${sortBy}&count=10&startIndex=${startIndex}`)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setAuctions(response.data.auctions)
                    setCount(response.data.count)
                },(error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        } else {
            axios.get(`http://localhost:4941/api/v1/auctions?sortBy=${sortBy}&count=10&startIndex=${startIndex}`)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setAuctions(response.data.auctions)
                    setCount(response.data.count)
                },(error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }

    React.useEffect(() => {
        const getAuctions = () => {
            axios.get(`http://localhost:4941/api/v1/auctions?count=10&startIndex=${0}`)
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

    const auction_rows = () => {
        if (openClosedAuctions === 'both') {
            return auctions.map((auction: Auction) =>
                <AuctionObject key={auction.auctionId} auction={auction}/>)
        } else {
            const currentDate = new Date()
            if (openClosedAuctions === 'active') {
                return auctions.map((auction: Auction) => {
                    const endDate = new Date(auction.endDate)
                    const daysLeft = Math.floor(Math.ceil(endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
                    if (daysLeft >= 0) {
                       return <AuctionObject key={auction.auctionId} auction={auction}/>
                    }
                })

            } else if (openClosedAuctions === 'closed'){
                return auctions.map((auction: Auction) => {
                    const endDate = new Date(auction.endDate)
                    const daysLeft = Math.floor(Math.ceil(endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
                    if (daysLeft < 0) {
                        return <AuctionObject key={auction.auctionId} auction={auction}/>
                    }
                })
            }
        }
    }

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <div>
            {AuctionsNavBar()}
            <h1 style={{textAlign: "left", paddingLeft: "20px"}}>Auctions</h1>
            <TextField
                   id={"search-bar"}
                   value={searchQuery}
                   onChange={(event) => setSearchQuery(event.target.value)}
                   InputProps={{startAdornment: <InputAdornment position={"start"}><SearchIcon/></InputAdornment>}} onKeyDown={(event) => handleKeyDownSearch(event)}/>
            <Button variant={"outlined"} onClick={() => queryAuctions(pageNum)}>Search</Button>
            <Button variant={"outlined"} onClick={() => {
                setOpenFilterDialog(true)
                getCategories()
            }
            }><FilterListIcon/>Filter</Button>
            <FormControl>
                <FormLabel id={"sort-label"}>Sort</FormLabel>
                <NativeSelect
                    defaultValue={"CLOSING_SOON"}
                    inputProps={{name: 'Sort By', id: "sort-box", onChange: event => handleSortChange(event)}}
                    >
                    <option value={"ALPHABETICAL_ASC"}>Alphabetically (A to Z)</option>
                    <option value={"ALPHABETICAL_DESC"}>Alphabetically (Z to A)</option>
                    <option value={"BIDS_ASC"}>Current bid (lowest to highest)</option>
                    <option value={"BIDS_DESC"}>Current bid (highest to lowest)</option>
                    <option value={"RESERVE_ASC"}>Reserve price (lowest to highest)</option>
                    <option value={"RESERVE_DESC"}>Reserve price (highest to lowest)</option>
                    <option value={"CLOSING_LAST"}>Closing Date (last to first)</option>
                    <option value={"CLOSING_SOON"}>Closing Date (first to last)</option>
                </NativeSelect>
                <Button variant={"outlined"} onClick={() => queryAuctions(pageNum)}>Sort</Button>
            </FormControl>
            <Grid container spacing={2} alignItems={"center"}>
                <Paper elevation={3} style={card}>
                    {errorFlag? "": <Card>{`Displaying ${(10 * (pageNum - 1)) + 1}-${pageNum * 10 > count? count: pageNum * 10} of ${count} auctions:`}</Card>}
                    <div style={{display:"inline-block", maxWidth:"1920px", minWidth:"320"}}>
                        {errorFlag?
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorMessage}
                            </Alert>
                            :""}
                        {auction_rows()}
                    </div>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Pagination count={Math.ceil(count / 10)} page={pageNum}
                                    onChange={(event, page) => {
                                        setPageNum(page)
                                        queryAuctions(page)}}/>
                    </div>
                </Paper>
            </Grid>
            <Dialog
                open={openFilterDialog}
                onClose={handleFilterDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Filter Auctions"}
                </DialogTitle>
                <DialogContent>
                    <FormControl sx={{ m: 1, width: 400 }}>
                        <InputLabel id={"category-select-label"}>Categories</InputLabel>
                        <Select
                            labelId={"category-select-label"}
                            id={"category-select-box"}
                            multiple
                            value={categoryNames}
                            onChange={handleCategoryChange}
                            input={<OutlinedInput label="Categories" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            >
                            {categories.map((category) => (
                                <MenuItem key={category.categoryId} value={category.name}>
                                    <Checkbox checked={categoryNames.indexOf(category.name) > -1}/>
                                    <ListItemText primary={category.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel id="open-closed-auctions-label">Auctions that are Active/Closed</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="open-closed-auctions-label"
                            name="open-closed-auctions-radio-buttons-group"
                            value={openClosedAuctions}
                            onChange={handleOpenClosedAuctions}
                        >
                            <FormControlLabel value="both" control={<Radio />} label="Both" />
                            <FormControlLabel value="active" control={<Radio />} label="Only Active auctions" />
                            <FormControlLabel value="closed" control={<Radio />} label="Only Closed auctions" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterDialogClose}>Cancel</Button>
                    <Button variant="outlined" color="success" onClick={() => {
                        queryAuctions(pageNum, categoryIdFromName())
                        handleFilterDialogClose()
                    }} autoFocus>
                        Filter
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Auctions;