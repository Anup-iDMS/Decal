//import standard React Components
import React, { useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'

//import Sales Order Specific Redux "action(s)" 
import { listAllSalesOrders } from './../../actions/sales/salesOrderActions';
import SalesOrderTable from './../../components/tables/sales/SalesOrderTable';
import TableContainer from './../../components/app/TableContainer';

const SalesOrderListScreen = ({  history, match }) => {
   
   const pageNumber = match.params.pageNumber || 1

   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const solist = useSelector((state) => state.allSalesOrderList)
	const { loading, salesOrders, error: errorLoad } = solist;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllSalesOrders(pageNumber))
		  }
		}
      window.scrollTo(0, 0)
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <TableContainer
         title = "Sales Order List"
         listPage = "bookorder"
         actionName = "Book Sales Order"
         data = {salesOrders}
         TableName = {SalesOrderTable}
         loading = {loading}
         error = {errorLoad}
      />
   )
}

export default SalesOrderListScreen
