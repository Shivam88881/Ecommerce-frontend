import React from 'react';
import logo from '../../images/logo.png';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Link } from 'react-router-dom';
import '../styles/_sidebar.scss';

function Sidebar() {
  return (
    <div className='sidebar'>
      <Link to='/'>
        <img src={logo} alt='Ecommerce' />
      </Link>
      <Link to='/admin/dashboard'>
        <p>
            <SpaceDashboardIcon/> <span>Dashboard</span>
        </p>
      </Link>
      <Link>
         <TreeView
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon />}
        >

          <TreeItem nodeId='1' label='Products'>
            <Link to='/admin/products'>
              <TreeItem nodeId='2' label='All' icon={<PostAddIcon/>} />
            </Link>

            <Link to='/admin/product/create'>
              <TreeItem nodeId='3' label='Create' icon={<AddIcon/>} />
            </Link>


          </TreeItem>
        </TreeView>
      </Link>

      <Link to='/admin/orders'>
      <p><ListAltIcon/> <span>Orders</span></p>
      </Link>
      <Link to='/admin/users'>
        <p><PeopleIcon/> <span>Users</span></p>
      </Link>

      <Link to='/admin/reviews'>
        <p><RateReviewIcon/> <span>Reviews</span></p>
      </Link>
    </div>
  )
}

export default Sidebar
