//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import { listAllCreditNotes } from '../../actions/sales/creditNoteActions';

import TableContainer from '../../components/app/TableContainer';
import CreditNoteTable from '../../components/tables/sales/CreditNoteTable';


const CreditNoteListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allCreditNoteList = useSelector((state) => state.allCreditNoteList)
	const { loading, creditNotes, error } = allCreditNoteList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllCreditNotes(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <TableContainer
         title = "Credit Note(s) List"
         listPage = "creditnote"
         actionName = "Add Credit Note"
         data = {creditNotes}
         TableName = {CreditNoteTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default CreditNoteListScreen
