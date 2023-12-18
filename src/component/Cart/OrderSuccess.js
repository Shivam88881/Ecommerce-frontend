import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import '../styles/_orderSuccess.scss';
import { Link } from 'react-router-dom';


function OrderSuccess() {
  return (
    <div className='order-placed'>
      <CheckCircleIcon />
      <h2>Your order has been placed Succesfully</h2>
      <Link to="/orders"><button>View Orders</button></Link>
    </div>
  )
}

export default OrderSuccess
