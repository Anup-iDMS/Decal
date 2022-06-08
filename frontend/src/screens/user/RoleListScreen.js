//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import TableContainer from '../../components/app/TableContainer';
import RoleTable from './../../components/tables/masters/RoleTable';
import { listAllRoles } from './../../actions/masters/userActions';

const RoleListScreen = ({ match, history }) => {
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allRoleList = useSelector((state) => state.allRoleList)
	const { loading, error, roles } = allRoleList;

   useEffect(() => {
		//if (userInfo && userInfo.isAdmin) {
		if (userInfo) {
         dispatch(listAllRoles())
      } else {
         history.push('/login')
      }
	}, [dispatch, history, userInfo, user])

   return (
      <TableContainer
         title = "Application Roles List"
         listPage = "role"
         actionName = "Add Role"
         data = {roles}
         TableName = {RoleTable}
         loading = {loading}
         error = {error}
      />
   )
}

export default RoleListScreen
