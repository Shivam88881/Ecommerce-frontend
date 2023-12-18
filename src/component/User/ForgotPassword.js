import React, { useEffect, useState } from 'react';
import '../styles/_forgotPassword.scss';
import EmailIcon from '@mui/icons-material/Email';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, forgotPassword } from '../../redux/slice/userSlice';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';

function ForgotPassword() {
    const [emailorUsername, setEmailOrUsername] = useState("");
    const {status, message} = useSelector(state=>state.user);
    const alert = useAlert();
    const dispatch = useDispatch();
    const handleSubmit = ()=>{
        const formdata = {emailOrUsername:emailorUsername}
        dispatch(forgotPassword(formdata));
    }
    useEffect(()=>{
        if(status === "SUCCESS"){
            alert.success("Mail sent to your email Id");
        }
        if(status === "ERROR"){
            alert.error(message);
            dispatch(clearError());
        }
    },[status])
    return (
        <div className='forgot-password'>
            <MetaData title={"Forgot Password"} />
            <div className='forgot-password-container'>
                <h2>Forgot Password</h2>
                <div>
                    <EmailIcon/>
                    <input
                        type='text'
                        placeholder='Enter your email or username'
                        required={true}
                        value={emailorUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                    />
                </div>
                <button className='forgot-password-btn' onClick={handleSubmit}>Send</button>
            </div>
        </div>
    )
}

export default ForgotPassword
