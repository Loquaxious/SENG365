import React from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Card,
    InputAdornment, Link, OutlinedInput,
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
    const [image, setImage] = React.useState<File | null>()
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
      console.log(resultDict);
      return resultDict
    }

    const deleteImage = () => {
        axios.delete(`http://localhost:4941/api/v1/users/${id}/image`, {
            // @ts-ignore
            headers: {'X-Authorization': authToken}})
            .then(res => {
                setErrorFlag(false)
                setErrorMessage("")
            }, error => {
                setErrorFlag(true)
                if (error.toString().includes(401)) {
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

    React.useEffect(() => {
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
        getUser()
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
                    <Card style={{display: "flex", maxWidth: "1000px", minWidth: "320px", alignSelf: "center"}}>
                        <img src={`http://localhost:4941/api/v1/users/${id}/image`}
                             onError={({currentTarget}) => {
                                 currentTarget.onerror = null;
                                 currentTarget.src=  "https://via.placeholder.com/500.png?text=User+Avatar"}}
                             height={500}
                             width={500}
                        />
                    </Card>
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
                                    marginTop: 8,
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
                                            />
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
                                        <Grid xs={12} >
                                            <Button
                                                variant="contained"
                                                component="label"
                                            >Upload new Image
                                                <input
                                                    type="file"
                                                    accept={"image/gif|image/jpeg|image/png"}
                                                    // @ts-ignore
                                                    onChange={(event => setImage(event.target.files[0]))}
                                                />
                                            </Button>
                                            <Button
                                                variant={"contained"}
                                                component={'label'}
                                                onClick={deleteImage}
                                                >Delete Current Image</Button>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={values.password.length === 0 || (values.password.length >= 6 && currentPassword.length !== 0)? false : true}
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
        </div>

    )
}
export default User;