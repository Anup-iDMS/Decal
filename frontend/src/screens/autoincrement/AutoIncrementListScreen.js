//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import TableContainer from './../../components/app/TableContainer';
import AutoIncrementMasterTable from './../../components/tables/masters/AutoIncrementMasterTable';
import { listAllAutoIncrements } from './../../actions/masters/autoIncrementActions';
import Breadcrumb from './../../components/app/Breadcrumb';

const AutoIncrementListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allAutoIncrementList = useSelector((state) => state.allAutoIncrementList)
	const { loading, autoIncrements, error } = allAutoIncrementList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllAutoIncrements(pageNumber))
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
            title = "Auto Increment Module List"
            listPage = "autoincrement"
            actionName = "Add Auto Increment Module"
            data = {autoIncrements}
            TableName = {AutoIncrementMasterTable}
            loading = {loading}
            error = {error}
         />
      </React.Fragment>
     
   )
}

export default AutoIncrementListScreen
