//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import TableContainer from '../../components/app/TableContainer';
import UserTable from './../../components/tables/masters/UserTable';
import { listAllUsers } from './../../actions/masters/userActions';

const UserListScreen = ({ match, history }) => {
   //const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const userList = useSelector((state) => state.allUserList)
	const { loading, error, users } = userList;

   useEffect(() => {
		//if (userInfo && userInfo.isAdmin) {
		if (userInfo) {
         dispatch(listAllUsers())
      } else {
         history.push('/login')
      }
	}, [dispatch, history, userInfo, user])

   return (
      <TableContainer
         title = "Application Users List"
         listPage = "user"
         actionName = "Add User"
         data = {users}
         TableName = {UserTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default UserListScreen
