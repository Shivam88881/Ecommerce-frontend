import React, { useEffect } from 'react';
import MetaData from '../layout/MetaData';
import '../styles/_editProfile.scss';
import { Link, Navigate } from 'react-router-dom';
import '../styles/_profile.scss';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/loader/Loader';
import { clearUpdated } from '../../redux/slice/userSlice';

function Profile() {
    const {user, isAuthenticated, status,updated} = useSelector(state=>state.user);
    const dispatch = useDispatch();
    useEffect(()=>{
        if(isAuthenticated===false){
            return <Navigate to={'/user/authentication'}/>
        }
        if(updated){
            dispatch(clearUpdated());
        }
    },[updated, isAuthenticated]);
    return (
        <div className='profile'>
            <MetaData title={`Profile--${user.name}`} />
            <div className='profile-container'>
                <div>
                    <h1>My Profile</h1>
                    <img src={user.avatar.url} alt={user.name} />
                    <Link to='/user/account/edit'>Edit Profile</Link>
                </div>
            </div>
            <div className='profile-details'>
                <div>
                    <h4>Full Name</h4>
                    <p>{user.name}</p>
                </div>
                <div>
                    <h4>Email</h4>
                    <p>{user.email}</p>
                </div>
                <div>
                    <h4>Username</h4>
                    <p>{user.username}</p>
                </div>
                <div>
                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substr(0, 10)}</p>
                </div>
                <div className='links'>
                    <Link to='/orders'>My Orders</Link>
                    <Link to='/user/password/update'>Change Password</Link>
                </div>
            </div>
        </div>
    )
}

export default Profile
