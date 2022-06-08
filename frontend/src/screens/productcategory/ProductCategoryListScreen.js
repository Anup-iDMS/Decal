//import standard React Components
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import TableContainer from './../../components/app/TableContainer';
import ProductCategoryMasterTable from './../../components/tables/masters/ProductCategoryMasterTable';
import { listAllProdCats } from './../../actions/masters/prodCatActions';
import Breadcrumb from './../../components/app/Breadcrumb';

const ProductCategoryListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allProdCategoryList = useSelector((state) => state.allProdCategoryList)
	const { loading, prodCats, error } = allProdCategoryList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllProdCats(pageNumber))
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
            listPage = "productcategory"
            actionName = "Add Product Code"
            data = {prodCats}
            TableName = {ProductCategoryMasterTable}
            loading = {loading}
            error = {error}
         />
      </React.Fragment>
     
   )
}

export default ProductCategoryListScreen

