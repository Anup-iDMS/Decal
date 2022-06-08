//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import TableContainer from './../../components/app/TableContainer';
import ProductCodeMasterTable from './../../components/tables/masters/ProductCodeMasterTable';
import { listAllProdCodes } from './../../actions/masters/prodCodeActions';
import Breadcrumb from './../../components/app/Breadcrumb';

const ProductCodeListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allProductCodeList = useSelector((state) => state.allProductCodeList)
	const { loading, productCodes, error } = allProductCodeList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllProdCodes(pageNumber))
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
            title = "Product Code List"
            listPage = "productcode"
            actionName = "Add Product Code"
            data = {productCodes}
            TableName = {ProductCodeMasterTable}
            loading = {loading}
            error = {error}
         />
      </React.Fragment>
     
   )
}

export default ProductCodeListScreen
