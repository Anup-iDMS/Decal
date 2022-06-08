//import standard React Components
import React, { useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'

import { listAllJobCards } from './../../actions/production/jobCardActions';

//Table component
import JobInputTable from './../../components/tables/production/JobInputTable';
import TableContainer from './../../components/app/TableContainer';

//import Redux "constantc(s)"
import { JOB_CARD_LIST_RESET } from '../../constants/production/jobCardConstants';

const JobCardInputListScreen = ({ location, history, match }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const jobStatus = match.params.jobStatus || "All"

   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allJobCardList = useSelector((state) => state.allJobCardList)
	const { loading, jobCards, error:errorLoad } = allJobCardList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllJobCards(pageNumber, jobStatus))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <TableContainer
         title = "Job Card Input Entry List"
         listPage = "jobcardinput"
         actionName = "Add Input Entry"
         data = {jobCards}
         TableName = {JobInputTable}
         loading = {loading}
         error = {errorLoad}
      />
   )
}

export default JobCardInputListScreen
