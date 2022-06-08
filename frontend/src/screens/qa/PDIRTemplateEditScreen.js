//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select'

// React Notification
import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from '../../components/app/Breadcrumb';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';
import { logger } from './../../util/ConsoleHelper';

import { getPDIRTemplateDetails, updatePDIRTemplate } from '../../actions/qa/pdirTemplateActions';
import { PDIR_TEMPLATE_UPDATE_RESET } from '../../constants/qa/pdirTemplateConstants';



const PDIRTemplateEditScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const templateId = match.params.id;
   
   const pdirTemplateDetails = useSelector((state) => state.pdirTemplateDetails)

   const { loading, pdirTemplate, error } = pdirTemplateDetails;

   console.log(">>>>>>>>>>>>>>>>>>>>>> pdirTemplate >>>>>>>>>>>>  ", pdirTemplate)

   //post updated the record
   const pdirTemplateUpdate = useSelector((state) => state.pdirTemplateUpdate);
   const { success: successUpdate, error: errorUpdate } = pdirTemplateUpdate

   const [ pdirTemplateCode, setPDIRTemplateCode ] = useState("");
   const [ pdirTemplateName, setPDIRTemplateName ] = useState("");
   const [ productCode, setProductCode ] = useState("");
   const [ inspectionParameter, setInspectionParameter ] = useState("");
   const [ inspectionMethod, setInspectionMethod ] = useState("");
   const [ inspectionStandard, setInspectionStandard ] = useState("");
   const [ isActive, setIsActive ] = useState("Yes");
   const [ pdirDetails, setPDIRDetails ] = useState([{}]);
   const [ selectedInspParam, setSelectedInspParam ] = useState([{}]);
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   const masterDataForPDIRTemplate = useSelector((state) => state.masterDataForPDIRTemplate);
   const { loading: loadingMasterData } = masterDataForPDIRTemplate;

   let prodCategories = [];
   let prodCodes = [];
   let inspectionparams = [];
   let inspectionmethods = [];

   if(masterDataForPDIRTemplate !== undefined) {
      prodCategories = masterDataForPDIRTemplate.prodCategories;
      prodCodes = masterDataForPDIRTemplate.prodCodes;
      inspectionparams = masterDataForPDIRTemplate.inspectionparams;
      inspectionmethods = masterDataForPDIRTemplate.inspectionmethods;
   }

   useEffect(() => {
      
      if (pdirTemplate._id !== templateId) {
         dispatch(getPDIRTemplateDetails(templateId))
      } else {
         setFormData();
      }
      if(successUpdate) {
         history.push('/pdirconfig');
         dispatch({ type: PDIR_TEMPLATE_UPDATE_RESET })
         NotificationManager.success(`The record has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: PDIR_TEMPLATE_UPDATE_RESET })
         NotificationManager.error(`Error in updating the record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [templateId, pdirTemplate, successUpdate]);

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( pdirTemplateCode.trim().length === 0 ) {
         newErrors.pdirTemplateCode = 'Enter a Method Name!'
      }

      return newErrors;
   }

   const setFormData = () => {
      setPDIRTemplateCode(pdirTemplate.pdirTemplateCode)
      setPDIRTemplateName(pdirTemplate.pdirTemplateName)
      setProductCode(pdirTemplate.productCode)
      setPDIRDetails(pdirTemplate.pdirDetails)
   }

   //8. Form Submit
   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();
      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
         NotificationManager.error(`Please fill in the required details !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      } else {
         dispatch(
            updatePDIRTemplate({
               _id: templateId,
               productCode,
               pdirTemplateName,
               pdirDetails,
               isActive
            })
         );
      }
   }

   //7. Form Reset
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const handleReset = () => {
      window.location.reload();
   }

   const handleActiveStatus = (e) => {
      setIsActive(e.target.value)
   }

   const handleRemoveFields = id => {
      const values  = [...pdirDetails];
      values.splice(values.findIndex(value => value._id === id), 1);
      setPDIRDetails(values);
   }

   const handleChangeInput = (index, id, event) => {
      let nama = [...pdirDetails];
      const newInputFields = nama.map(i => {
         if(id === i._id) {
            i[event.target.name] = event.target.value
         }
         return i;
      })
      setPDIRDetails(newInputFields);
   }

   /** styling start */
   let tableStyle = {
      border: "1px solid black",
      width: "100%",
      height: "100%",
      fontFamily:"Arial"
   }
   /** styling end */

   return (
      <FormContainer>
         <Breadcrumb listPage = "pdirconfig" />
         <br></br>
         <Row>
            <Col>
               <h4>Edit PDIR Template</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Edit The Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='pdirTemplateCode'>
                        <Form.Label>PDIR Template Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              readOnly
                              name='pdirTemplateCode'
                              value={pdirTemplateCode}
                              onChange={(e) => setPDIRTemplateCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.pdirTemplateCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='productCode'>
                           <Form.Label>Select Product Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              readOnly
                              name='productCode'
                              value={productCode}
                              onChange={(e) => setProductCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.productCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='pdirTemplateName'>
                        <Form.Label>PDIR Template Name<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='pdirTemplateName'
                              value={pdirTemplateName}
                              onChange={(e) => setPDIRTemplateName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.pdirTemplateName}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                  <Row>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='active'>
                           <Form.Label>Active<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              as='select'
                              custom
                              name='active'
                              placeholder='Select'
                              value={isActive}
                              onChange={(e) => handleActiveStatus(e)}
                           >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                           </Form.Control>
                           <p className="validation-error">{errors.role}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        <h5>Added PDIR Template Details</h5>
                     </Col>
                  </Row>
                  <hr></hr>
                  <Row>
                     <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                        <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" }}>
                           <thead>
                              <tr>
                                 <th className="col-2" style={{ ...tableStyle, color:"black" }}>#</th>
                                 <th className="col-8" style={{ ...tableStyle, color:"black" }}>Inspection Parameter</th>
                                 <th className="col-6" style={{ ...tableStyle, color:"black" }}>Method</th>
                                 <th className="col-6" style={{ ...tableStyle, color:"black" }}>STD Requirement</th>
                                 <th className="col-3" style={{ ...tableStyle, color:"black" }}></th>
                              </tr>
                           </thead>
                           <tbody>
                           </tbody>
                        </table>
                     </Col>             
                  </Row>
                  {pdirDetails.map((pdird, index) => (
                     <React.Fragment key={index}>
                        {index > 0?(
                           <React.Fragment>
                              <Row>
                                 <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                    <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed", marginTop:"-22px" }}>
                                       <tbody>
                                          <tr>
                                             <td  className="col-2" style={tableStyle} colSpan={1}>
                                                <b>{index}</b>
                                             </td>
                                             <td  className="col-8" style={tableStyle} colSpan={1}>
                                                <b>{pdird.inspectionParameter}</b>
                                             </td>
                                             <td  className="col-6" style={tableStyle} colSpan={1}>
                                                <b>{pdird.inspectionMethod}</b>
                                             </td>
                                             <td  className="col-6" style={tableStyle} colSpan={1}>
                                                <Form.Group controlId='inspectionStandard'>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={pdird.inspectionStandard}
                                                      name="inspectionStandard"
                                                      onChange={event => handleChangeInput(index, pdird._id, event)}
                                                   ></Form.Control>
                                                   <p className="validation-error">{errors.inspectionObservations}</p>
                                                </Form.Group>
                                             </td>
                                             <td  className="col-3 my-2" style={tableStyle} colSpan={1}>
                                                <Button
                                                   variant="danger" 
                                                   className="btn-sm my-2"
                                                   disabled={pdird.length === 1} 
                                                   onClick={() => handleRemoveFields(pdird._id)}
                                                >X
                                                </Button>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </Col>
                              </Row>
                           </React.Fragment>
                        ):(null)}
                        <br></br>  
                     </React.Fragment>
                     ))}
                  {/* START of LAST row in the form */}
                  <Row>
                     <Col style={{textAlign:"end"}}>
                        <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                        <Button 
                           type='submit' 
                           className=' my-3 btn-md button-class' 
                           onClick={(e) => e.currentTarget.blur()}
                        >
                           <i className="fas fa-save"></i> Save
                        </Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
      </FormContainer>
   )
}

export default PDIRTemplateEditScreen
