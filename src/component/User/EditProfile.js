import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FaceIcon from '@mui/icons-material/Face';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import { updateProfile, clearError, loadUser } from '../../redux/slice/userSlice';
import Loader from '../layout/loader/Loader';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';

function EditProfile() {

    const { user, updated, message, isAuthenticated } = useSelector(state => state.user);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    useEffect(() => {

        if (user) {
            setName(user.name);
            setUsername(user.username);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);

        }

        if (updated) {
            alert.success("Profile detail updated successfully");
            dispatch(loadUser());
            navigate('/user/account');
        }
        if (updated === false) {
            alert.error(message);
            dispatch(clearError());
        }

    }, [isAuthenticated, updated, user]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('avatar', avatar);

        dispatch(updateProfile(formData));
        setLoading(false);
    }

    return (
        <>
            {
                loading ? <Loader /> :
                    <div className='update-profile'>
                        <MetaData title={"Profile Update"} />
                        <div className='update-container'>
                            <h2>Update Profile</h2>
                            <div>
                                <FaceIcon/>
                                <input type='text' value={name} placeholder='Name' onChange={(e) => setName(e.target.value)} required={true} />
                            </div>
                            <div>
                                <AccountCircleIcon/>
                                <input type='text' value={username} placeholder='username' onChange={(e) => setUsername(e.target.value)} required={true} />
                            </div>
                            <div>
                                <EmailIcon/>
                                <input type='text' value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} required={true} />
                            </div>
                            <div className='image-input'>
                                <img src={avatarPreview} alt='avatar' />
                                <input type='file' accept='image/*' onChange={handleImageChange} />
                            </div>
                            <button onClick={handleSubmit}>Update</button>
                        </div>
                    </div>
            }

        </>
    )
}

export default EditProfile
