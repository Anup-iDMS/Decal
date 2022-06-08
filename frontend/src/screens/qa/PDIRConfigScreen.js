import React, { useState, useEffect } from 'react'
import { Tab, Tabs, Col, Button, Row  } from 'react-bootstrap'
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from './../../components/app/Breadcrumb';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import TableContainer from './../../components/app/TableContainer';
//inspection params
import { listAllInspectionParameters } from './../../actions/qa/inspectionParameterActions';
import InpectionParametersTable from './../../components/tables/qa/InpectionParametersTable';
//inspection methods
import InpectionMethodsTable from './../../components/tables/qa/InpectionMethodsTable';
import { listAllInspectionMethods } from './../../actions/qa/inspectionMethodActions';
//pdir templates
import PDIRTemplateTable from './../../components/tables/qa/PDIRTemplateTable';
import { listAllPDIRTemplates } from './../../actions/qa/pdirTemplateActions';


const PDIRConfigScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allInspectionParameterList = useSelector((state) => state.allInspectionParameterList)
	const { loading, inspectionParameters, error } = allInspectionParameterList;

   const allInspectionMethodList = useSelector((state) => state.allInspectionMethodList)
	const { loading:loadingInspMeth, inspectionMethods, error: errorInspMeth } = allInspectionMethodList;

   const allPDIRTemplateList = useSelector((state) => state.allPDIRTemplateList)
	const { loading:loadingPDIRTemplates, pdirTemplates, error: errorPDIRTemplates } = allPDIRTemplateList;


   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
         dispatch(listAllInspectionParameters(pageNumber))
         dispatch(listAllInspectionMethods(pageNumber))
         dispatch(listAllPDIRTemplates(pageNumber))
		  }
		}
	}, [dispatch, history, userInfo, user, pageNumber])

   const [key, setKey] = useState('inspectparam');

   return (
      <FormContainer>
         <Row className='align-items-center'>
            <Col lg={12}>
               <h4>PDIR Configuration Parameters</h4>
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
                  <Tab eventKey="inspectparam" title="Manage Inspection Parameters" style={{ background:"white" }}>
                     <TableContainer
                        title = "Inspection Parameters List"
                        listPage = "inspectionparameter"
                        actionName = "Add Inspection Parameter"
                        data = {inspectionParameters}
                        TableName = {InpectionParametersTable}
                        loading = {loading}
                        error = {error}
                     />
                  </Tab>
                  <Tab eventKey="inspectmethod" title="Manage Inspection Methods" style={{ background:"white" }}>
                     <TableContainer
                        title = "Inspection Methods List"
                        listPage = "inspectionmethod"
                        actionName = "Add Inspection Method"
                        data = {inspectionMethods}
                        TableName = {InpectionMethodsTable}
                        loading = {loadingInspMeth}
                        error = {errorInspMeth}
                     />
                  </Tab>
                  <Tab eventKey="pdirtemplate" title="Manage PDIR Templates" style={{ background:"white" }}>
                     <TableContainer
                        title = "PDIR Templates List"
                        listPage = "pdirtemplate"
                        actionName = "Add PDIR Template"
                        data = {pdirTemplates}
                        TableName = {PDIRTemplateTable}
                        loading = {loadingPDIRTemplates}
                        error = {errorPDIRTemplates}
                     />
                  </Tab>
               </Tabs>
            </Col>
         </Row>
      </FormContainer>
   )
}

export default PDIRConfigScreen
