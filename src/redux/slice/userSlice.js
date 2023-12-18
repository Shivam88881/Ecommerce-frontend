import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

import { clearCart } from "./cartSlice";


export const STATUSES = Object.freeze({
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
});

export const login = createAsyncThunk('user/login', async({emailOrUsername,password})=>{

    console.log("from reducer: ",emailOrUsername, " ",password);
    const config = {headers:{"Content-Type":"application/json"}};
    
    const data = await axios.post(`/api/v1/login`,{emailOrUsername,password},config);

    return data.data;
});


export const register = createAsyncThunk('user/register', async(user)=>{
    const config = {headers:{"Content-Type":"application/json"}};
    
    const data = await axios.post(`/api/v1/register`,user,config);

    return data.data;
});

export const loadUser = createAsyncThunk('user/load', async()=>{
    const data = await axios.get(`/api/v1/me`);
    return data.data;
});

export const logout = createAsyncThunk('user/logout', async(_,{dispatch})=>{
    dispatch(clearCart());
    await axios.get(`/api/v1/logout`);
    const data = {
        user:null,
        isAuthenticated:false,
        status:STATUSES.SUCCESS,
        message:"success: true"
    }
    return data;
});

export const updateProfile = createAsyncThunk('user/Profile-update', async(formdata)=>{
    const config = {headers:{"Content-Type":"multipart/form-data"}};
    const data = await axios.put(`/api/v1/profile/update`,formdata,config);
    return data.data;
});

export const updateCurrentPassword = createAsyncThunk('user/update-password', async(formdata)=>{
    console.log(formdata);
    const config = {headers:{"Content-Type":"application/json"}};
    const data = await axios.put(`/api/v1/password/update`,formdata,config);
    return data.data;
});

export const forgotPassword = createAsyncThunk('user/forgot-password', async(formdata)=>{
    const config = {headers:{"Content-Type":"application/json"}};
    const data = await axios.post(`/api/v1/password/forgot`,formdata,config);
    return data;
});

export const resetPassword = createAsyncThunk('user/reset-password', async(formdata)=>{
    const config = {headers:{"Content-Type":"application/json"}};
    const data = await axios.put(`/api/v1/password/reset/${formdata.token}`,formdata,config);
    return data.data;
});

export const getAllUsers = createAsyncThunk('all-users-admin', async()=>{
    const {data} = await axios.get(`/api/v1/admin/all-users`);
    return data;
});

export const deleteUser = createAsyncThunk('delete-user', async({id})=>{
    await axios.delete(`/api/v1/admin/user/${id}`);
    return id;
});

export const getUserDetailAdmin = createAsyncThunk('get-user-details-admin', async({id})=>{
    const {data} = await axios.get(`/api/v1/admin/user/${id}`);
    return data;
});

export const updateUserDetailAdmin = createAsyncThunk('update-user-details-admin', async({id,formData})=>{
    const config = {headers:{"Content-Type":"application/json"}};
    await axios.put(`/api/v1/admin/user/${id}`,formData,config);
});

export const userSlice = createSlice({
    name: 'user',
    initialState:{
        user:null,
        isAuthenticated:null,
        status:STATUSES.SUCCESS,
        message:"success: true",
        updated:null,
        loading:false,
        error:false,
        allUsers:[],
        userDetailsAdmin:{}
    },
    reducers:{
        clearError(state,action){
            state.status = STATUSES.SUCCESS;
            state.updated = null;
            state.error = false;
            state.message = "success: true";
        },
        clearUpdated(state,){
            state.updated = null;
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(login.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.isAuthenticated = false;
                state.user = null;
                state.loading = true;
                state.message = "Logging..."
            })
            .addCase(login.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = false;
                state.loading = false;
                state.message = "success: true";
            })
            .addCase(login.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.error = true;
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.message = action.error.message;
            })
            .addCase(register.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(register.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = false;
                state.message = "success: true";
            })
            .addCase(register.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.isAuthenticated = false;
                state.user = null;
                state.error = true;
                state.loading= false;
                state.message = action.error.message;
            })
            .addCase(loadUser.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.message = "success: true";
            })
            .addCase(loadUser.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.message = action.error.message;
            })
            .addCase(logout.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.user = action.payload.user;
                state.loading = false;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.message = action.payload.message;
            })
            .addCase(logout.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.loading = false;
                state.message = action.error.message;
            })
            .addCase(updateProfile.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.message = "Updating...";
                state.isAuthenticated = null;
            })
            .addCase(updateProfile.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.updated = true;
                state.message = "success: true";
            })
            .addCase(updateProfile.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.updated = false;
                state.isAuthenticated =true;
                state.message = action.error.message;
            })
            .addCase(updateCurrentPassword.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.message = "Updating...";
                state.isAuthenticated = null;
            })
            .addCase(updateCurrentPassword.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.updated = true;
                state.message = "success: true";
            })
            .addCase(updateCurrentPassword.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.updated = false;
                state.isAuthenticated =true;
                state.message = action.error.message;
            })
            .addCase(forgotPassword.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.message = "sending mail...";
            })
            .addCase(forgotPassword.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.message = "Mail sent to your email";
            })
            .addCase(forgotPassword.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
            })
            .addCase(resetPassword.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.message = "Resetting Password...";
            })
            .addCase(resetPassword.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.message = "Password reset successfully";
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(resetPassword.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.message = action.error.message;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(getAllUsers.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.loading = true;
                state.message = "Getting All Users...";
            })
            .addCase(getAllUsers.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.loading =false;
                state.allUsers = action.payload.users;
            })
            .addCase(getAllUsers.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.loading =false;
                state.message = action.error.message;
            })
            .addCase(deleteUser.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.loading = true;
                state.message = "Deleting Users...";
            })
            .addCase(deleteUser.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.loading =false;
                state.allUsers = state.allUsers.filter((user)=> user._id !== action.payload.id);
            })
            .addCase(deleteUser.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.loading =false;
                state.message = action.error.message;
            })
            .addCase(getUserDetailAdmin.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.loading = true;
                state.message = "Getting Details...";
            })
            .addCase(getUserDetailAdmin.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.loading =false;
                state.userDetailsAdmin = action.payload.user;
            })
            .addCase(getUserDetailAdmin.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.loading =false;
                state.message = action.error.message;
            })
            .addCase(updateUserDetailAdmin.pending, (state, action)=>{
                state.status = STATUSES.LOADING;
                state.loading = true;
                state.message = "Updating Role...";
            })
            .addCase(updateUserDetailAdmin.fulfilled, (state,action)=>{
                state.status = STATUSES.SUCCESS;
                state.loading =false;
                state.message = "Role updated";
            })
            .addCase(updateUserDetailAdmin.rejected, (state,action)=>{
                state.status = STATUSES.ERROR;
                state.loading =false;
                state.message = action.error.message;
            })
    }
})


export const {clearError,clearUpdated} = userSlice.actions;

export default userSlice.reducer;