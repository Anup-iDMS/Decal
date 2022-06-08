//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import { listAllOpenDRNs } from './../../actions/production/drnActions';

import TableContainer from '../../components/app/TableContainer';
import DRNApprovalTable from './../../components/tables/qa/DRNApprovalTable';


const DRNApprovalListScreen = ({ match, history }) => {
   
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const drnList = useSelector((state) => state.allOpenDRNList)
	const { loading, drns } = drnList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllOpenDRNs(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])


   return (
      <TableContainer
         title = "DRN Pending Approval List"
         listPage = "drn"
         actionName = ""
         data = {drns}
         TableName = {DRNApprovalTable}
         loading = {loading}
         error = {error}
         showActionButton = {false}
      />
   )
}

export default DRNApprovalListScreen
