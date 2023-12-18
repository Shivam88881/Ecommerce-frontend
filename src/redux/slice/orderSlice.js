import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const STATUSES = Object.freeze({
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
});

export const createOrder = createAsyncThunk('create-order', async ({ order }) => {
    console.log("called create orders");
    const config = { headers: { "Content-Type": "application/json" } }
    console.log("order:",order);
    const { data } = await axios.post('/api/v1/order/new', order, config);
    console.log("data after created order: ",data);
    return data;
})

export const getAllOrders = createAsyncThunk('get-all-order', async ({user}) => {
    if(!user) return [];

    const { data } = await axios.get('/api/v1/orders/all');

    return data;
})

export const getAllOrdersAdmin = createAsyncThunk('get-all-orders-admin', async () => {
    

    const { data } = await axios.get('/api/v1/admin/orders/all');

    return data;
})

export const getOrderDetails = createAsyncThunk('get-order-details', async ({user,id}) => {

    if(!user) return [];
    const config = { headers: { "Content-Type": "application/json" } }

    const { data } = await axios.get(`/api/v1/order/${id}`, {}, config);

    return data;
})

export const getOrderDetailsAdmin = createAsyncThunk('get-order-details-admin', async ({id}) => {

    const { data } = await axios.get(`/api/v1/admin/order/${id}`);

    return data;
})

export const updateOrderDetailsAdmin = createAsyncThunk('update-order-details-admin', async ({id,status}) => {
    const config = { headers: { "Content-Type": "application/json" } }
    console.log(id,status);
    await axios.put(`/api/v1/admin/order/${id}`,{status:status}, config);
})

export const addReview = createAsyncThunk('add-review', async ({user,id,rating,comment}) => {
    if(!user) return;
    const config = { headers: { "Content-Type": "application/json" } }

    await axios.put(`/api/v1/product/review`, {productId:id,rating:rating,comment:comment}, config);

    return ;
});

export const cancelOrder = createAsyncThunk('order-cancel', async ({id}) => {
    const config = { headers: { "Content-Type": "application/json" } }

    await axios.put(`/api/v1/admin/order/${id}`, {status:"Cancelled"}, config);

    return ;
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        loading: false,
        status: STATUSES.SUCCESS,
        message: "",
        error:false,
        orderDetails:{},
        ordersAdmin:[],
        orderDetailsAdmin:{}
    },
    reducers: {
        clearStates(state, action) {
            state.orders = [];
            state.loading = false;
            state.status = STATUSES.SUCCESS;
            state.message = "";
        },
        clearError(state,action){
            state.error = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state, action) => {
                state.loading = true;
                state.status = STATUSES.LOADING;
                state.message = "creating new order";
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.status = STATUSES.SUCCESS;
                console.log("order created:",action.payload.order);
                state.orders.push(action.payload.order);
                state.message = "Order placed"
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
            })

            .addCase(getAllOrders.pending, (state, action) => {
                state.loading = true;
                state.status = STATUSES.LOADING;
                state.message = "getting all placed orders details";
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.status = STATUSES.SUCCESS;
                state.orders =action.payload.orders;
                state.message = "Succesfully gatherd data of all placed orders";
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
            })

            .addCase(getOrderDetails.pending, (state, action) => {
                state.loading = true;
                state.status = STATUSES.LOADING;
                state.message = "getting order details";
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.status = STATUSES.SUCCESS;
                if(action.payload.success === true){
                    state.orderDetails =action.payload.order;
                    state.message = "Succesfully gatherd data of order";
                }else{
                    state.status = STATUSES.ERROR;
                    state.message = action.payload.message;
                }
                
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
            })
            .addCase(addReview.pending, (state, action) => {
                state.loading = true;
                state.error = false;
                state.status = STATUSES.LOADING;
                state.message = "creating new order";
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.loading = false;
                state.status = STATUSES.SUCCESS;
                state.error = false;
                state.message = "Review Saved"
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.status = STATUSES.ERROR;
                state.error = true;
                state.message = action.error.message;
            })
            .addCase(getAllOrdersAdmin.pending, (state, action) => {
                state.loading = true;
                state.status = STATUSES.LOADING;
                state.message = "getting all orders";
            })
            .addCase(getAllOrdersAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.status = STATUSES.SUCCESS;
                state.ordersAdmin =action.payload.orders;
                state.message = "Succesfully gatherd data of all placed orders";
            })
            .addCase(getAllOrdersAdmin.rejected, (state, action) => {
                state.loading = false;
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
            })
            .addCase(cancelOrder.pending, (state, action) => {
                state.loading = true;
                state.status = STATUSES.LOADING;
                state.message = "Cancelling order";
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.status = STATUSES.SUCCESS;
                state.message = "Order cancelled successfully";
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
            })
            .addCase(getOrderDetailsAdmin.pending, (state, action) => {
                state.loading = true;
                state.status = STATUSES.LOADING;
                state.message = "getting order details";
            })
            .addCase(getOrderDetailsAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.status = STATUSES.SUCCESS;
                if(action.payload.success === true){
                    state.orderDetailsAdmin =action.payload.order;
                    state.message = "Succesfully gatherd data of order";
                }else{
                    state.status = STATUSES.ERROR;
                    state.message = action.payload.message;
                }
                
            })
            .addCase(getOrderDetailsAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
            })
            .addCase(updateOrderDetailsAdmin.pending, (state, action) => {
                state.loading = true;
                state.status = STATUSES.LOADING;
                state.message = "Cancelling order";
            })
            .addCase(updateOrderDetailsAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.status = STATUSES.SUCCESS;
                state.message = "Order cancelled successfully";
            })
            .addCase(updateOrderDetailsAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
            })
    }
})

export const { clearStates, clearError } = orderSlice.actions;

export default orderSlice.reducer;