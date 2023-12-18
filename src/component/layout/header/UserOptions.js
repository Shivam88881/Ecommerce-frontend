import React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Backdrop from '@mui/material/Backdrop';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import {clearError, logout} from '../../../redux/slice/userSlice'
import '../../styles/_userOptions.scss';

function UserOptions() {

    const { user } = useSelector(state => state.user);
    const alert = useAlert();
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const actions = [
        { icon: <FactCheckIcon />, name: 'orders', func: orders },
        { icon: <AccountCircleIcon />, name: 'account', func: account },
        { icon: <ShoppingCartIcon />, name: 'cart', func: cart },
        { icon: <LogoutIcon />, name: 'logout', func: logoutUser }
    ];

    if (user.role === 'admin') {
        actions.unshift({ icon: <SpaceDashboardIcon />, name: 'Dashboard', func: dashboard })
    };
    function dashboard() {
        navigate('/admin/dashboard')
    }
    function orders() {
        navigate('/orders')
    }
    function account() {
        navigate('/user/account')
    }
    function cart() {
        navigate('/cart')
    }
    function logoutUser() {
        dispatch(logout());
        alert.success("Logged out successfully");
        dispatch(clearError());
    }
    return (
        <>
            <Backdrop open={open} style={{zIndex:10}}/>
            <SpeedDial
                style={{ zIndex: 11}}
                className='speed-dial'
                ariaLabel="SpeedDial tooltip example"
                icon={<img className='speed-dial-icon' src={user.avatar.url} alt='Profile' />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                direction='down'
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={action.func}
                    />
                ))}
            </SpeedDial>
        </>
    )
}

export default UserOptions
