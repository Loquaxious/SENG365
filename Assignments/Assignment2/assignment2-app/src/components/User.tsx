import React from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Card, CardMedia,
    InputAdornment, Link, OutlinedInput, Snackbar,
    Typography
} from "@mui/material";
import Navbar from "./Navbar";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

interface EditState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    showPassword: boolean;
}

const User = () => {
    const {id} = useParams();
    const userId = localStorage.getItem('user');
    const authToken = localStorage.getItem('token');
    const [user, setUser] = React.useState<User>({firstName:"", lastName:"", email:""});
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [image, setImage] = React.useState<File | null>();
    const [userImageErrorFlag, setUserImageErrorFlag] = React.useState(false)
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };
    const [values, setValues] = React.useState<EditState>({
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        showPassword: false,
    });

    const prepareEditData = (firstName: string, lastName: string, email: string, password: string, currentPassword: string) => {
      const resultDict = {};
      const editDict = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          currentPassword: currentPassword
      };

      for (let key in editDict) {
          // @ts-ignore
          if (editDict[key]){
              // @ts-ignore
              if (editDict[key].length !== 0) {
                  // @ts-ignore
                  resultDict[key] = editDict[key]
              }
          }

      }
      return resultDict
    }

    const deleteImage = () => {
        axios.delete(`http://localhost:4941/api/v1/users/${id}/image`, {
            // @ts-ignore
            headers: {'X-Authorization': authToken}})
            .then(res => {
                setErrorFlag(false)
                setErrorMessage("")
                setSnackMessage("Successfully deleted your avatar image")
                setSnackOpen(true)
                getUserImage()
            }, error => {
                setErrorFlag(true)
                if (error.toString().includes('401')) {
                    setErrorMessage('ERROR: Invalid authorisation token')
                } else if (error.toString().includes('403')) {
                    setErrorMessage("FORBIDDEN: Invalid authorization token")
                } else if (error.toString().includes('404')) {
                    setErrorMessage("ERROR: No image or user found")
                } else if (error.toString().includes('500')) {
                    setErrorMessage("ERROR: Something when wrong with the server... Oops our bad")
                } else {
                    setErrorMessage(error.toString())
                }
            })
    }

    const uploadImage = () => {
        // @ts-ignore
        console.log(image['type'])
        axios.put(`http://localhost:4941/api/v1/users/${id}/image`, image, {
            // @ts-ignore
            headers: {'X-Authorization': authToken, 'Content-Type': image['type']}})
            .then((res) => {
                setSnackMessage("New image successfully changed")
                setSnackOpen(true)
                setImage(null)
                getUserImage()
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
        console.log(data.has('currentPassword'))
        // @ts-ignore
        const editData = prepareEditData(data.get('firstName'), data.get('lastName'), data.get('email'), data.get('password'), currentPassword)
        axios.patch(`http://localhost:4941/api/v1/users/${id}`, editData,{
            // @ts-ignore
            headers: {'X-Authorization': authToken}
        }).then((res) => {
            setErrorFlag(false)
            setErrorMessage("")
            if (image) {
                uploadImage()
            }
            setSnackMessage("User details successfully changed")
            setSnackOpen(true)
            getUser()
        }, (error) => {
            setErrorFlag(true)
            if (error.toString().includes('400')) {
                setErrorMessage('BAD REQUEST: Invalid values in one or more of the fields')
            } else if (error.toString().includes('403')) {
                setErrorMessage("FORBIDDEN: Invalid authorization token")
            } else if (error.toString().includes('404')) {
                setErrorMessage("ERROR: User not found")
            } else if (error.toString().includes('500')) {
                setErrorMessage("ERROR: Something when wrong with the server... Oops our bad")
            } else {
                setErrorMessage(error.toString())
            }
        })
    };

    const handleChange =
        (prop: keyof EditState) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [prop]: event.target.value });
        };


    const getUserImage = () => {
        axios.get(`http://localhost:4941/api/v1/users/${id}/image`)
            .then(res => {
                setUserImageErrorFlag(false)
            }, (error) => {
                setUserImageErrorFlag(true)
            })
    }

    const getUser = () => {
        axios.get(`http://localhost:4941/api/v1/users/${id}`, {
            // @ts-ignore
            headers: {'X-Authorization': authToken}
        }).then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setUser(response.data)
        }, (error) => {
            setErrorFlag(true)
            if (error.toString().includes("403")) {
                setErrorMessage("FORBIDDEN: Invalid authorisation token for this user")
            } else if (error.toString().includes("404")) {
                setErrorMessage("ERROR: User not found")
            } else if (error.toString().includes("500")) {
                setErrorMessage("ERROR: Something when wrong with the server... Oops our bad")
            } else {
                setErrorMessage(error.toString())
            }
        })
    }

    React.useEffect(() => {
        getUser()
        getUserImage()
    }, [id])

    return (
        <div>
            {authToken && id === userId?
                <div>
                    {Navbar()}
                    {errorFlag?
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                        :""}
                    <h1>{user.firstName + " " + user.lastName}</h1>
                    <Grid container spacing={2} alignItems={"center"}>
                        <Grid item xs={12}>
                            <Card style={{display: "inline-flex", maxWidth: "960px", minWidth: "320px",}}>
                                {userImageErrorFlag?
                                    <CardMedia
                                        component={"img"}
                                        height={500}
                                        width={500}
                                        sx={{objectFit: "cover"}}
                                        image={"https://via.placeholder.com/500.png?text=No+User+Avatar"}
                                        alt={"User avatar image"}
                                    /> :
                                    <CardMedia
                                        component={"img"}
                                        height={500}
                                        width={500}
                                        sx={{objectFit: "cover"}}
                                        image={`http://localhost:4941/api/v1/users/${id}/image`}
                                        alt={"User avatar image"}
                                    />}
                            </Card>
                        </Grid>
                    </Grid>
                    <Card variant={"outlined"}>
                        <Typography variant={'h5'}>User Details</Typography>
                        <Card>
                            <Typography variant={"h6"}>First Name:</Typography>
                            <Typography variant={"subtitle1"}>{user.firstName}</Typography>
                        </Card>
                        <Card>
                            <Typography variant={"h6"}>Last Name:</Typography>
                            <Typography variant={"subtitle1"}>{user.lastName}</Typography>
                        </Card>
                        <Card>
                            <Typography variant={"h6"}>Email:</Typography>
                            <Typography variant={"subtitle1"}>{user.email}</Typography>
                        </Card>
                    </Card>
                    <Card>
                        <Typography variant={'h5'}>Edit Details</Typography>
                        <Container component="main" maxWidth="xs">
                            <CssBaseline />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                name="firstName"
                                                fullWidth
                                                autoComplete="new-password"
                                                id="firstName"
                                                label="First Name"
                                                autoFocus
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                autoComplete="new-password"
                                                id="lastName"
                                                label="Last Name"
                                                name="lastName"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                autoComplete="new-password"
                                                id="email"
                                                label="Email Address"
                                                name="email"
                                                onChange={handleChange('email')}
                                            />
                                            {values.email.length === 0 || values.email.match("@")?"":
                                                <Typography variant={"caption"} color={"red"}>Email must include a "@"</Typography>
                                            }
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                type={"password"}
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange('password')}
                                                id="password"
                                                autoComplete="new-password"
                                                label="New Password"
                                            />
                                            {values.password.length === 0 || values.password.length >= 6? "" : <Typography variant={"caption"} color={"red"}>Password must be longer than 6 characters</Typography>}
                                        </Grid>
                                        {values.password.length !== 0?
                                            <Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        name="current-password"
                                                        value={currentPassword}
                                                        type={"password"}
                                                        onChange={(event) => setCurrentPassword(event.target.value)}
                                                        id="currentPassword"
                                                        autoComplete="new-password"
                                                        label="Current Password"
                                                    />
                                                </Grid>
                                                {currentPassword.length !== 0? "": <Typography variant={"caption"} color={"red"}>You must enter your current password to change your password</Typography>}
                                            </Grid>
                                            : ""}
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                disabled={image?true:false}
                                            >Upload new Image
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept={"image/gif|image/jpeg|image/png"}

                                                    onChange={(event => {
                                                        // @ts-ignore
                                                        setImage(event.target.files[0])
                                                        // @ts-ignore
                                                        setSnackMessage(`Image: ${event.target.files[0].name} uploaded`)
                                                        setSnackOpen(true)})}
                                                />
                                            </Button>
                                            {image?<Typography variant={"caption"} color={"grey"}>Cannot upload another image</Typography>:""}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                variant={"contained"}
                                                color={"error"}
                                                component={'label'}
                                                disabled={userImageErrorFlag}
                                                onClick={deleteImage}
                                                >Delete Current Image</Button>
                                            {userImageErrorFlag?<Typography variant={"caption"} color={"grey"}>You do not have an image</Typography>:""}
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={(values.email.length !== 0 && !values.email.match("@")) ||
                                        (values.password.length !== 0 && ((values.password.length <= 6 || currentPassword.length === 0)))
                                         ? true : false}
                                    >
                                        Update Details
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </Card>
                </div>
                : <div>
                    <h1>Unauthorised</h1>
                    <Link href={'http://localhost:8080/auctions'}>Back to Auctions</Link>
                </div> }
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
export default User;