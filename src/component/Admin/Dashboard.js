import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import '../styles/_dashboard.scss';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { getAllProductAdmin } from '../../redux/slice/productSlice';
import Loader from '../layout/loader/Loader';
import { getAllOrdersAdmin } from '../../redux/slice/orderSlice';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { getAllUsers } from '../../redux/slice/userSlice';


ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {

  const dispatch = useDispatch();
  const alert = useAlert();

  const { adminProducts, loading: productsLoading } = useSelector(state => state.products);
  const { ordersAdmin, loading: ordersLoading } = useSelector(state => state.order)
  const { allUsers, loading: usersLoading } = useSelector(state => state.user)

  const [amountEarned, setAmpountEarned] = useState(0);
  const [inStockItems, setInStockItems] = useState(0);
  const [outOfStockItems, setOutOfStockItems] = useState(0);
  const [initialAmount, setInitialAmount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);
  useEffect(() => {
    const fetchData = async () => {
      if (adminProducts.length === 0) {
        await dispatch(getAllProductAdmin());
      }
      if (!ordersAdmin.length) {
        await dispatch(getAllOrdersAdmin());
      }
      if (!allUsers.length) {
        await dispatch(getAllUsers());
      }
    }
    fetchData();
  }, [adminProducts, ordersAdmin, allUsers, dispatch]);


  useEffect(() => {
    let instock = 0;
    adminProducts.forEach(element => {
      if (element.stock > 0) instock += 1;
    });
    setInStockItems(instock);
    setOutOfStockItems(adminProducts.length - instock);
  }, [adminProducts]);

  useEffect(() => {
    let totalAmount = 0;
    let initialAmount = 0;
    ordersAdmin.forEach(element => {
      totalAmount = totalAmount + element.totalPrice;
      const paidAtString = element.paidAt;
      const paidAtDate = new Date(paidAtString);
      const currentDate = new Date();
      const timeDifference = currentDate - paidAtDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      if (daysDifference > 30) {
        initialAmount += element.totalPrice;
      }
    });

    setAmpountEarned(totalAmount);
    setInitialAmount(initialAmount);
  }, [ordersAdmin]);

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


  const lineState = {
    labels: ['Initial Amount', 'Amount Earned'],
    datasets: [
      {
        label: 'TOTAL AMOUNT',
        backgroundColor: ['Tomato'],
        hoverBackgroundColor: ["rgb(197,72,49)"],
        data: [initialAmount, amountEarned],
      },
    ],
  };

  const doughnutState = {
    labels: ['Out of stock', 'In stock'],
    datasets: [
      {
        label: '# of Votes',
        backgroundColor: ['#00A684', '#6800B4'],
        hoverBackgroundColor: ['#4B5000', '#35014F'],
        data: [outOfStockItems, inStockItems],
      },
    ],
  };


  if (productsLoading || ordersLoading || usersLoading) {
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

          <h2>Dashboard</h2>
          <div className='dashboard-box-1'>Total Amount<span> &nbsp;&nbsp;₹2000</span></div>
          <div className='dashboard-box-2'>
            <Link to='/admin/products'>
              <div className='products-container'>
                <p>Products</p>
                <p>{adminProducts.length}</p>
              </div>
            </Link>
            <Link to='/admin/orders'>
              <div className='orders-container'>
                <p>Orders</p>
                <p>{ordersAdmin.length}</p>
              </div>
            </Link>
            <Link to='/admin/users'>
              <div className='users-container'>
                <p>users</p>
                <p>{allUsers.length}</p>
              </div>
            </Link>
          </div>

          <div className='line-chart'>
            <Line data={lineState} />
          </div>

          <div className='doughnut-chart'>
            <Doughnut data={doughnutState} />
          </div>
        </div>
      </div></>
  )
}

export default Dashboard
