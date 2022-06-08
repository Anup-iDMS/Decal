//import standard React Components
import React, { useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'


//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'

//import Redux "action(s)" 
import { 
   listJCMasters, 
   deleteJCMaster 
} from '../../actions/masters/jcMasterActions'

import JCMasterTable from '../../components/tables/masters/JCMasterTable'
import TableContainer from './../../components/app/TableContainer';
import { JC_LIST_RESET } from '../../constants/masters/jcMasterConstants'

const JCMasterListScreen = ({ history, match }) => {
   const pageNumber = match.params.pageNumber || 1
	
	const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin
	
	const jcl = useSelector((state) => state.jcMastersList)
	const { loading, error: errorLoad, jcMasters } = jcl;

	useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			//console .log("1. Inside JC MS Screen useEffect ==== ", pageNumber)
			dispatch(listJCMasters(pageNumber))
			dispatch({ type: JC_LIST_RESET })
		  }
		}
	}, [dispatch, history])

   return (
      <TableContainer
         title = "Job Code Number List"
         listPage = "createjc"
         actionName = "Add JC Master"
         data = {jcMasters}
         TableName = {JCMasterTable}
         loading = {loading}
         error = {errorLoad}
      />
   )
}

export default JCMasterListScreen
