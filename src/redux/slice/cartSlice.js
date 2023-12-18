import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const STATUSES = Object.freeze({
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
});

export const addToCart = createAsyncThunk('addToCart', async (data, { dispatch }) => {
    const query = { productId: data.product._id, quantity: data.quantity };
    if (data.user) {
        const config = { headers: { "Content-Type": "application/json" } };
        await axios.put(`/api/v1/add-to-cart`, query, config);
    } else {
        dispatch(addCartToLocal({ product: data.product, quantity: data.quantity }));
    }

    const cartItem = {
        product: data.product,
        quantity: data.quantity,
        user: data.user
    }

    return cartItem;
});

export const getCartItems = createAsyncThunk('get-cart-items', async ({ user }) => {
    if (user) {
        const { data } = await axios.get(`/api/v1/cart`);
        return data;
    } else {
        const localCartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
        const data = {
            success: true,
            cartItems: localCartItems,
            message: "All cart items sent successfully"
        }
        return data;
    }
})

export const clearDatabaseCart = createAsyncThunk('delete-cart-items', async () => {
    const config = {headers: {"Content-Type" : "application/json"}}
    await axios.put('/api/v1/cart/clear',{},config);
})

export const cartQtyIncDec = createAsyncThunk('cart-qty-inc-dec', async (query) => {
    console.log(query);
    if (query.user) {
        const config = { headers: { "Content-Type": "application/json" } };
        const changeDataQuery = { productId: query.id, type: query.type };
        await axios.put(`/api/v1/cart/inc-or-dec`, changeDataQuery, config)
    } else {
        const existingCartItems = JSON.parse(localStorage.getItem("cartItems"));
        const cartIndex = existingCartItems.findIndex(cartitem => cartitem.id === query.id)
        if (query.type === "+") {
            existingCartItems[cartIndex].quantity += 1;
        } else {
            existingCartItems[cartIndex].quantity -= 1;
        }
        localStorage.setItem("cartItems", JSON.stringify(existingCartItems));
    }
    return query;
})

export const addCartLocalToDatabase = createAsyncThunk('add-cart-local-to-DB', async () => {
    const data = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];

    if (data.length > 0) {
        var productData = data.map((item) => {
            return {
                productId: item.id,
                quantity: item.quantity
            }
        })
        const config = { headers: { "Content-Type": "application/json" } };
        await axios.put(`/api/v1/add-to-cart/multiple`, { products: productData }, config);
    }

    return;
})


export const cartRemove = createAsyncThunk('cart-remove', async (query) => {
    if (query.user) {
        const config = { headers: { "Content-Type": "application/json" } };
        await axios.put('/api/v1/cart/remove', { productId: query.id }, config);
    } else {
        const locatCartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];

        const cartItemIndex = locatCartItems.findIndex(cartItem => cartItem.id === query.id)

        const numberOfElementsToRemove = 1;

        if (cartItemIndex !== -1) {
            locatCartItems.splice(cartItemIndex, numberOfElementsToRemove);
        }

        localStorage.setItem("cartItems", JSON.stringify(locatCartItems));

    }

    return query.id;
})

const cartSlice = createSlice({
    name: 'Cart',
    initialState: {
        cartItems: [],
        status: STATUSES.SUCCESS,
        message: "success: true",
        loading: false,
        incDec: null,
        shippingInfo:{}
    },
    reducers: {
        clearCart(state, action) {
            state.status = STATUSES.SUCCESS;
            state.message = "success: true";
            state.loading = false;
            state.cartItems = [];
            state.incDec = null;
        },
        clearIncDec(state, action) {
            state.incDec = null;
        },
        addCartToLocal(state, action) {
            const existingCartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
            var isExist = false;
            const updatedCartItems = existingCartItems.map(item => {
                if (item.id === action.payload.product._id) {
                    isExist = true;
                    return {
                        ...item,
                        quantity: item.quantity + action.payload.quantity
                    };
                }
                return item;
            });
            if (!isExist) {
                const item = {
                    id: action.payload.product._id,
                    name: action.payload.product.name,
                    price: action.payload.product.price,
                    ratings: action.payload.product.ratings,
                    image: action.payload.product.images[0],
                    quantity: action.payload.quantity,
                    stock: action.payload.product.Stock
                };
                updatedCartItems.push(item);
            }
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        },
        addAddress(state,action){
            localStorage.removeItem("address");
            localStorage.setItem("address",JSON.stringify(action.payload))
            state.shippingInfo = action.payload;
        },
        getShippingInfo(state,action){
            const savedShippingInfo = localStorage.getItem("address") ? JSON.parse(localStorage.getItem("address")) :{}

            state.shippingInfo = savedShippingInfo;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state, action) => {
                state.loading = true;
                state.status = STATUSES.LOADING;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.loading = false;
                const existingItemIndex = state.cartItems.findIndex(item => item.id === action.payload.product._id);
                if (existingItemIndex !== -1) {
                    state.cartItems[existingItemIndex].quantity += action.payload.quantity;
                } else {
                    const newItem = {
                        id:action.payload.product._id,
                        image: action.payload.product.images[0],
                        name:action.payload.product.name,
                        price:action.payload.product.price,
                        ratings:action.payload.product.ratings,
                        quantity:action.payload.quantity,
                        stock: action.payload.product.stock
                    }
                    state.cartItems.push(newItem);
                }
                state.message = "success: true";
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.loading = false;
                state.message = action.error.message;
            })
            .addCase(addCartLocalToDatabase.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.message = "Cart items sending to DB"
            })
            .addCase(addCartLocalToDatabase.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                localStorage.removeItem("cartItems");
            })
            .addCase(addCartLocalToDatabase.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
            })
            .addCase(getCartItems.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
                state.message = "Cart items sending to DB"
                state.cartItems = [];
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.loading = false;
                state.cartItems = action.payload.cartItems;
                state.message = "All cart items loaded";
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.loading = false;
                state.message = action.error.message;
            })
            .addCase(cartQtyIncDec.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true
                state.incDec = true;
                state.message = "Cart items sending to DB"
            })
            .addCase(cartQtyIncDec.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.incDec = true;
                state.loading = false
                const cartIndex = state.cartItems.findIndex(cartitem => cartitem.id === action.payload.id)
                if (action.payload.type === "+") {
                    state.cartItems[cartIndex].quantity += 1;
                } else {
                    state.cartItems[cartIndex].quantity -= 1;
                }
                state.message = "Cart updated successfully";
            })
            .addCase(cartQtyIncDec.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.loading = false;
                state.incDec = false;
                state.message = action.error.message;
            })
            .addCase(cartRemove.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
                state.message = "item removing from cart"
            })
            .addCase(cartRemove.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.loading = false;
                console.log(action.payload);
                const cartItemIndex = state.cartItems.findIndex(cartItem => cartItem.id === action.payload)

                const numberOfElementsToRemove = 1;

                if (cartItemIndex !== -1) {
                    state.cartItems.splice(cartItemIndex, numberOfElementsToRemove);
                }
                state.message = "All cart items loaded";
            })
            .addCase(cartRemove.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.loading = false;
                state.message = action.error.message;
            })
            .addCase(clearDatabaseCart.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
                state.message = "All items removing from cart"
            })
            .addCase(clearDatabaseCart.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.loading = false;
                state.cartItems = [];
                state.message = "All cart items loaded";
            })
            .addCase(clearDatabaseCart.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.loading = false;
                state.message = action.error.message;
            })
    }
});

export const { clearCart, addCartToLocal, clearIncDec,addAddress, getShippingInfo } = cartSlice.actions;

export default cartSlice.reducer;
