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
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [userId, setUserId] = React.useState(-1);
    const [auth, setAuth] = React.useState("");
    const navigate = useNavigate();

    const loginUser = () => {
        axios.post('http://localhost:4941/api/v1/users/login', {email: values.email, password: values.password})
            .then((res) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuth(res.data.token)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString() + ". If Error Code 400 then system had a problem automatically logging in after registering")
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
            setUserId(res.data.userId)
            loginUser()
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString() + ". If Error Code 403 then email is already registered, try a different one.")
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
                        {/*<Grid xs={12} >*/}
                        {/*    <Button*/}
                        {/*        variant="contained"*/}
                        {/*        component="label"*/}
                        {/*    >*/}
                        {/*        Upload File*/}
                        {/*        <input*/}
                        {/*            type="file"*/}
                        {/*            hidden*/}
                        {/*        />*/}
                        {/*    </Button>*/}
                        {/*</Grid>*/}
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