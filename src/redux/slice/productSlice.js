import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';


export const STATUSES = Object.freeze({
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
});


export const getProduct = createAsyncThunk('product/fetch', async ({ keyword = "", currentPage = 1, price = [0, 1000000], productCategory, ratings = 0 }) => {
    let link = '';


    if (productCategory) {
        link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${productCategory}&ratings[gte]=${ratings}`;
    } else {
        link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`
    };

    const { data } = await axios.get(link);

    return data;
})

export const getProductDetails = createAsyncThunk('product/fetchDetail', async (id) => {
    const { data } = await axios.get(`/api/v1/product/${id}`);
    return data;
})

export const getAllProductAdmin = createAsyncThunk('All-product-admin', async () => {
    const { data } = await axios.get(`/api/v1/admin/products`);
    return data;
})

export const updateProduct = createAsyncThunk('update-product', async ({ id, formData }) => {
    console.log(formData.getAll('images'));
    const config = { headers: { "Content-Type": "multipart/form-data" } }
    const { data } = await axios.put(`/api/v1/admin/product/${id}`, formData, config);
    return data;
})

export const deleteProduct = createAsyncThunk('delete-product', async ({ id }) => {
    await axios.delete(`/api/v1/admin/product/${id}`);
    return id;
})

export const createProduct = createAsyncThunk('create-product', async ({ formData }) => {
    const config = { headers: { "Content-Type": "multipart/form-data" } }
    const { data } = await axios.post(`/api/v1/admin/product/new`, formData, config);
    return data;
})


export const getAllReviewsAdmin = createAsyncThunk('get-all-reviews-admin', async ({ id }) => {
    const { data } = await axios.get(`/api/v1/admin/reviews/${id}`);
    return data;
})

export const deleteReviewAdmin = createAsyncThunk('delete-review-admin', async ({ id,productId }) => {
    await axios.delete(`/api/v1/admin/reviews/${id}?productId=${productId}`);
    return id;
})


const productSlice = createSlice({
    name: 'Product',
    initialState: {
        products: [],
        productsCount: 0,
        message: "success: true",
        status: STATUSES.SUCCESS,
        product: {},
        resultPerPage: 0,
        error:false,
        loading: false,
        adminProducts: [],
        allReviews:[]
    },
    reducers: {
        setProducts(state, action) {
            state.products = action.payload;
        },
        clearError(state, action) {
            state.status = STATUSES.SUCCESS;
            state.error = false;
            state.message = "success: true";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProduct.pending, (state, action) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.products = action.payload.products;
                state.productsCount = action.payload.productCount;
                state.message = `success: ${action.payload.success}`
                state.status = STATUSES.SUCCESS;
                state.resultPerPage = action.payload.resultPerPage
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.message = action.error.message; // Set the error message to the state
            })
            .addCase(getProductDetails.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.message = `success: ${action.payload.success}`;
                state.product = action.payload.product;
                state.loading = false;
                state.error = false;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
                state.loading = false;
                state.error = true;
            })
            .addCase(getAllProductAdmin.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(getAllProductAdmin.fulfilled, (state, action) => {
                state.adminProducts = action.payload.products;
                state.status = STATUSES.SUCCESS;
                state.loading = false;
            })
            .addCase(getAllProductAdmin.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
                state.loading = false;
            })
            .addCase(updateProduct.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const temp = state.adminProducts.map((item) => {
                    if (item._id !== action.payload.product._id) {
                        return item;
                    } else {
                        return action.payload.product;
                    }
                })
                state.adminProducts = temp;
                state.status = STATUSES.SUCCESS;
                state.loading = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
                state.loading = false;
            })
            .addCase(deleteProduct.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.loading = false;
                state.adminProducts = state.adminProducts.filter(
                    (product) => product._id !== action.payload.id
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
                state.loading = false;
            })
            .addCase(createProduct.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.loading = false;
                state.adminProducts.push(action.payload.product);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
                state.loading = false;
            })
            .addCase(getAllReviewsAdmin.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(getAllReviewsAdmin.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.loading = false;
                state.error = false;
                state.allReviews = action.payload.reviews;
            })
            .addCase(getAllReviewsAdmin.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
                state.loading = false;
                state.error = true;
            })
            .addCase(deleteReviewAdmin.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(deleteReviewAdmin.fulfilled, (state, action) => {
                state.status = STATUSES.SUCCESS;
                state.loading = false;
                state.error = false;
                state.allReviews = state.allReviews.filter(review=>{
                    return review._id !== action.payload;
                });
            })
            .addCase(deleteReviewAdmin.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
                state.loading = false;
                state.error = true;
            })
            
    }
})



export const { setProducts, clearError } = productSlice.actions;

export default productSlice.reducer;