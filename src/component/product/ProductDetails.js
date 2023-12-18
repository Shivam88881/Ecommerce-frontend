import React, { useEffect, useState } from 'react';
import '../styles/_productDetails.scss';
import Carousel from 'react-material-ui-carousel';
import { clearError, getProductDetails } from '../../redux/slice/productSlice';
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import ReviewCard from './ReviewCard';
import MetaData from '../layout/MetaData';
import { addToCart } from '../../redux/slice/cartSlice';
import Loader from '../layout/loader/Loader';


function ProductDetails() {

  const dispatch = useDispatch()
  const alert = useAlert()
  const { product, message, status } = useSelector((state) => state.products)
  const { user } = useSelector(state=>state.user);
  const { loading } = useSelector(state=>state.cart);
  const { id } = useParams();
  const [addToCartValue, setAddToCartValue] = useState(1);
  const handleDecreseCart =()=>{
    if(addToCartValue>1){
      setAddToCartValue(addToCartValue-1);
    }
    else return;
  }

  const handleIncreaseCart = ()=>{
    if(addToCartValue < product.stock){
      setAddToCartValue(addToCartValue+1);
    }
    else{
      alert.error(`Only ${addToCartValue} stocks available`);
      return;
    }
  }

  const handleCartValueChange = (e)=>{
    if(e.target.value > product.stock){
      alert.error(`Only ${product.stock} stocks available`);
      return;
    }else setAddToCartValue(e.target.value)

  }

  const handleCart = ()=>{
    const data = {
      user:user,
      product:product,
      quantity: addToCartValue
    }
    dispatch(addToCart(data));
  }

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    value: product.ratings,
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 25
  }

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getProductDetails(id));
      // Check the status and show an alert if there's an error
      if (status === "ERROR") {
        alert.error(message);
        dispatch(clearError());
      }
    };
  
    fetchData();
  }, [id]);
  
  useEffect(() => {
    if (status === "ERROR") {
      alert.error(message);
    }
  }, [ status, message]);
  



  if(loading){
    return <Loader/>
  }

  return (
    <>
    <MetaData title={`${product.name}--ECOMMERCE`}/>
      <div className='product-details'>
        <div className='product-images'>
          <Carousel>
            {product.images &&
              product.images.map((item, i) => (
                <img className='carousel-image'
                  key={i}
                  src={item.url}
                  alt={`${i} Slide`}
                />
              ))
            }
          </Carousel>
        </div>
        <div className='product-details-block'>
          <div className='product-details-block1'>
            <h2>{product.name}</h2>
            <p>Product # {product._id}</p>
          </div>
          <div className='product-details-block2'>
            {Object.keys(product).length !== 0 && <ReactStars {...options} />}
            <span>({product.numOfReviews} reviews)</span>
          </div>
          <div className='product-details-block3'>
            <button onClick={handleDecreseCart}>-</button>
            <input type='number' value={addToCartValue} onChange={handleCartValueChange} min={0} max={product.stock}/>
            <button onClick={handleIncreaseCart}>+</button>
            <button className='add-to-cart' onClick={handleCart} disabled={product.stock > 0 ? false:true}>Add To Cart</button>
          </div>
          <div className='product-details-block4'>
            <h1>₹ {product.price}</h1>
          </div>
          <div className='product-details-block5'>
            <h3>Status: {product.stock >0 ? <span className='green'>Instock</span> : <span className='red'>OutOfStock</span>}</h3>
            <h4>Description: <p>This is a simple product</p></h4>
          </div>
          
        </div>
      </div>

      <div className='reviews'>
        <h2 className='review-heading'>REVIEWS</h2>
        <div>
        {
          product.reviews && product.reviews[0] ? (
            product.reviews.map((review) => (
              <ReviewCard key = {review._id} review={review}/>
            ))
          ) : (<div className='no-review'>NO Reviews Yet</div>)
        }
        </div>
      </div>
    </>
  )
}

export default ProductDetails;
