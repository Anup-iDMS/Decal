//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TableContainer from '../../components/app/TableContainer';

//import Redux "action(s)" 
import { listAllCompanies, deleteModule } from './../../actions/masters/companyActions'
import CompanyMasterTable from './../../components/tables/masters/CompanyMasterTable';

const CompanyMasterListScreen = ({ location, history, match }) => {
	
	const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const companyList = useSelector((state) => state.allCompanyList)
	const { loading, company } = companyList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllCompanies(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])


   return (
      <TableContainer
         title = "Company List"
         listPage = "company"
         actionName = "Generate Module"
         data = {company}
         TableName = {CompanyMasterTable}
         loading = {loading}
         error = {error}
         showActionButton = {false}
      />
   )
}

export default CompanyMasterListScreen