import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {
    Button,
    Checkbox, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, FormLabel,
    InputLabel,
    ListItemText,
    OutlinedInput, Radio, RadioGroup,
    Select
} from "@mui/material";
import {useNavigate} from "react-router-dom";
const Navbar = () => {
    const [auth, setAuth] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [loginDialog, setLoginDialog] = React.useState(false);
    const navigate = useNavigate();

    const handleAccountClick = () => {
        if (auth) {
            // Open account dialog
        } else {
            //Open Login/Register Dialog
            openLoginDialog()
        }
    }

    const handleLoginDialogClose = () => {
        setLoginDialog(false)
    }

    const openLoginDialog = () => {
        setLoginDialog(true)
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <FormGroup>
            </FormGroup>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Me Trade
                    </Typography>
                    {auth && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleAccountClick}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Dialog
                open={loginDialog}
                onClose={handleLoginDialogClose}
                aria-labelledby="login-dialog"
                aria-describedby="Dialog used to log users into their accounts">
                <DialogTitle id="login-dialog">
                    {"Login"}
                </DialogTitle>
                <DialogContent>
                    <FormControl sx={{ m: 1, width: 400 }}>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLoginDialogClose}>Cancel</Button>
                    <Button variant="outlined" color="success" onClick={() => navigate('/register/')} autoFocus>
                        Sign up
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default Navbar;