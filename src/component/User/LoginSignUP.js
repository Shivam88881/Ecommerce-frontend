import React, { useEffect, useRef, useState } from 'react'
import '../styles/_loginSignUp.scss';
import { Link } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useDispatch, useSelector } from 'react-redux';
import {login, clearError, register} from '../../redux/slice/userSlice';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import Loader from '../layout/loader/Loader';
import MetaData from '../layout/MetaData';



function LoginSignUP() {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);
    const {isAuthenticated, user, message,error,loading} = useSelector((state) => state.user);

    const [loginEmailOrUsername, setLoginEmailOrUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

    const switchTab = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shift-to-neutral");
            switcherTab.current.classList.remove("shift-to-right");

            registerTab.current.classList.remove("shift-to-nuetral-form");
            registerTab.current.classList.add("shift-to-right");
            loginTab.current.classList.remove("shift-to-left");
        }
        if (tab === 'register') {
            switcherTab.current.classList.add("shift-to-right");
            switcherTab.current.classList.remove("shift-to-neutral");

            registerTab.current.classList.remove("shift-to-right");

            registerTab.current.classList.add("shift-to-neutral-form");
            loginTab.current.classList.add("shift-to-left");
        }
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const query = {emailOrUsername:loginEmailOrUsername, password:loginPassword};
        console.log(query);
        dispatch(login(query));
    }

    const handleRegisterSubmit = (e)=>{
        e.preventDefault();

        if( registerPassword !== registerConfirmPassword){
            alert.error("confirm password does not match. Re-enter confirm password");
            return;
        }

        const myForm = new FormData();

        myForm.set("name",name);
        myForm.set("email",registerEmail);
        myForm.set("username", username);
        myForm.set("password",registerPassword);

        dispatch(register(Object.fromEntries(myForm.entries())));
        
    };


    useEffect(()=>{ 
        if(error){
            alert.error(message);
            dispatch(clearError());
        }

        if(user){
            navigate('/');
        }
    },[dispatch, error, isAuthenticated])

    if(loading){
        return <Loader/>
    }
    return (
        <div className='login-signup-container'>
            <MetaData title={"Ecommerce-authentication"}/>
            <div className='login-signup-box'>
                <div>
                    <div className='login-signup-toggle'>
                        <p onClick={(e) => switchTab(e, "login")}>LOGIN</p>
                        <p onClick={(e) => switchTab(e, "register")}>REGISTER</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>
                <form className='login-form' ref={loginTab} onSubmit={handleLoginSubmit}>
                    <div className='login-email'>
                        <MailOutlineIcon />
                        <input
                            type='email'
                            placeholder='Email'
                            required= {true}
                            value={loginEmailOrUsername}
                            onChange={(e) => setLoginEmailOrUsername(e.target.value)}
                        />
                    </div>
                    <div className='login-password'>
                        <LockOpenIcon />
                        <input
                            type='password'
                            placeholder='Password'
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </div>

                    <button type='submit' className='login-btn'>Login</button>
                    <Link to="/password/forgot">Forgot password?</Link>
                </form>

                <form className='signup-form' ref={registerTab} onSubmit={handleRegisterSubmit}>
                    <div className='name'>
                        <input
                            type='text'
                            placeholder='Name'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className='username'>
                        <input
                            type='text'
                            placeholder='Username'
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className='register-email'>
                        <MailOutlineIcon />
                        <input
                            type='email'
                            placeholder='Email'
                            required
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                        />
                    </div>
                    <div className='signup-password'>
                        <LockOpenIcon />
                        <input
                            type='password'
                            placeholder='Password'
                            required
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                    </div>

                    <div className='signup-confirm-password'>
                    <LockOpenIcon />
                        <input
                            type='password'
                            placeholder='Password'
                            required
                            value={registerConfirmPassword}
                            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type='submit' className='register-btn'>Register</button>
                    
                </form>
            </div>
        </div>
    )
}

export default LoginSignUP
