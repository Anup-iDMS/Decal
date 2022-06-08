//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import TableContainer from '../../components/app/TableContainer';

//HSN SAC Codes Action
import { listAllHSNSACs } from '../../actions/masters/hsnActions';

//Table component
import HSNTable from '../../components/tables/masters/HSNTable';

const HSNListScreen = ({ history, match }) => {

   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allHSNList = useSelector((state) => state.allHSNList)
	const { loading, hsnsacCodes } = allHSNList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         if (!user || !user.name ) {
            dispatch(listAllHSNSACs(pageNumber))
		   }
		}
	}, [dispatch, history, userInfo, user, pageNumber])


   return (
      <TableContainer
         title = "HSN List"
         listPage = "hsnsac"
         actionName = "Add HSN"
         data = {hsnsacCodes}
         TableName = {HSNTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default HSNListScreen
