import React, { useEffect } from 'react';
import ReactTableMaterial from '../ReactTableMaterial/ReactTableMaterial';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import {Link} from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import Loader from '../layout/loader/Loader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteProduct, getAllProductAdmin } from '../../redux/slice/productSlice';

function ProductList() {

  const dispatch = useDispatch();
  const alert = useAlert();

  const {adminProducts, loading} = useSelector(state=>state.products);

  const handleProductDelete = (id)=>{
    dispatch(deleteProduct({id}));
  }
  useEffect(()=>{
    if(adminProducts.length === 0){
      dispatch(getAllProductAdmin());
    }
  },[adminProducts])


  const columns = [
    {
      accessorKey: '_id',
      header: 'Product ID'
    },
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'stock',
      header: 'Available Stock'
    },
    {
      accessorKey: 'price',
      header: 'Price(₹)'
    },
    {
      accessor: 'action',
      flex:0.3,
      header: 'Actions',
      size: 20,
      sortable:false,
      Cell: ({ row }) => {
          return (
            <div>
              <Link to={`/admin/product/update/${row.original._id}`}><EditIcon/></Link>
              <span onClick={()=>handleProductDelete(row.original._id)} style={{cursor:'pointer'}}><DeleteIcon/></span>
            </div>
          );
        },
  },
  ]

  if(loading){
    return <Loader/>
  }

  return (
    <div>
      <ReactTableMaterial columns={columns} data={adminProducts} />
    </div>
  )
}

export default ProductList
