import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {useNavigate} from "react-router-dom";
import {
    Button,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';


const AuctionsNavbar = () => {
    let userId = localStorage.getItem('user')
    let authToken = localStorage.getItem('token')
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);;
    const navigate = useNavigate();

    const handleAddAuction = () => {
        navigate('/auctions/register/')
    }

    const handleLoginClick = () => {
        navigate('/login/')
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {

    };

    const handleLogoutClick = () => {
        setAnchorEl(null);
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/auctions/')
    }

    const handleProfileClick = () => {
        setAnchorEl(null);
        navigate(`/user/${userId}`)
    }



    return (
        <Box sx={{ flexGrow: 1 }}>
            <FormGroup>
            </FormGroup>
            <AppBar position="static">
                <Toolbar>
                    {authToken? <div>
                        <Button variant={"outlined"} color={"inherit"} endIcon={<AddIcon/>} onClick={handleAddAuction}>
                            Add Auction
                        </Button>
                    </div>: ""}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Me Trade
                    </Typography>
                    {authToken?
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                            </Menu>
                        </div>
                        :
                        <div>
                            <IconButton
                                size="large"
                                aria-label="login to account"
                                aria-haspopup="true"
                                onClick={handleLoginClick}
                                color="inherit"
                            >
                                <LoginIcon />
                            </IconButton>
                        </div>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default AuctionsNavbar;