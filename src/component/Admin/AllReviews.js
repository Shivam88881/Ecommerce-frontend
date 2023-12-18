import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../../redux/slice/productSlice';
import {  useParams } from 'react-router-dom';
import { deleteReviewAdmin, getAllReviewsAdmin } from '../../redux/slice/productSlice';
import Loader from '../layout/loader/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactTableMaterial from '../ReactTableMaterial/ReactTableMaterial';

function AllReviews() {

    const alert = useAlert();
    const dispatch = useDispatch();
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);
    const { id } = useParams();
    const { error, message, allReviews, loading } = useSelector(state => state.products);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getAllReviewsAdmin({ id }));
            } catch (error) {
                alert.error("An error occurred while fetching reviews.");
            }
        };
    
        if(!error){
            fetchData();
        }
    }, [dispatch, id]);

    useEffect(()=>{
        if(error){
            alert.error(message);
            dispatch(clearError());
        }
    },[error])
    

    const handleDeleteReview = (reviewId,productId) => {
        dispatch(deleteReviewAdmin({id:reviewId,productId}))
    }
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
            accessorKey: 'rating',
            header: 'Rating'
        },
        {
            accessorKey: 'comment',
            header: 'Comment',
        },
        {
            accessor: 'action',
            flex: 0.3,
            header: 'Actions',
            size: 20,
            sortable: false,
            Cell: ({ row }) => {
                return (
                    <span onClick={() => handleDeleteReview(row.original._id,id)} style={{ cursor: 'pointer' }}><DeleteIcon /></span>
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
                {
                    allReviews && <ReactTableMaterial columns={columns} data={allReviews} />
                }
            </div>
        </div></>
    )
}

export default AllReviews
