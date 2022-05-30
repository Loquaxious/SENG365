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
    password: string;
    email: string;
    showPassword: boolean;
}

const Login = () => {
    const [values, setValues] = React.useState<State>({
        password: "",
        email: "",
        showPassword: false,
    });
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios.post('http://localhost:4941/api/v1/users/login', {
            email: data.get('email'),
            password: data.get('password'),
        }).then((res) => {
            setErrorFlag(false)
            setErrorMessage("")
            localStorage.setItem('user', res.data.userId)
            localStorage.setItem('token', res.data.token)
            navigate('/auctions/')
        }, (error) => {
            setErrorFlag(true)
            if (error.toString().includes("400")) {
                setErrorMessage("BAD REQUEST: Invalid login details")
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
                        Login
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={handleChange("email")}
                                />
                                {values.email.length === 0 || values.email.match("@")? "":
                                    <Typography variant={"caption"} color={"red"}>Email must have a "@" symbol </Typography>}
                                {values.email.length === 0 || values.email.length <= 128? "":
                                    <Typography variant={"caption"} color={"red"}>Email must be no longer than 128 characters</Typography>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handleChange('password')}
                                    id="password"
                                    autoComplete="new-password"
                                    InputProps={{endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>}}
                                    label="Password"
                                />
                                {values.password.length == 0 || values.password.length >= 6? "" :
                                    <Typography variant={"caption"} color={"red"}>Password must be longer than 6 characters</Typography>}
                                {values.password.length == 0 || values.password.length <= 256? "" :
                                    <Typography variant={"caption"} color={"red"}>Password must be no longer than 256 characters</Typography>}
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!(values.email.length === 0 && values.email.length <= 128 && values.email.match("@")) &&
                            (values.password.length === 0 && values.password.length <= 256)}
                        >
                            Login
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="http://localhost:8080/register/" variant="body2">
                                    Dont have an account? Sign up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
export default Login;