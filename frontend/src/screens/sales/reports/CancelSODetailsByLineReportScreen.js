//import standard React Components
import React, { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../../components/app/Message'
import Loader from '../../../components/app/Loader'

//import Sales Order Specific Redux "action(s)" 
import { getCancelSODetailsByLine } from './../../../actions/sales/salesOrderActions';
import CancelSalesOrderLineDetailsTable from './../../../components/tables/sales/CancelSalesOrderLineDetailsTable';
import TableContainer from './../../../components/app/TableContainer';

const CancelSODetailsByLineReportScreen = ({ location, history, match }) => {
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const cancelSODetailsByLine = useSelector((state) => state.cancelSODetailsByLine)
	const { loading, salesOrders, error:errorLoad } = cancelSODetailsByLine;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         dispatch(getCancelSODetailsByLine())
		}
	}, [dispatch, history, userInfo])

   return (
      <TableContainer
         title = "Cancel Sales Order List"
         listPage = "#"
         actionName = "Cancel Sales Order Line Details"
         data = {salesOrders}
         TableName = {CancelSalesOrderLineDetailsTable}
         loading = {loading}
         error = {errorLoad}
         showActionButton = {false}
      />
   )
}

export default CancelSODetailsByLineReportScreen
