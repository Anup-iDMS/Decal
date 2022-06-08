//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import { listAllDRNs } from './../../actions/production/drnActions';

import DRNTable from '../../components/tables/production/DRNTable';
import TableContainer from '../../components/app/TableContainer';


const DRNListScreen = ({ match, history }) => {
   
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const drnList = useSelector((state) => state.allDRNList)
	const { loading, drns } = drnList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllDRNs(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])


   return (
      <TableContainer
         title = "Dispatch Request Note List"
         listPage = "drn"
         actionName = "Generate DRN"
         data = {drns}
         TableName = {DRNTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default DRNListScreen
