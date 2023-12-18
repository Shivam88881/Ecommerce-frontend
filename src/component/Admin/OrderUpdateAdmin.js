import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import '../styles/_orderUpdateAdmin.scss';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, getOrderDetailsAdmin, updateOrderDetailsAdmin } from '../../redux/slice/orderSlice';
import { useParams } from 'react-router-dom';
import Loader from '../layout/loader/Loader';
import { useAlert } from 'react-alert';


function OrderUpdateAdmin() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { loading, orderDetailsAdmin, error, message } = useSelector(state => state.order);
    const alert = useAlert();
    const [status,setStatus] = useState('');
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);
    const handleUpdate = (id)=>{
        dispatch(updateOrderDetailsAdmin({id,status}));
    }
    useEffect(() => {
        if(Object.keys(orderDetailsAdmin).length === 0){
            dispatch(getOrderDetailsAdmin({ id }))
        }
        if(error){
            alert.error(message);
            dispatch(clearError);
        }
    }, [dispatch,id, error,orderDetailsAdmin.orderStatus]);

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
            <h2>Order Details</h2>
                <div className='order-update-container'>
                    {
                        Object.keys(orderDetailsAdmin).length !== 0 && (<div className='order-details-container'>
                            <div className='order-id'>
                                <h2>Order Id: #{orderDetailsAdmin._id}</h2>
                            </div>
                            <div className='shipping-info'>
                                <div>
                                    <h2>Shipping Info</h2>
                                    <div className='address-details'>
                                        <p><span>Name: </span>{orderDetailsAdmin.shippingInfo.name}</p>
                                        <p><span>Phone: </span>{orderDetailsAdmin.shippingInfo.phoneNo}</p>
                                        <p><span>Address: </span>{`${orderDetailsAdmin.shippingInfo.address},${orderDetailsAdmin.shippingInfo.city},${orderDetailsAdmin.shippingInfo.state},${orderDetailsAdmin.shippingInfo.country},${orderDetailsAdmin.shippingInfo.pincode}`}
                                        </p>
                                    </div>
                                    <div className='payment-info'>
                                        <h2>Payment</h2>
                                        <p style={{ color: orderDetailsAdmin.paymentInfo.status === "succeeded" ? 'green' : 'red' }}>{orderDetailsAdmin.paymentInfo.status}</p>
                                        <p>Amount: ₹{orderDetailsAdmin.totalPrice}</p>
                                    </div>
                                    <div className='order-status'>
                                        <h2>Status</h2>
                                        <p style={{ color: orderDetailsAdmin.orderStatus === "Processing" ? 'blue' : (orderDetailsAdmin.orderStatus === "Delivered" ? 'green' : (orderDetailsAdmin.orderStatus) === 'Shipped' ? 'purple' : 'red') }}>{orderDetailsAdmin.orderStatus}</p>
                                    </div>
                                    <div className='ordered-items'>
                                        <h2>Ordered Items:</h2>
                                        {
                                            orderDetailsAdmin.orderItems.map((item, index) => (
                                                <div key={index} className='ordered-item-detail'>
                                                    <img src={item.image} alt='Product Image' />
                                                    <p className='item-name'>{item.name}</p>
                                                    <p className='item-total-price'>{item.quantity} X ₹{item.price} = <span>₹{item.quantity * item.price}</span></p>

                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>




                        )}
                    {
                    (orderDetailsAdmin.orderStatus === "Processing" || orderDetailsAdmin.orderStatus === "Shipped") &&
                    <div className='status-change'>
                        <h2>Order Status</h2>
                        <select id='status-input' className='status-input' onChange={(e)=>setStatus(e.target.value)}>
                        <option value="">Choose</option>
                            {
                                orderDetailsAdmin.orderStatus === "Processing" ?
                                    <option value="Shipped">Shipped</option> :
                                    <option value="Delivered">Delivered</option>
                            }
                        </select>
                        <button className='status-update' onClick={()=>handleUpdate(id)}>Update</button>
                    </div>
                    }


                </div>
            </div>
        </div></>
    )
}

export default OrderUpdateAdmin
