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
    InputLabel,
    Select,
    SelectChangeEvent,
    OutlinedInput,
    MenuProps,
    MenuItem,
    Checkbox,
    ListItemText,
    FormLabel,
    RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import AuctionObject from "./Auction";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const Auctions = () => {
    const auctions = useAuctionStore(state => state.auctions)
    const setAuctions = useAuctionStore(state => state.setAuctions)
    const [count, setCount] = React.useState(0)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [categoryNames, setCategoryNames] = React.useState<string[]>([])
    const [categories, setCategories] = React.useState<Category[]>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [filterQuery, setFilterQuery] = React.useState("")
    const [openFilterDialog, setOpenFilterDialog] = React.useState(false)
    const [openClosedAuctions, setOpenClosedAuctions] = React.useState("both")

    const handleOpenClosedAuctions = (event: any) => {
        setOpenClosedAuctions(event.target.value)
    }

    // TODO solve the filter. You have to double click to make work and buggy when closing the dialog
    const handleFilterDialogClose = () => {
        setOpenFilterDialog(false)
    }

    const handleKeyDownSearch = (event: any) => {
        if (event.key ==='Enter') {
            queryAuctions()
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
        setFilterQuery(filterQuery + categoryQueryString)
    }

    const getCategories = () => {
      axios.get('http://localhost:4941/api/v1/auctions/categories')
          .then((response) => {
              setCategories(response.data)
          }, (error) => {
              setErrorFlag(true)
              setErrorMessage(error.toString())
          });
    }

    const queryAuctions = () => {
        if (searchQuery.length != 0) {
            axios.get('http://localhost:4941/api/v1/auctions?q=' + searchQuery + filterQuery)
                .then((response) => {
                    setAuctions(response.data.auctions)
                    setCount(response.data.count)
                },(error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        } else {
            axios.get('http://localhost:4941/api/v1/auctions?' + filterQuery)
                .then((response) => {
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
            <h1 style={{textAlign: "left", paddingLeft: "20px"}}>Auctions</h1>
            <TextField
                   id={"search-bar"}
                   value={searchQuery}
                   onChange={(event) => setSearchQuery(event.target.value)}
                   InputProps={{startAdornment: <InputAdornment position={"start"}><SearchIcon/></InputAdornment>}} onKeyDown={(event) => handleKeyDownSearch(event)}/>
            <Button variant={"outlined"} onClick={() => queryAuctions()}>Search</Button>
            <Button variant={"outlined"} onClick={() => {
                setOpenFilterDialog(true)
                getCategories()
            }
            }><FilterListIcon/> Filter</Button>
            <Paper elevation={3} style={card}>
                {errorFlag? "": `Displaying ${count} auctions:`}
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
                        categoryIdFromName()
                        queryAuctions()
                    }} autoFocus>
                        Filter
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}

export default Auctions;