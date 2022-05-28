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
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {DateTimePickerComponent} from "@syncfusion/ej2-react-calendars";


const RegisterAuction = () => {
    let authToken = localStorage.getItem('token')
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");;
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [auctionTitle, setAuctionTitle] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [reserve, setReserve] = React.useState(NaN);
    const [image, setImage] = React.useState<File | null>();

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

    const handleSubmit = () => {
        console.log(auctionTitle)
        console.log(category)
        console.log(endDate)
        console.log(description)
        console.log(reserve)
        axios.post(`http://localhost:4941/api/v1/auctions`, {
            title: auctionTitle,
            category: category,
            endDate: endDate,
            description: description,
            reserve: reserve
        }, {
            // @ts-ignore
            headers: {'X-Authorization': authToken}})
            .then((res) => {
                setErrorFlag(false);
                setErrorMessage("");
                if (image) {
                    uploadImage(res.data.autionId)
                }
            }, (error) => {
                setErrorFlag(true);
                if(error.toString().includes('400')) {
                    setErrorMessage("BAD REQUEST: Invalid input in one of the form fields")
                } else if (error.toString().includes('401')) {
                    setErrorMessage("FORBIDDEN: Invalid authentication token (Must be logged in the create a auction)")
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
                                <DateTimePickerComponent
                                    placeholder={"Select auction end date and time *"}
                                    min={new Date()}
                                    step={1}
                                    onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setEndDate(event.target.value)}
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
                            <Grid xs={12} >
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
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
                            disabled={!endDate || endDate.length === 0 || reserve < 1 || auctionTitle.length === 0 ||
                            description.length === 0 || category === ""? true: false}
                            onClick={() => handleSubmit}
                        >
                            Register Auction
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
export default RegisterAuction;