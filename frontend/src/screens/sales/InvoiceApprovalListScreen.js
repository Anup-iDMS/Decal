//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import { listAllApprovedDRNs } from '../../actions/production/drnActions';
import InvoiceApprovalTable from '../../components/tables/sales/InvoiceApprovalTable';
import TableContainer from '../../components/app/TableContainer';

const InvoiceApprovalListScreen = ({ match, history }) => {
   
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allApprovedDRNList = useSelector((state) => state.allApprovedDRNList)
	const { loading, drns, error } = allApprovedDRNList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllApprovedDRNs(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <TableContainer
         title = "Tax Invoice Approval Pending List"
         listPage = "#"
         actionName = ""
         data = {drns}
         TableName = {InvoiceApprovalTable}
         loading = {loading}
         error = {error}
         showActionButton = {false}
      />
   )
}

export default InvoiceApprovalListScreen
