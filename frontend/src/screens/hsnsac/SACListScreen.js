//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import TableContainer from '../../components/app/TableContainer';

//SAC Codes Action
import { listAllSACs } from '../../actions/masters/sacActions';

//Table component
import SACTable from '../../components/tables/masters/SACTable';

const SACListScreen = ({ history, match }) => {

   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allSACList = useSelector((state) => state.allSACList)
	const { loading, sacCodes } = allSACList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         if (!user || !user.name ) {
            dispatch(listAllSACs(pageNumber))
		   }
		}
	}, [dispatch, history, userInfo, user, pageNumber])


   return (
      <TableContainer
         title = "SAC List"
         listPage = "sac"
         actionName = "Add SAC"
         data = {sacCodes}
         TableName = {SACTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default SACListScreen
