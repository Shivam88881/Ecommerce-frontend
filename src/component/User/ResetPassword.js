import React, {useState, useEffect} from 'react';
import LockIcon from '@mui/icons-material/Lock';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/_resetPassword.scss';
import { clearError, resetPassword } from '../../redux/slice/userSlice';
import { useParams } from 'react-router-dom';
import MetaData from '../layout/MetaData';

function ResetPassword() {

    const {user,status, message} = useSelector(state=>state.user);

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const {token} = useParams();
    console.log(token);

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = ()=>{
        if(newPassword.length < 8){
            alert.error("Password should be atleast 8 digit long");
            return;
        }
        if(newPassword !== confirmNewPassword){
            alert.error("Confirm password does not match");
            return;
        }
        const formdata = {
            token:token,
            password:newPassword
        }
        dispatch(resetPassword(formdata));
    }

    useEffect(()=>{
        if(user){
            navigate('/')
        }
        if(status === "ERROR"){
            alert.error(message);
            dispatch(clearError());
        }
    },[user, status])

    return (
        <div className='reset-password-container'>
            <MetaData title={"Reset Password"} />
            <div className='form-container'>
                <h2>Reset Password</h2>
                <form className='form' onSubmit={handleSubmit}>
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
                    <button type='submit' className='submit-btn'>Reset</button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
