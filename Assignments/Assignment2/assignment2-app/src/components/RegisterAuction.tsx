import * as React from "react";
import Container from "@mui/material/Container";
import axios from "axios";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Navbar from "./Navbar";
import {
    Alert,
    AlertTitle,
    FormControl,
    InputAdornment,
    InputLabel, Link,
    MenuItem,
    Select,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker";
import {useNavigate} from "react-router-dom";

const RegisterAuction = () => {
    let authToken = localStorage.getItem('token')
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [auctionTitle, setAuctionTitle] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [endDate, setEndDate] = React.useState<Date|null>(null);
    const [description, setDescription] = React.useState("");
    const [reserve, setReserve] = React.useState<number>(NaN);
    const [image, setImage] = React.useState<File | null>();
    const navigate = useNavigate();

    const uploadImage = (auctionId: number) => {
        axios.put(`http://localhost:4941/api/v1/auctions/${auctionId}/image`, image, {
            // @ts-ignore
            headers: {'X-Authorization': authToken, 'Content-Type': image['type']}})
            .then((res) => {
            }, (error) => {
                setErrorFlag(true)
                if (error.toString().includes('404')) {
                    setErrorMessage("ERROR: Auction not found when uploading image")
                } else {
                    setErrorMessage("ERROR: When uploading image: " + errorMessage.toString())
                }
            })
    }

    const filterPassedTime = (time: Date) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();
    };

    const prepareAuctionData = () => {
        if (!isNaN(reserve)) {
            return {
                title: auctionTitle,
                categoryId: category,
                endDate: endDate?.toISOString().slice(0, 19).replace('T', ' '),
                description: description,
                reserve: reserve
            }
        } else {
            return {
                title: auctionTitle,
                categoryId: category,
                endDate: endDate?.toISOString().slice(0, 19).replace('T', ' '),
                description: description
            }
        }
    }

    const handleSubmit = () => {
        axios.post(`http://localhost:4941/api/v1/auctions`, prepareAuctionData(), {
            // @ts-ignore
            headers: {'X-Authorization': authToken}})
            .then((res) => {
                setErrorFlag(false);
                setErrorMessage("");
                if (image) {
                    uploadImage(res.data.auctionId)
                }
                navigate(`/auctions/${res.data.auctionId}`)
            }, (error) => {
                setErrorFlag(true);
                if(error.toString().includes('400')) {
                    setErrorMessage("BAD REQUEST: Invalid input in one of the form fields")
                } else if (error.toString().includes('401')) {
                    setErrorMessage("FORBIDDEN: Invalid authentication token (Must be logged in the create a auction)")
                } else if (error.toString().includes('403')) {
                    setErrorMessage("FORBIDDEN: Auction title already taken, change it slightly")
                } else if (error.toString().includes('500')) {
                    setErrorMessage("ERROR: Something when wrong with the server... Oops our bad")
                } else {
                    setErrorMessage(error.toString())
                }
            })
    }

    const theme = createTheme()

    React.useEffect(() => {
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
        getCategories()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            {!authToken?
                <div>
                    {Navbar()}
                    <h1>Unauthorised:</h1>
                    <h2>Must be logged in to register Auction</h2>
                    <Link href={'http://localhost:8080/auctions'}>Back to Auctions</Link>
                </div> :
                <div>
                    {Navbar()}
                    {errorFlag?
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                        :""}
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography component="h1" variant="h5">
                                Register Auction
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="title"
                                            required
                                            fullWidth
                                            id="title"
                                            label="Auction Title"
                                            onChange={event => setAuctionTitle(event.target.value)}
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            multiline
                                            id="description"
                                            label="Auction Description"
                                            name="description"
                                            onChange={event => setDescription(event.target.value)}
                                        />
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
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            type={"number"}
                                            label={"Reserve"}
                                            id={'reserve'}
                                            InputProps={{startAdornment: <InputAdornment position={"start"}>$</InputAdornment>}}
                                            onChange={event => setReserve(parseInt(event.target.value))}
                                        />
                                        {reserve !== NaN && reserve < 1 ? <Typography color={"red"}>Reserve must be 1 or above</Typography>:""}
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
                                    disabled={!endDate || endDate < new Date() || reserve < 1 || auctionTitle.length === 0 ||
                                    description.length === 0 || category === ""? true: false}
                                    onClick={() => {handleSubmit()}}
                                >
                                    Register Auction
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </div>
            }
        </ThemeProvider>
    )
}
export default RegisterAuction;