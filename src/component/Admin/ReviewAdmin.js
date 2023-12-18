import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/_reviewsAdmin.scss';
import { getAllReviewsAdmin } from '../../redux/slice/productSlice';
import Loader from '../layout/loader/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactTableMaterial from '../ReactTableMaterial/ReactTableMaterial';

function ReviewAdmin() {

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [productId, setProductId] = useState('');
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);
    const {error,message, allReviews, loading} = useSelector(state=>state.products);
    useEffect(()=>{
        if(error){
            alert.error(message);
            dispatch(clearError());
        }
    },[error,allReviews])

    const handleFind = ()=>{
        navigate(`/admin/product/reviews/${productId}`)
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
                <div className='container'>
                    <div>
                        <h2>Product Id</h2>
                        <div>
                            <StarRateIcon />
                            <input type='text' placeholder='Product Id' value={productId} onChange={(e) => setProductId(e.target.value)} />
                        </div>
                        <button onClick={handleFind}>Find</button>
                    </div>
                </div>
            </div>
        </div></>
    )
}

export default ReviewAdmin
