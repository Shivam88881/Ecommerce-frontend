import React, { lazy, useEffect } from 'react';
import { CgMouse } from 'react-icons/cg';
import "../styles/_home.scss";
import { useSelector, useDispatch } from "react-redux";
import { getProduct, clearError } from "../../redux/slice/productSlice";
import { useAlert } from 'react-alert';

import ProductCard from '../product/ProductCard';
import MetaData from '../layout/MetaData';



function Home() {
    const alert = useAlert()
    const dispatch = useDispatch()
    const { products, message, status } = useSelector((state) => state.products)

    useEffect(() => {
        const query = {currentPage:1};
        dispatch(getProduct(query));
        if (status === "ERROR") {
            alert.error(message);
            dispatch(clearError());
        }
    }, [dispatch, message]);

    return (
        <>
            <MetaData title="Ecommerce-Home" />
            <div className='banner'>
                <p>Welcome to Ecommerce</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>
                <a href='#container'>
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>
            <h2 className='home-heading'>Feature Products</h2>
            <div className='container' id='container'>
                {products && products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

        </>
    )
}

export default Home;
