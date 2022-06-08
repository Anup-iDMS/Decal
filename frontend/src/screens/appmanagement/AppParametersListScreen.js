//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import TableContainer from '../../components/app/TableContainer';

import AppParametersTable from './../../components/tables/masters/AppParametersTable';
//Param Action
import { listAllAppParameters } from './../../actions/masters/appParameterActions';

const AppParametersListScreen = ({ history, match }) => {

   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allAppParameterList = useSelector((state) => state.allAppParameterList)
	const { loading, appParameters } = allAppParameterList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         if (!user || !user.name ) {
            dispatch(listAllAppParameters(pageNumber))
		   }
		}
	}, [dispatch, history, userInfo, user, pageNumber])


   return (
      <TableContainer
         title = "Application Paramters List"
         listPage = "parameters"
         actionName = "Add Parameter"
         data = {appParameters}
         TableName = {AppParametersTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default AppParametersListScreen

