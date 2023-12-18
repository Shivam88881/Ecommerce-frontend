import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Loader from '../layout/loader/Loader';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children,isAdmin }) {

    const {isAuthenticated,user} = useSelector(state=>state.user);

    if(isAuthenticated===null){
        return <Loader/>
    }

    if(isAuthenticated===false){
        return <Navigate to={"/user/authentication"}/>
    }

    if(isAdmin === true && user.role !== 'admin'){
        return <Navigate to={"/user/authentication"}/>
    }

    return (
        children? children:<Outlet/>
    );
}

export default ProtectedRoute;
