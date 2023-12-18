import React, { useEffect, useState } from 'react'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, clearUpdated, updateCurrentPassword } from '../../redux/slice/userSlice';
import '../styles/_updatePassword.scss';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';

function UpdatePassword() {
    const {message, status, updated} = useSelector(state=>state.user);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(newPassword !== confirmNewPassword){
            alert.error("New password does not match with Confirm new Password");
            dispatch(clearError());
            return;
        }
        if(newPassword.length <8){
            alert.error("Password Should atleast 8 character long");
            dispatch(clearError());
            return;
        }
        const formdata = {
            oldPassword:currentPassword,
            newPassword:newPassword
        }
        dispatch(updateCurrentPassword(formdata));
    }

    useEffect(()=>{
        if(updated === false){
            alert.error(message);
            dispatch(clearError());
            dispatch(clearUpdated);
        }
        if(updated){
            alert.success("Password updated successfully");
            console.log("inside navigate");
            navigate('/user/account');
        }
    }, [status, updated]);


    return (
        <div className='update-password-container'>
            <MetaData title={"Password Update"}/>
            
            <div className='form-container'>
            <h2>Update Password</h2>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='current-password'>
                        <LockOpenIcon />
                        <input
                            type='password'
                            placeholder='Current Password'
                            required={true}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className='new-password'>
                        <LockIcon />
                        <input
                            type='password'
                            placeholder='New Password'
                            required={true}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className='confirm-new-password'>
                        <LockIcon />
                        <input
                            type='password'
                            placeholder='Confirm new password'
                            required={true}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    <button type='submit' className='submit-btn'>Update</button>
                </form>
            </div>
        </div>
    )
}

export default UpdatePassword
