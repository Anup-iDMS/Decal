//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "react-datepicker/dist/react-datepicker.css";

// React Notification
import { NotificationManager } from 'react-notifications';

//import Sales Order Specific Redux "action(s)" 
import TableContainer from './../../components/app/TableContainer';
import { getBalancedQtyBySO, updateSalesOrderCancelQty } from './../../actions/sales/salesOrderActions';
import  OpenOrdersBySOTable from './../../components/tables/sales/OpenOrdersBySOTable';
import { CANCEL_SO_LINE_UPDATE_RESET } from '../../constants/sales/salesOrderConstants';
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application';

const OpenSalesOrdersListScreen = ({ location, history, match }) => {
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const balancedQtyBySO = useSelector((state) => state.balancedQtyBySO)
	const { loading, salesOrders } = balancedQtyBySO;

   //post updated JC record
   const salesOrderUpdateCancelQty = useSelector((state) => state.salesOrderUpdateCancelQty);
   const { success, error: errorUpdate } = salesOrderUpdateCancelQty

   //console.log("----------- salesOrderUpdateCancelQty -------------- ", salesOrderUpdateCancelQty)
   //console.log("----------- success -------------- ", success)
   
   useEffect(() => {
		if (!userInfo) {
		  //history.push('/login')
		} else {
         dispatch(getBalancedQtyBySO())
         //dispatch({ type: BACK_ORDER_LIST_RESET })
		}
      //console.log("----------- inside useEffect and success -------------- ", success)
      if(success) {
         history.push('/openorderslist');
         dispatch({ type: CANCEL_SO_LINE_UPDATE_RESET })
         NotificationManager.success(`The Sales Order Line has been successfully canceled !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         NotificationManager.error(`Error in updating Sales Order Line !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

	}, [history, userInfo, dispatch, success])

   const submitCancelSO = (rowIndex, canceledReason) => {
      //console.log("OpenSalesOrdersListScreen submitCancelSO and selected Row is ==== ", rowIndex)
      //console.log("OpenSalesOrdersListScreen submitCancelSO and don't know what I get ==== ", canceledReason)
      const ordersData = [...salesOrders]
      const cancelSO = ordersData[rowIndex]
      //console.log("OpenSalesOrdersListScreen submitCancelSO and Order to be canceled is ==== ", cancelSO)
      dispatch(updateSalesOrderCancelQty(cancelSO._id, cancelSO.lineNumber, cancelSO.jcId,  cancelSO.balancedQty, canceledReason))
   }

   return (
      <TableContainer
         title = "Back Orders List By Line"
         listPage = "#"
         actionName = ""
         data = {salesOrders}
         submitCancelSO = {submitCancelSO}
         TableName = {OpenOrdersBySOTable}
         loading = {loading}
         error = {error}
         showActionButton = {false}
      />
   )
}

export default OpenSalesOrdersListScreen
