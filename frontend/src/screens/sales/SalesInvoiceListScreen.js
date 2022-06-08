//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import { listAllSalesInvoices } from './../../actions/sales/salesInvoiceActions';

import TableContainer from '../../components/app/TableContainer';
import SalesInvoiceTable from './../../components/tables/sales/SalesInvoiceTable';

const SalesInvoiceListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allSalesInvoiceList = useSelector((state) => state.allSalesInvoiceList)
	const { loading, salesInvoices, error } = allSalesInvoiceList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllSalesInvoices(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <TableContainer
         title = "Tax Invoice(s) List"
         listPage = "#"
         actionName = ""
         data = {salesInvoices}
         TableName = {SalesInvoiceTable}
         loading = {loading}
         error = {error}
         showActionButton = {false}
      />
   )
}

export default SalesInvoiceListScreen
