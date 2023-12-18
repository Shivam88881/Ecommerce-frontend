import React, { useEffect, useState } from 'react';
import '../styles/_products.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getProduct, clearError } from '../../redux/slice/productSlice';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import ProductCard from './ProductCard';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';


function Products() {
  const alert = useAlert()
  const dispatch = useDispatch();
  const { products, productsCount, message, status, resultPerPage } = useSelector((state) => state.products);
  const { keyword } = useParams();

  const categories = [
    "All",
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "smartPhones"
  ]

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 1000000]);
  const [productCategory, setProductCategory] = useState('');
  const [ratings, setRatings] = useState(0);
  const [showFilterBox, setShowFilterBox] = useState(window.innerWidth > 600);



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  }

  useEffect(() => {
    if (productCategory === "All") {
      setProductCategory("");
    }
    const query = { keyword: keyword, currentPage: currentPage, price: price, productCategory: productCategory, ratings: ratings };
    dispatch(getProduct(query));
    if (status === "ERROR") {
      alert.error(message);
      dispatch(clearError);
    }

  }, [keyword, currentPage, price, productCategory, ratings]);


  const handleFilterButtonClick = () => {
    setShowFilterBox(!showFilterBox);
  };

  const handleWindowResize = () => {
    setShowFilterBox(window.innerWidth > 600);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className='products-container'>
      {
        window.innerWidth <= 600  && <button onClick={handleFilterButtonClick}>Filter</button>
      }
      {
        showFilterBox && <div className='filter-box'>
        <Typography>Price</Typography>
        <Slider
          size="small"
          value={price}
          aria-labelledby="range-slider"
          valueLabelDisplay="auto"
          onChange={priceHandler}
          min={0}
          max={1000000}
        />
        <Typography>Categories</Typography>
        <ul className='category-box'>
          {
            categories.map((category, index) => (
              <li
                className='category-link'
                key={index}
                onClick={() => setProductCategory(category)}
              >
                {
                  category
                }
              </li>
            ))
          }
        </ul>
        <fieldset>
          <Typography component="legend">Ratings Above</Typography>
          <Slider
            size='small'
            value={ratings}
            onChange={(e, newRatings) => setRatings(newRatings)}
            aria-labelledby='continuous-slider'
            min={0}
            max={5}
            valueLabelDisplay='auto'
          />
        </fieldset>
      </div>
      }
        
      <div>
        <MetaData title="PRODUCTS--ECOMMERCE" />
        <h2 className='products-heading'>Products</h2>
        <div className='products'>
          {products &&
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>

        {
          resultPerPage < productsCount && <div className='pagination-box'>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={resultPerPage}
              totalItemsCount={productsCount}
              onChange={handlePageChange} // Use the correct function
              nextPageText='Next'
              prevPageText='Prev'
              firstPageText='1st'
              lastPageText='Last'
              itemClass='page-item'
              linkClass='page-link'
              activeClass='pageItemActive'
              activeLinkClass='pageLinkActive'
            />
          </div>
        }
      </div>
    </div>
  );
}

export default Products;
