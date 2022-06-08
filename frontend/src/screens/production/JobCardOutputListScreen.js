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
import JobOutputTable from './../../components/tables/production/JobOutputTable';
import TableContainer from './../../components/app/TableContainer';

//import Redux "constantc(s)"
import { JOB_CARD_LIST_RESET } from '../../constants/production/jobCardConstants';

const JobCardOutputListScreen = ({ location, history, match }) => {
   const pageNumber = match.params.pageNumber || 1
   const jobStatus = match.params.jobStatus || "OUTPUT"
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allJobCardList = useSelector((state) => state.allJobCardList)
	const { loading, jobCards, error:errorLoad } = allJobCardList;
   //console .log("1. Just coming to Sales Order List Screen and Details are ")

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         if (!user || !user.name ) {
			   dispatch(listAllJobCards(pageNumber, jobStatus))
		   }
		}
	}, [dispatch, history, userInfo, user, pageNumber, jobStatus])

   return (
      <TableContainer
         title = "Job Card Output Entry List"
         listPage = "jobcardoutput"
         actionName = "Add Output Entry"
         data = {jobCards}
         TableName = {JobOutputTable}
         loading = {loading}
         error = {errorLoad}
      />
   )
}

export default JobCardOutputListScreen
