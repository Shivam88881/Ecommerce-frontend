import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutStep from './CheckoutStep';
import '../styles/_confirmOrder.scss';
import { getShippingInfo } from '../../redux/slice/cartSlice';
import {useNavigate} from 'react-router-dom';
import MetaData from '../layout/MetaData';


function ConfirmOrder() {

    const { shippingInfo, cartItems } = useSelector(state => state.cart);

    const dispatch =useDispatch();
    const navigate = useNavigate();

    if(JSON.stringify(shippingInfo) === '{}'){
        dispatch(getShippingInfo());
    }

    var subTotal = 0;

    cartItems.map((item) => {
        subTotal += (item.price * item.quantity)
    })

    const shippingCost = subTotal > 1000 ? 0 : 100;

    const gst = subTotal*18/100;
    const total = subTotal+gst;

    const submitHandeler = ()=>{
        const data = {
            subtotal:subTotal,
            tax:gst,
            shippingCost: shippingCost,
            totalCost:total
        }
        sessionStorage.setItem("orderInfo",JSON.stringify(data));
        navigate('/payment')
    }
    return (
        <>
        <MetaData title="Confirm Order--Ecommerce"/>
        <CheckoutStep activeStep={1}/>
            <div className='confirm-order-container'>
                <div className='shipping-info'>
                    <div>
                        <h2>Shipping Info</h2>
                        <div className='address-details'>
                            <p><span>Name: </span>{shippingInfo.name}</p>
                            <p><span>Phone: </span>{shippingInfo.address}</p>
                            <p><span>Address: </span>{`${shippingInfo.address},${shippingInfo.city},${shippingInfo.state},${shippingInfo.country},${shippingInfo.pincode}`}
                            </p>
                        </div>
                        <div className='cart-items'>
                        <h2>Your Cart Items:</h2>
                            {
                                cartItems.map((item,index) => (
                                    <div key={index} className='cart-item-detail'>
                                        <img src={item.image.url} />
                                        <p className='item-name'>{item.name}</p>
                                        <p className='item-total-price'>{item.quantity} X ₹{item.price} = <span>₹{item.quantity * item.price}</span></p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='order-summery'>
                    <h2>Order Summery</h2>
                    <div className='summary'>
                        <div>
                            <p className='charges'>Subtotal:</p>
                            <p>₹{subTotal}</p>
                        </div>
                        <div>
                            <p className='charges'>Shipping Charges:</p>
                            <p>₹0</p>
                        </div>
                        <div>
                            <p className='charges'>GST:</p>
                            <p>₹{gst.toFixed(1)}</p>
                        </div>

                        <div className='total'>
                            <p>Total:</p>
                            <p>₹{total.toFixed(1)}</p>
                        </div>
                    </div>

                    <button onClick={submitHandeler}>Proceed to Payment</button>
                </div>
            </div>
        </>
    )
}

export default ConfirmOrder
