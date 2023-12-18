import productReducer from "./slice/productSlice";
import userReducer from './slice/userSlice';
import cartReducer from './slice/cartSlice';
import orderReducer from './slice/orderSlice';
import { configureStore } from "@reduxjs/toolkit";


const store = configureStore({
    reducer:{
        products: productReducer,
        user: userReducer,
        cart: cartReducer,
        order: orderReducer
    }
})

export default store;