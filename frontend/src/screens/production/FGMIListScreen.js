//import standard React Components
import React, { useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'

import { listAllFGMIs } from './../../actions/production/fgmiActions';

//Table component
import FGMITable from './../../components/tables/production/FGMITable';
import TableContainer from './../../components/app/TableContainer';

const FGMIListScreen = ({ location, history, match }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allFGMIList = useSelector((state) => state.allFGMIList)
	const { loading, fgmis, error:errorLoad } = allFGMIList;
   //console .log("1. Just coming to Sales Order List Screen and Details are ")

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllFGMIs(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return(
      <TableContainer
         title = "Finished Goods Material List"
         listPage = "fgmi"
         actionName = "Add FGM Entry"
         data = {fgmis}
         TableName = {FGMITable}
         loading = {loading}
         error = {errorLoad}
      />
   )
}

export default FGMIListScreen
