import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Alert, AlertTitle, InputAdornment, OutlinedInput} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import Navbar from "./Navbar";
import {useNavigate} from "react-router-dom";
import ReactImageUploading from "react-images-uploading";

interface State {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    showPassword: boolean;
}

const Register = () => {
    const [values, setValues] = React.useState<State>({
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        showPassword: false,
    });
    const [image, setImage] = React.useState<File|null>();
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const navigate = useNavigate();

    const loginUser = (email: FormDataEntryValue | null, password: FormDataEntryValue | null) => {
        if (email && password) {
            axios.post('http://localhost:4941/api/v1/users/login', {email: email, password: password})
                .then((res) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    localStorage.setItem('token', res.data.token)
                }, (error) => {
                    setErrorFlag(true)
                    if (error.toString().includes("400")) {
                        setErrorMessage("BAD Request: Invalid data input into fields")
                    } else if (error.toString().includes("500")) {
                        setErrorMessage("ERROR: Something when wrong with the server... Oops our bad")
                    } else {
                        setErrorMessage(error.toString())
                    }
                })
        } else {
            setErrorFlag(true)
            setErrorMessage("ERROR: Logging in User after register. Email or password is null")
        }

    }

    const uploadImage = (userId: number) => {
        axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, image, {
            // @ts-ignore
            headers: {'X-Authorization': authToken, 'Content-Type': image['type']}})
            .then((res) => {
            }, (error) => {
                setErrorFlag(true)
                if (error.toString().includes('404')) {
                    setErrorMessage("ERROR: User not found when uploading image")
                } else {
                    setErrorMessage("ERROR: When uploading image: " + errorMessage.toString())
                }
            })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios.post('http://localhost:4941/api/v1/users/register', {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            password: data.get('password'),
        }).then((res) => {
            setErrorFlag(false)
            setErrorMessage("")
            localStorage.setItem('user', res.data.userId)
            if (image) {
                uploadImage(res.data.userId)
            }
            loginUser(data.get('email'), data.get('password'))
            navigate('/auctions/')
        }, (error) => {
            setErrorFlag(true)
            if (error.toString().includes("400")) {
                setErrorMessage("BAD Request: Invalid data input into fields")
            } else if (error.toString().includes("403")) {
                setErrorMessage("FORBIDDEN: Email is already registered")
            } else if (error.toString().includes("500")) {
                setErrorMessage("ERROR: Something when wrong with the server... Oops our bad")
            } else {
                setErrorMessage(error.toString())
            }
        })
    };

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [prop]: event.target.value });
        };

    const handleClickShowPassword = () => {

        setValues({
            ...values,
            // @ts-ignore
            showPassword: !values.showPassword,
        });
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const theme = createTheme()

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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <OutlinedInput
                                required
                                fullWidth
                                name="password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                id="password"
                                autoComplete="new-password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {values.password.length >= 6? "" : <Typography variant={"caption"} color={"red"}>Password must be longer than 6 characters</Typography>}
                        </Grid>
                        <Grid xs={12} >
                            <Button
                                variant="contained"
                                component="label"
                            >
                                <input
                                    type="file"
                                    accept={"image/gif|image/jpeg|image/png"}
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
                        disabled={values.password.length >= 6? false : true}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="http://localhost:8080/login/" variant="body2">
                                Already have an account? Login
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
    )
}
export default Register;