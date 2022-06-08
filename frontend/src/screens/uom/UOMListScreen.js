//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import TableContainer from './../../components/app/TableContainer';
import UOMMasterTable from './../../components/tables/masters/UOMMasterTable';
import { listAllUOMs } from './../../actions/masters/uomActions';
import Breadcrumb from './../../components/app/Breadcrumb';

const UOMListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allUOMList = useSelector((state) => state.allUOMList)
	const { loading, uoms, error } = allUOMList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllUOMs(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   return (
      <React.Fragment>
         <br></br>
         <Breadcrumb
            listPage = "configuration"
         />
         <br></br>
         <TableContainer
            title = "UOM List"
            listPage = "uom"
            actionName = "Add UOM"
            data = {uoms}
            TableName = {UOMMasterTable}
            loading = {loading}
            error = {error}
         />
      </React.Fragment>
     
   )
}

export default UOMListScreen

