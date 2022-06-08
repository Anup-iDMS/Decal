//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//Table Component
import TableContainer from './../../components/app/TableContainer';
import DeliveryNoteTable from './../../components/tables/production/DeliveryNoteTable';
import { listAllDeliveryNotes } from './../../actions/production/deliveryNoteActions';



const DeliveryNoteListScreen = ({ match, history, location }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error, user, loading: userLoading } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const deliveryNotesList = useSelector((state) => state.allDeliveryNoteList)
	const { loading, deliveryNotes } = deliveryNotesList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
         dispatch(listAllDeliveryNotes(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <TableContainer
      title = "Generated ASN List"
      listPage = "deliverynote"
      actionName = "Add ASN"
      data = {deliveryNotes}
      TableName = {DeliveryNoteTable}
      loading = {loading}
      error = {error}
   />
   )
}

export default DeliveryNoteListScreen
