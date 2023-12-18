import React, { useEffect, useState } from 'react';
import ReactTableMaterial from '../ReactTableMaterial/ReactTableMaterial';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import Loader from '../layout/loader/Loader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Cancel';
import Sidebar from './Sidebar';
import { getAllUsers, deleteUser } from '../../redux/slice/userSlice';

function UserAdmin() {

    const dispatch = useDispatch();
    const alert = useAlert();
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);

    const { user,allUsers, loading } = useSelector(state => state.user);

    const handleDeleteUser = (id) => {
        if(user._id === id){
            alert.error("You can not delete Yourself");
            return;
        }
        dispatch(deleteUser({ id }));
    }

    useEffect(() => {
        if(allUsers.length === 0){
            dispatch(getAllUsers());
        }
    }, [dispatch])

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

    const columns = [
        {
            accessorKey: '_id',
            header: 'ID'
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'username',
            header: 'UserName'
        },
        {
            accessorKey: 'email', // Accessing the orderItems array directly
            header: 'Email',
        },
        {
            accessorKey: 'role',
            header: 'Role',
            Cell:({row})=>{
                return (
                    <span style={{color:row.original.role === 'admin' ? 'red':'green'}}>{row.original.role}</span>
                )
            }
        },
        {
            accessor: 'avatar',
            header: 'Avatar',
            Cell:({row})=>{
                return (
                    <span>
                        <img src={row.original.avatar.url} alt='avatar' style={{width:'4vmax', height:'4vmax', borderRadius:'100%'}}/>
                    </span>
                )
            }
        },
        {
            accessor: 'action',
            flex: 0.3,
            header: 'Actions',
            size: 20,
            sortable: false,
            Cell: ({ row }) => {
                return (
                    <div>
                        <Link to={`/admin/user/update/${row.original._id}`}><EditIcon /></Link>
                        <span onClick={() => handleDeleteUser(row.original._id)} style={{ cursor: 'pointer' }}><DeleteIcon /></span>
                    </div>
                );
            },
        },
    ]

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
                <div>
                    {
                        allUsers && <ReactTableMaterial columns={columns} data={allUsers} />
                    }
                </div>
            </div>
        </div></>
    )
}

export default UserAdmin
