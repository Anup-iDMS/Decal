//import standard React Components
import React, { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../../components/app/Message'
import Loader from '../../../components/app/Loader'

//import Sales Order Specific Redux "action(s)" 
import { getSODetailsByLine } from './../../../actions/sales/salesOrderActions';
import SalesOrderLineDetailsTable from './../../../components/tables/sales/SalesOrderLineDetailsTable';
import TableContainer from './../../../components/app/TableContainer';

const SODetailsByLineReportScreen = ({ location, history, match }) => {
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const soDetailsByLine = useSelector((state) => state.soDetailsByLine)
	const { loading, salesOrders, error:errorLoad } = soDetailsByLine;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         dispatch(getSODetailsByLine())
		}
	}, [dispatch, history, userInfo])

   return (
      <TableContainer
         title = "Sales Order List"
         listPage = "#"
         actionName = "Sales Order Line Details"
         data = {salesOrders}
         TableName = {SalesOrderLineDetailsTable}
         loading = {loading}
         error = {errorLoad}
      />
   )
}

export default SODetailsByLineReportScreen
