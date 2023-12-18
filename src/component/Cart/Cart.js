import React from 'react'
import CartItemsCard from './CartItemsCard';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import '../styles/_cart.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getShippingInfo } from '../../redux/slice/cartSlice';
import MetaData from '../layout/MetaData';

function Cart() {

    const { cartItems } = useSelector(state => state.cart);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    var totalAmount = 0;

    cartItems.forEach(item => {
        totalAmount += (item.price * item.quantity)
    });

    const handleCheckOut = () => {
        dispatch(getShippingInfo());
        navigate("/shipping");
    }

    return (
        <>
            <MetaData title="Cart--Ecommerce" />
            {
                cartItems.length === 0 && <div className='empty-cart'>
                    <RemoveShoppingCartIcon />
                    <h2>No Product in Your Cart</h2>
                    <Link to="/products"><button>View Products</button></Link>
                </div>
            }

            {
                cartItems.length !== 0 &&
                <div className='cartPage'>
                    <div className='cart-header'>
                        <p>Product</p>
                        <p>Quantity</p>
                        <p className='subtotal'>Subtotal</p>
                    </div>
                    <div className='cart-items'>
                        {
                            cartItems.map((item) => (
                                <CartItemsCard key={item.id} product={item} />
                            ))
                        }
                    </div>
                    {
                        cartItems.length > 0 ? <div className='gross-total'>
                            <div className='line'></div>
                            <div className='amount-calculation'>
                                <p>Gross Total</p>
                                <p>₹{totalAmount}</p>
                            </div>
                        </div> : <div></div>
                    }

                    {
                        cartItems.length > 0 && <div className='checkout-btn'>
                            <button onClick={handleCheckOut}>Check Out</button>
                        </div>
                    }
                </div>

            }
        </>
    )
}

export default Cart
