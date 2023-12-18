import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import '../styles/_orderUpdateAdmin.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loader from '../layout/loader/Loader';
import { useAlert } from 'react-alert';
import '../styles/_userUpdateAdmin.scss';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getUserDetailAdmin, updateUserDetailAdmin } from '../../redux/slice/userSlice';


function UserUpdateAdmin() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { user, loading, userDetailsAdmin } = useSelector(state => state.user);
    const alert = useAlert();
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);

    const handleUpdate = (id) => {
        if (user._id === id) {
            alert.error("You can update role of yourself");
            return;
        }
        const formData = {
            name:name,
            email:email,
            username:username,
            role:role
        }
        dispatch(updateUserDetailAdmin({ id, formData }));
    }
    useEffect(() => {
        if (Object.keys(userDetailsAdmin).length === 0) {
            dispatch(getUserDetailAdmin({ id }))
        }
    }, [dispatch, id]);

    const handleSidebarButtonClick = () => {
        setShowSidebar(!showSidebar);
      };
    
      const handleWindowResize = () => {
        setShowSidebar(window.innerWidth > 600);
      };
    
      useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);

    if (loading) {
        return <Loader />
    }



    return (
        <>
        {
        window.innerWidth <= 600 && <button onClick={handleSidebarButtonClick} className='show-sidebar-btn'>Sidebar</button>
      }
        <div className='admin-container'>
        {
          showSidebar && <Sidebar />
        }
            <div className='main'>
                <h2>User Details</h2>
                <div className='user-update-container'>
                    {
                        Object.keys(userDetailsAdmin).length !== 0 &&
                        (<div className='user-details-container'>
                            <div className='user-id'>
                                <h2>Id: #{userDetailsAdmin._id}</h2>
                            </div>
                            <div className='name'><p>Name: &nbsp;&nbsp;</p> <p>{userDetailsAdmin.name}</p></div>
                            <div className='username'><p>UserName: &nbsp;&nbsp;</p> <p>{userDetailsAdmin.username}</p></div>
                            <div className='email'><p>Email: &nbsp;&nbsp;</p> <p>{userDetailsAdmin.email}</p></div>
                            <div className='role' style={{ color: userDetailsAdmin.role === 'admin' ? 'red' : 'green' }}><p>Role: &nbsp;&nbsp;</p> <span style={{ color: userDetailsAdmin.role === 'admin' ? 'red' : 'green' }}>{userDetailsAdmin.role}</span></div>
                            <div className='avatar'>
                                <img src={userDetailsAdmin.avatar.url} alt='avatar' />
                            </div>
                        </div>)
                    }
                    {
                        <div className='role-change'>
                            <h2>User Role</h2>
                            <div className='name'>
                            <SpellcheckIcon/>
                                <input
                                    type='text'
                                    placeholder='Name'
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className='username'>
                                <AccountCircleIcon/>
                                <input
                                    type='text'
                                    placeholder='Username'
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className='email'>
                                <MailOutlineIcon />
                                <input
                                    type='email'
                                    placeholder='Email'
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <select className='status-input' onChange={(e) => setRole(e.target.value)}>
                                <option value="">Choose</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button className='status-update' onClick={() => handleUpdate(id)}>Update</button>
                        </div>
                    }


                </div>
            </div>
        </div></>
    )
}

export default UserUpdateAdmin

