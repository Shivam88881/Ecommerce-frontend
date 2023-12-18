import React from 'react'
import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom';
import "../styles/_productCard.scss";



function Product({ product }) {
    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        value: product.ratings,
        isHalf: true,
        size: window.innerWidth < 600 ? 20 : 25
    }

    return (
        <Link className='product-card' to={`/product/${product._id}`}>
            <div className='image'>
                {product.images && product.images[0] && (
                    <img src={product.images[0].url} alt='Product' />
                )}
            </div>
            <div className='product-card-details'>
                <span className='product-name'>{product.name}</span>
                <div>
                    <ReactStars {...options} />
                    <span>({product.numOfReviews} reviews)</span>
                </div>
                <span className='price'>₹ {product.price}</span>
            </div>

        </Link>
    )
}

export default Product
