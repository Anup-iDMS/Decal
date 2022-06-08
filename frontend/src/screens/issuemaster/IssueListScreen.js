//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import { listAllIssues } from './../../actions/masters/issueActions';

import IssueTable from '../../components/tables/masters/IssueTable';
import TableContainer from '../../components/app/TableContainer';

const IssueListScreen = ({ location, history, match }) => {
	
	const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const issueList = useSelector((state) => state.allIssueList)
	const { loading, issues } = issueList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllIssues(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])


   return (
      <TableContainer
         title = "Issue List"
         listPage = "issue"
         actionName = "Generate Issue"
         data = {issues}
         TableName = {IssueTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default IssueListScreen