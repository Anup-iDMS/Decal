//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import TableContainer from './../../components/app/TableContainer';
import ServiceCodeMasterTable from './../../components/tables/masters/ServiceCodeMasterTable';
import { listAllServiceCodes } from './../../actions/masters/serviceCodeActions';
import Breadcrumb from './../../components/app/Breadcrumb';

const ServiceCodeListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allServiceCodeList = useSelector((state) => state.allServiceCodeList)
	const { loading, serviceCodes, error } = allServiceCodeList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllServiceCodes(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <React.Fragment>
         <br></br>
         <TableContainer
            title = "Service Code List"
            listPage = "servicecode"
            actionName = "Add Service Code"
            data = {serviceCodes}
            TableName = {ServiceCodeMasterTable}
            loading = {loading}
            error = {error}
         />
      </React.Fragment>
     
   )
}

export default ServiceCodeListScreen