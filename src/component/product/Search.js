import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/_search.scss';
import MetaData from '../layout/MetaData';

function Search() {
    const navigate = useNavigate();

    const searchSubmitHandler = (e)=>{
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`)
        }else{
            navigate('/products')
        }
    }

    const [keyword, setKeyword] = useState("");
  return (
    <>
    <MetaData title="Search--ECOMMERCE" />
        <form className='search-box' onSubmit={searchSubmitHandler}>
            <input type='text' placeholder='Search products...' onChange={(e)=> setKeyword(e.target.value)}/>
            <button type='submit'>Submit</button>
        </form>
    </>
  )
}

export default Search;
