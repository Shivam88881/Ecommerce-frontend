import React, { useEffect, useState } from 'react';
import ReactTableMaterial from '../ReactTableMaterial/ReactTableMaterial';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import Loader from '../layout/loader/Loader';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { cancelOrder, getAllOrdersAdmin } from '../../redux/slice/orderSlice';
import Sidebar from './Sidebar';


function OrderAdmin() {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);

    const { ordersAdmin, loading } = useSelector(state => state.order);

    const handleOrderCancel = (id,status) => {
        if(status === 'Delivered'){
            alert.error("Product is already delivered");
            return;
        }

        if(status === 'Cancelled'){
            alert.error("Product is already Cancelled");
            return;
        }
        dispatch(cancelOrder({id}));
    }
    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing':
                return 'blue';
            case 'Shipped':
                return 'purple';
            case 'Delivered':
                return 'green'; 
            case 'Cancelled':
                return 'red';
            default:
                return 'black';
        }
    };
    useEffect(() => {
        dispatch(getAllOrdersAdmin());
    }, [dispatch])
    
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


    const columns = [
        {
            accessorKey: '_id',
            header: 'Product ID'
        },
        {
            accessorKey: 'orderStatus',
            header: 'Status',
            Cell: ({ row }) => {
                return <span style={{ color: getStatusColor(row.original.orderStatus) }}>{row.original.orderStatus}</span>
            }
        },
        {
            accessorKey: 'orderItems', // Accessing the orderItems array directly
            header: 'Quantity',
            Cell: ({ row }) => {
                // Displaying quantity values directly in the "Quantity" column
                var totalItem = 0;
                row.original.orderItems.map((item) => {
                    totalItem += item.quantity;
                })
                return (
                    totalItem
                );
            },
        },
        {
            accessorKey: 'totalPrice',
            header: 'Amount(₹)'
        },
        {
            accessorKey: 'paymentInfo',
            header: 'payment Info',
            Cell:({row})=>{
                return <span style={{color:row.original.paymentInfo.status==="succeeded"? 'green':'red'}}>{row.original.paymentInfo.status}</span>
            }
        },
        {
            accessor: 'action',
            flex: 0.3,
            header: 'Actions',
            size: 20,
            sortable: false,
            Cell: ({ row }) => {
                return (
                    <div>
                        <Link to={`/admin/order/update/${row.original._id}`}><EditIcon /></Link>
                        <span onClick={() => handleOrderCancel(row.original._id,row.original.orderStatus)} style={{ cursor: 'pointer' }}><CancelIcon /></span>
                    </div>
                );
            },
        },
    ]

    if (loading) {
        return <Loader />
    }
    console.log(ordersAdmin);
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
                <div>
                    {
                        ordersAdmin && <ReactTableMaterial columns={columns} data={ordersAdmin} />
                    }
                </div>
            </div>
        </div></>
    )
}

export default OrderAdmin
