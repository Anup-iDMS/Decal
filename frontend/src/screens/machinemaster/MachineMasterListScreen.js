//import standard React Components
import React, { useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'

//HSN SAC Codes Action
import { listAllMachineMasters } from './../../actions/masters/machineActions';

//Table component
import MachineMasterTable from './../../components/tables/masters/MachineMasterTable';
import TableContainer from './../../components/app/TableContainer';

const MachineMasterListScreen = ({ history }) => {
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allMachineMasterList = useSelector((state) => state.allMachineMasterList)
	const { loading, machineMasters, error: errorLoad } = allMachineMasterList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         if (!user || !user.name ) {
            dispatch(listAllMachineMasters())
		   }
		}
	}, [dispatch, history, userInfo, user])

   return (
      <TableContainer
         title = "Machine List"
         listPage = "machine"
         actionName = "Add Machine"
         data = {machineMasters}
         TableName = {MachineMasterTable}
         loading = {loading}
         error = {errorLoad}
      />
   )
}

export default MachineMasterListScreen
