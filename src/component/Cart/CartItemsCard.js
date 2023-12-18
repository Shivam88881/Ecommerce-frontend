import React, { useState } from 'react'
import '../styles/_cartItemsCard.scss';
import {useAlert} from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { cartQtyIncDec, cartRemove, clearIncDec } from '../../redux/slice/cartSlice';

function CartItemsCard({ product }) {

    console.log(product)

    const alert = useAlert();
    const dispatch = useDispatch();

    const {user} = useSelector(state=>state.user);

    const [quantity, setQuantity] = useState(product.quantity);


    const handleDecreseCart = async() => {
        if (quantity > 1) {
            const query = {user:user,id:product.id,type:"-"}
            try {
                await dispatch(cartQtyIncDec(query));
            } catch (error) {
                alert.error("Error in cartQtyIncDec:", error);
                return; 
            }
            setQuantity(quantity - 1);
            dispatch(clearIncDec());
        }
        else return;
    }

    const handleIncreaseCart = async() => {
        if (quantity < product.stock) {
            const query = {user:user,id:product.id,type:"+"}
            try {
                await dispatch(cartQtyIncDec(query));
            } catch (error) {
                alert.error("Error in cartQtyIncDec:",error);
                return; 
            }
            setQuantity(quantity + 1);
            dispatch(clearIncDec());
        }
        else {
            alert.error(`Only ${quantity} stocks available`);
            return;
        }
    }

    const handleRemove = ()=>{
        dispatch(cartRemove({user:user,id:product.id}))
    }

    return (
        <div className='item-card'>
            <div className='item-detail'>
                
                <img src={product.image.url} alt='Product Image'/>
                <div>
                    <p className='product-name'>{product.name}</p>
                    <p>Price:₹{product.price}</p>
                    <button className='remove-btn' onClick={handleRemove}>Remove</button>
                </div>
            </div>
            <div className='quantity'>
                <button onClick={handleDecreseCart}>-</button>
                <input type='number' value={quantity} readOnly={true} />
                <button onClick={handleIncreaseCart}>+</button>
            </div>

            <div className='subtotal'>₹{product.price * quantity}</div>
        </div>
    )
}

export default CartItemsCard
