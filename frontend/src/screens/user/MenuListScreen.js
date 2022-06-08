//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import TableContainer from '../../components/app/TableContainer';
import { listAllMenuItems } from './../../actions/masters/userActions';
import MenuItemTable from './../../components/tables/masters/MenuItemTable';

const MenuListScreen = ({ match, history }) => {
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allMenuItemList = useSelector((state) => state.allMenuItemList)
	const { loading, error, menuItems } = allMenuItemList;
   
   useEffect(() => {
		//if (userInfo && userInfo.isAdmin) {
		if (userInfo) {
         dispatch(listAllMenuItems())
      } else {
         history.push('/login')
      }
	}, [dispatch, history, userInfo, user])

   return (
      <TableContainer
         title = "Application Menu(s) List"
         listPage = "menu"
         actionName = "Assign Menu To Role"
         data = {menuItems}
         TableName = {MenuItemTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default MenuListScreen
