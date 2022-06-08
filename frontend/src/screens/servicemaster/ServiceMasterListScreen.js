import React, { useState, useEffect } from 'react'
import { Tab, Tabs, Col, Button, Row  } from 'react-bootstrap'
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from './../../components/app/Breadcrumb';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import TableContainer from './../../components/app/TableContainer';

//pdir templates
import PDIRTable from './../../components/tables/qa/PDIRTable';
import { listAllServiceMasters } from './../../actions/masters/serviceMasterActions';
import ServiceMasterTable from './../../components/tables/masters/ServiceMasterTable';



const ServiceMasterListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allServiceMasterList = useSelector((state) => state.allServiceMasterList)
	const { loading, serviceMasters, error } = allServiceMasterList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
         dispatch(listAllServiceMasters(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <TableContainer
         title = "Service Master List"
         listPage = "servicemaster"
         actionName = "Add Service"
         data = {serviceMasters}
         TableName = {ServiceMasterTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default ServiceMasterListScreen
