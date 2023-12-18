import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { getProductDetails, updateProduct } from '../../redux/slice/productSlice';
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from 'react-alert';
import { useNavigate, useParams } from 'react-router-dom';

import { Spellcheck, CurrencyRupee, Description, Category, FormatListNumbered } from '@mui/icons-material';
import Loader from '../layout/loader/Loader';
import '../styles/_productUpdate.scss';

function ProductUpdate() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { product, loading } = useSelector((state) => state.products);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [discription, setDiscription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productImages, setProductImages] = useState([]);
    const [images, setImages] = useState([]);
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('stock', stock);
            formData.append('description', discription);
            formData.append('category', productCategory);
            images.forEach((image, index) => {
                formData.append('images', image);
            });
            await dispatch(updateProduct({ id, formData }));
        } catch (error) {
            console.error('Error updating product:', error);
        }
        navigate('/admin/products');
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) {
            return;
        }
        console.log('image change');
        setImages([]);
        setProductImages([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImages(prev => [...prev, reader.result]);
                    setProductImages(prev => [...prev, reader.result]);
                }
            }
            reader.readAsDataURL(file);
        });

    }

    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "smartPhones"
    ];

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getProductDetails(id));
        };

        fetchData();
    }, [dispatch, id]);

    useEffect(() => {
        if (Object.keys(product).length !== 0) {
            setName(product.name);
            setPrice(product.price);
            setDiscription(product.description);
            setProductCategory(product.category);
            if (product.images && product.images.length > 0) {
                setProductImages(prev => product.images.map(image => image.url));
            }
            setStock(product.stock);
        }
    }, [product]);

    const handleSidebarButtonClick = () => {
        setShowSidebar(!showSidebar);
      };
    
      const handleWindowResize = () => {
        setShowSidebar(window.innerWidth > 600);
      };
    
      useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);

    if (loading) {
        return <Loader />
    }

    return (
        <>
        {
        window.innerWidth <= 600 && <button onClick={handleSidebarButtonClick} className='show-sidebar-btn'>Sidebar</button>
      }
        <div className='admin-container'>
            {
          showSidebar && <Sidebar />
        }
            <div className='main'>
                <div className='container'>
                    <div className='product-detail-container'>
                        <h2>Product Details</h2>
                        <form className='product-detail-form' onSubmit={handleSubmit}>

                            <div className='name'>
                                <Spellcheck />
                                <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className='price'>
                                <CurrencyRupee />
                                <input type='Number' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>

                            <div className='description'>
                                <Description />
                                <input type='text' placeholder='Description' value={discription} onChange={(e) => setDiscription(e.target.value)} />
                            </div>

                            <div className='category'>
                                <Category />
                                <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}
                                    required={true}>
                                    <option value=''>Choose Category</option>
                                    {
                                        categories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className='stock'>
                                <FormatListNumbered />
                                <input type='Number' placeholder='Available Stock' value={stock} onChange={(e) => setStock(e.target.value)} />
                            </div>
                            <div className='images'>
                                <input type='file' accept='image/*' multiple onChange={(e) => handleImageChange(e)} />
                            </div>
                            <button type='submit'>Save</button>
                        </form>
                    </div>
                    <div className='preview'>
                        {
                            productImages.map((image, index) => (
                                <div key={index} className='image'>
                                    <img src={image} alt='Product-Image' />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div></>
    )
}

export default ProductUpdate
