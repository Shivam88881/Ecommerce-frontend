import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getOrderDetails, clearError } from '../../redux/slice/orderSlice';
import { useParams } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import Loader from '../layout/loader/Loader';
import '../styles/_orderDetails.scss';
import { addReview } from '../../redux/slice/orderSlice'

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Rating
} from '@mui/material';

function OrderDetails() {

    const { orderDetails, loading, error } = useSelector(state => state.order);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [reviewModal, setReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviewProductId, setReviewProductId] = useState("");

    const submitReviewToggle = () => {
        reviewModal ? setReviewModal(false) : setReviewModal(true);
    }

    const handleReview = (productId) => {
        setReviewProductId(prev=>productId);
        submitReviewToggle();
    } 

    const handleReviewSubmit = ()=>{
        dispatch(addReview({user:user,id:reviewProductId,rating:rating,comment:comment}));
        submitReviewToggle();
    }

    useEffect(() => {
        dispatch(getOrderDetails({ user: user, id: id }));
        if(error){
            alert.eror(error);
            dispatch(clearError());
        }
    }, [dispatch,error,id,user])
    if (loading) {
        return <Loader />
    }
    return (
        <>
            <MetaData title="Order Details" />
            {Object.entries(orderDetails).length > 0 &&
                <div className='order-details-container'>
                    <div className='order-id'>
                        <h2>Order Id: #{orderDetails._id}</h2>
                    </div>
                    <div className='shipping-info'>
                        <div>
                            <h2>Shipping Info</h2>
                            <div className='address-details'>
                                <p><span>Name: </span>{orderDetails.shippingInfo.name}</p>
                                <p><span>Phone: </span>{orderDetails.shippingInfo.address}</p>
                                <p><span>Address: </span>{`${orderDetails.shippingInfo.address},${orderDetails.shippingInfo.city},${orderDetails.shippingInfo.state},${orderDetails.shippingInfo.country},${orderDetails.shippingInfo.pincode}`}
                                </p>
                            </div>
                            <div className='payment-info'>
                                <h2>Payment</h2>
                                <p style={{ color: 'green' }}>Paid</p>
                                <p>Amount: ₹{orderDetails.totalPrice}</p>
                            </div>
                            <div className='order-status'>
                                <h2>Status</h2>
                                <p style={{ color: orderDetails.orderStatus === "Processing" ? 'red' : (orderDetails.orderStatus === "Delivered" ? 'purple' : 'green') }}>{orderDetails.orderStatus}</p>
                            </div>
                            <div className='ordered-items'>
                                <h2>Ordered Items:</h2>
                                {
                                    orderDetails.orderItems.map((item, index) => (
                                        <div key={index} className='ordered-item-detail'>
                                            <img src={item.image} alt='Product Image'/>
                                            <p className='item-name'>{item.name}</p>
                                            <p className='item-total-price'>{item.quantity} X ₹{item.price} = <span>₹{item.quantity * item.price}</span></p>
                                            <button onClick={() => handleReview(item.product)}>Review</button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className='review-submit'>
                <Dialog
                    aria-labelledby='simple-dialog-title'
                    open={reviewModal}
                    onClose={submitReviewToggle}
                >
                    <DialogTitle>Submit Review</DialogTitle>
                    <DialogContent className='submit-dialog'>
                        <Rating
                            onChange={(e) => setRating(Number(e.target.value))}
                            value={rating}
                            size='large'
                        />
                        <textarea
                            className='submit-dialog-textarea'
                            cols={30}
                            rows={5}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={submitReviewToggle} color='secondary'>Cancel</Button>
                        <Button onClick={handleReviewSubmit} color='primary'>Submit</Button>
                    </DialogActions>
                </Dialog>
            </div>

        </>
    )
}

export default OrderDetails
