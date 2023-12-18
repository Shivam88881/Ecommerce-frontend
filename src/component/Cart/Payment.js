import React, { useRef } from 'react';
import CheckoutStep from './CheckoutStep';
import MetaData from '../layout/MetaData';

import { useAlert } from 'react-alert';

import {
    CardCvcElement,
    CardNumberElement,
    CardExpiryElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import '../styles/_payment.scss';
import axios from 'axios';
import PaymentIcon from '@mui/icons-material/Payment';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EventIcon from '@mui/icons-material/Event';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearDatabaseCart } from '../../redux/slice/cartSlice';
import { createOrder } from '../../redux/slice/orderSlice';

function Payment() {

    const payBtn = useRef(null);
    const stripe = useStripe();
    const element = useElements();
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);
    const paymentData = {
        amount: Math.round(orderInfo.totalCost * 100),

    }

    const submitHandeler = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            }

            const { data } = await axios.post('/api/v1/payment/process', paymentData, config);

            const client_secret = data.client_secret;

            if (!stripe || !element) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: element.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country
                        },
                    },
                },
            });

            if (result.error) {
                payBtn.current.disabled = false;

                alert.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    //create new Order
                    try{
                        const newOrder = {
                            shippingInfo: shippingInfo,
                            orderItems: cartItems,
                            paymentInfo: {
                                id: result.paymentIntent.id,
                                status: result.paymentIntent.status
                            },
                            itemsPrice: orderInfo.subtotal,
                            taxPrice: orderInfo.tax,
                            shippingPrice: orderInfo.shippingCost,
                            totalPrice: orderInfo.totalCost,
                        }
                        dispatch(createOrder({order: newOrder}))
    
                        //clear cart
                        dispatch(clearDatabaseCart());
                        navigate('/new/order');
                    } catch(error){
                        alert.error(error);
                    }
                    
                }
            }

        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error);
        }

    };

    return (
        <div className='payment-conatiner'>
            <MetaData title="Payment--Ecommerce" />
            <CheckoutStep activeStep={2} />

            <div className='form-container'>
                <form className='payment-form' onSubmit={submitHandeler}>
                    <h2>Card Info</h2>
                    <div>
                        <div>
                            <PaymentIcon />
                            <CardNumberElement className='payment-input' />
                        </div>

                        <div>
                            <EventIcon />
                            <CardExpiryElement className='payment-input' />
                        </div>

                        <div>
                            <VpnKeyIcon />
                            <CardCvcElement className='payment-input' />
                        </div>
                    </div>

                    <button
                        type='submit'
                        ref={payBtn}
                    >Pay ₹{orderInfo && orderInfo.totalCost}</button>
                </form>
            </div>
        </div>

    )
}

export default Payment
