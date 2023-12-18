import React from 'react';
import ReactTableMaterial from '../ReactTableMaterial/ReactTableMaterial';
import { useSelector } from 'react-redux';
import Loader from '../layout/loader/Loader';
import '../styles/_order.scss';
import { Link } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';


function Orders() {

  const { orders = [], loading } = useSelector(state => state.order);

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
  const columns = [
    {
      accessorKey: '_id',
      header: 'Order ID',
      size: 20,
    },
    {
      accessorKey: 'orderStatus',
      header: 'Status',
      size: 20,
      Cell: ({ row }) => {
        return <span style={{ color: getStatusColor(row.original.orderStatus) }}>{row.original.orderStatus}</span>
      }
    },
    {
      accessorKey: 'orderItems', // Accessing the orderItems array directly
      header: 'Quantity',
      size: 20,
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
      header: 'Amount',
      size: 20,
    },
    {
      accessor: 'action',
      flex: 0.3,
      header: 'Action',
      size: 20,
      sortable: false,
      Cell: ({ row }) => {
        return (
          <Link to={`/order/${row.original._id}`}><LaunchIcon /></Link>
        );
      },
    },

  ];

  if (loading) {
    return <Loader />
  }

  return (
    <div className='order-table'>
      <ReactTableMaterial columns={columns} data={orders} />
    </div>
  )
}

export default Orders
