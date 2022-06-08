import React, { useState, useEffect } from 'react'
import { Tab, Tabs, Col, Button, Row  } from 'react-bootstrap'
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from './../../components/app/Breadcrumb';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import TableContainer from './../../components/app/TableContainer';
import UOMMasterTable from './../../components/tables/masters/UOMMasterTable';
import ProductCodeMasterTable from './../../components/tables/masters/ProductCodeMasterTable';
import { listAllUOMs } from './../../actions/masters/uomActions';
import { listAllProdCodes } from './../../actions/masters/prodCodeActions';
import { listAllProdCats } from './../../actions/masters/prodCatActions';
import ProductCategoryMasterTable from './../../components/tables/masters/ProductCategoryMasterTable';
import AutoIncrementMasterTable from './../../components/tables/masters/AutoIncrementMasterTable';
import { listAllAutoIncrements } from './../../actions/masters/autoIncrementActions';

const ConfigurationScreen = ({ match, history }) => {

   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allUOMList = useSelector((state) => state.allUOMList)
	const { loading, uoms, error } = allUOMList;

   const allProductCodeList = useSelector((state) => state.allProductCodeList)
	const { loading: loadingProductCode, productCodes, error: errorProductCode } = allProductCodeList;

   const allProdCategoryList = useSelector((state) => state.allProdCategoryList)
	const { prodCats  } = allProdCategoryList;

   const allAutoIncrementList = useSelector((state) => state.allAutoIncrementList)
	const { autoIncrements } = allAutoIncrementList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
         dispatch(listAllUOMs(pageNumber))
         dispatch(listAllProdCodes(pageNumber))
         dispatch(listAllProdCats(pageNumber))
         dispatch(listAllAutoIncrements(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   const [key, setKey] = useState('prodcat');

   return (
      <FormContainer>
         <Row className='align-items-center'>
            <Col lg={12}>
               <h4>Application Configuration Parameters</h4>
            </Col>
         </Row>
         <br></br>
         <Row>
            <Col style={{ background:"white" }}>
               <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                  style={{ background:"white" }}
               >
                  <Tab eventKey="prodcat" title="Manage Product Category" style={{ background:"white" }}>
                     <TableContainer
                        title = "Product Category List"
                        listPage = "productcategory"
                        actionName = "Add Category Code"
                        data = {prodCats}
                        TableName = {ProductCategoryMasterTable}
                        loading = {loading}
                        error = {error}
                     />
                  </Tab>
                  <Tab eventKey="prodcode" title="Manage Product Code">
                     <TableContainer
                        title = "Product Code List"
                        listPage = "productcode"
                        actionName = "Add Product Code"
                        data = {productCodes}
                        TableName = {ProductCodeMasterTable}
                        loading = {loading}
                        error = {error}
                     />
                  </Tab>
                  <Tab eventKey="uom" title="Manage UOM">
                     <React.Fragment>
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
                  </Tab>
                  <Tab eventKey="autoIncrement" title="Manage Auto Increment">
                     <React.Fragment>
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
                  </Tab>
               </Tabs>
            </Col>
         
         </Row>
         <br></br>
      </FormContainer>   
   )
}

export default ConfigurationScreen
