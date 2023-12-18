import React from 'react'
import profilepng from '../../images/Profile.png';
import ReactStars from "react-rating-stars-component";
import '../styles/_reviewCard.scss';

function ReviewCard({review}) {

    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        value: review.rating,
        isHalf: true,
        size: window.innerWidth < 600 ? 20 : 25
    }
    return (
        <div className='review-card'>
            <img src={profilepng} alt='User' />
            <span>{review.name}</span>
            <ReactStars {...options} />
            <p>{review.comment}</p>           
        </div>
    )
}

export default ReviewCard
