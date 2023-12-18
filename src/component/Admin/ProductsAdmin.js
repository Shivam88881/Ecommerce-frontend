import React, {useState,useEffect} from 'react';
import ProductList from './ProductList';
import Sidebar from './Sidebar';

function ProductsAdmin() {

  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);

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
            <h2>Products</h2>
            <div style={{marginTop:'1vmax'}}><ProductList/></div>
        </div>
    </div></>
  )
}

export default ProductsAdmin
