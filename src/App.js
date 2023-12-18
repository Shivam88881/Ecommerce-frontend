import './component/styles/_app.scss';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import WebFont from 'webfontloader';
import { useEffect, useState } from 'react';
import Loader from './component/layout/loader/Loader';
import About from './component/About/About'

import Header from './component/layout/header/Header';
import Products from './component/product/Products';
import Search from './component/product/Search';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/slice/userSlice';
import {addCartLocalToDatabase, getCartItems} from './redux/slice/cartSlice';
import Home from './component/Home/Home';
import Footer from './component/layout/footer/Footer';
import ProductDetails from './component/product/ProductDetails';
import LoginSignUP from './component/User/LoginSignUP';
import UserOptions from './component/layout/header/UserOptions';
import Profile from './component/User/Profile';
import ProtectedRoute from './component/Route/ProtectedRoute';
import EditProfile from './component/User/EditProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Cart from './component/Cart/Cart';
import Shipping from './component/Cart/Shipping';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import axios from 'axios';
import Payment from './component/Cart/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAlert } from 'react-alert';
import OrderSuccess from './component/Cart/OrderSuccess';
import { getAllOrders } from './redux/slice/orderSlice';
import Orders from './component/Cart/Orders';
import OrderDetails from './component/Cart/OrderDetails';
import Dashboard from './component/Admin/Dashboard';
import ProductList from './component/Admin/ProductList';
import ProductsAdmin from './component/Admin/ProductsAdmin';
import ProductUpdate from './component/Admin/ProductUpdate';
import CreateProduct from './component/Admin/CreateProduct';
import OrderAdmin from './component/Admin/OrderAdmin';
import OrderUpdateAdmin from './component/Admin/OrderUpdateAdmin';
import UserAdmin from './component/Admin/UserAdmin';
import UserUpdateAdmin from './component/Admin/UserUpdateAdmin';
import ReviewAdmin from './component/Admin/ReviewAdmin';
import AllReviews from './component/Admin/AllReviews';



function App() {

  const [stripeApiKey, setStripeApiKey] = useState("");
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, status, loading } = useSelector(state => state.user);


  async function getStripeApiKey() {
    try {
      const { data } = await axios.get('/api/v1/stripe-api-key');
      setStripeApiKey(data.stripeApiKey || ''); 
    } catch (error) {
      setStripeApiKey(''); 
      alert.error(error.message);
  }
}
  
  useEffect(() => {
    
    const fetchData = async () => {
      WebFont.load({
        google: {
          families: ["Roboto", "Droid Sans", "Chilanka"]
        },
      });
  
      if (user) {
        await dispatch(addCartLocalToDatabase());
      } else {
        await dispatch(loadUser());
      }
  
      dispatch(getCartItems({ user: user }));
      getStripeApiKey();
      dispatch(getAllOrders({ user: user }));
    };
  
    fetchData();
  }, [user,dispatch]);
  const appStyle = {
    fontFamily: 'Roboto, sans-serif', // Use "Roboto" as the default font-family
    overflowX: 'hidden'
  };

  if(loading){
    return <Loader/>
  }

  return (
    <>
      { (status!=="LOADING") && <div style={appStyle}>
        <Router>
          <Header />
          {user && <UserOptions />}
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/product/:id' element={<ProductDetails />} />
            <Route exact path='/products' element={<Products />} />
            <Route path='/products/:keyword' element={<Products />} />
            <Route exact path='/about' element={<About />} />
            <Route exact path='/Search' element={<Search />} />
            <Route exact path='/user/authentication' element={<LoginSignUP />} />
            <Route exact path='/user/account' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route exact path='/user/account/edit' element={<ProtectedRoute ><EditProfile/></ProtectedRoute>}/>
            <Route exact path='/user/password/update' element={<ProtectedRoute ><UpdatePassword/></ProtectedRoute>}/>
            <Route exact path='/password/forgot' element={<ForgotPassword />} />
            <Route exact path='/password/reset/:token' element={<ResetPassword />} />
            <Route exact path='/cart' element={<Cart />} />
            <Route exact path='/shipping' element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
            <Route exact path='/confirm-order' element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
            <Route exact path='/payment' element={stripeApiKey && <Elements stripe={loadStripe(stripeApiKey)}><ProtectedRoute><Payment /></ProtectedRoute></Elements>} />
            <Route exact path='/new/order' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route exact path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route exact path='/order/:id' element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route exact path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
            <Route exact path='/admin/products' element={<ProtectedRoute isAdmin={true}><ProductsAdmin /></ProtectedRoute>} />
            <Route exact path='/admin/product/update/:id' element={<ProtectedRoute isAdmin={true}><ProductUpdate /></ProtectedRoute>} />
            <Route exact path='/admin/product/create' element={<ProtectedRoute isAdmin={true}><CreateProduct /></ProtectedRoute>} />
            <Route exact path='/admin/orders' element={<ProtectedRoute isAdmin={true}><OrderAdmin /></ProtectedRoute>} />
            <Route exact path='/admin/order/update/:id' element={<ProtectedRoute isAdmin={true}><OrderUpdateAdmin /></ProtectedRoute>} />
            <Route exact path='/admin/users' element={<ProtectedRoute isAdmin={true}><UserAdmin /></ProtectedRoute>} />
            <Route exact path='/admin/user/update/:id' element={<ProtectedRoute isAdmin={true}><UserUpdateAdmin /></ProtectedRoute>} />
            <Route exact path='/admin/reviews' element={<ProtectedRoute isAdmin={true}><ReviewAdmin /></ProtectedRoute>} />
            <Route exact path='/admin/product/reviews/:id' element={<ProtectedRoute isAdmin={true}><AllReviews /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </Router>
      </div >
}
    </>
  )
}

export default App;
