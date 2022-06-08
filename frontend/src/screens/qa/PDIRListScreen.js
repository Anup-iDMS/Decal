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
import { deletePDIR, listAllPDIRs } from './../../actions/qa/pdirActions';

const PDIRListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allPDIRList = useSelector((state) => state.allPDIRList)
	const { loading, pdirs, error } = allPDIRList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
         dispatch(listAllPDIRs(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   const deleteHandler = (id) => {
      if (window.confirm('Are you sure you want delete the record?')) {
        dispatch(deletePDIR(id))
        window.location.reload();
      }
   }


   return (
      <TableContainer
         title = "PDIR List"
         listPage = "pdir"
         actionName = "Generate PDIR"
         data = {pdirs}
         TableName = {PDIRTable}
         loading = {loading}
         error = {error}
         onDelete = {deleteHandler}
      />
   )
}

export default PDIRListScreen
