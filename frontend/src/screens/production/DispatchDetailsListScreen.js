//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//Table Component
import TableContainer from './../../components/app/TableContainer';
import DispatchDetailsTable from './../../components/tables/production/DispatchDetailsTable';

import { listAllDispatchDetails } from '../../actions/production/dispatchDetailsActions';

const DispatchDetailsListScreen = ({ match, history, location }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user, loading: loadingUser } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const dispatchDetailsList = useSelector((state) => state.allDispatchDetailsList)
	const { loading, dispatchDetails } = dispatchDetailsList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
         dispatch(listAllDispatchDetails(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <TableContainer
         title = "Dispatch Details List"
         listPage = "dispatchdetails"
         actionName = "Add Dispatch Details"
         data = {dispatchDetails}
         TableName = {DispatchDetailsTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default DispatchDetailsListScreen
