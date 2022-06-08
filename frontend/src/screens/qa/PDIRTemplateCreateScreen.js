//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'

import { NotificationManager } from 'react-notifications';
import { v4 as uuidv4 } from 'uuid';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import { PDIR_TEMPLATE_LIST_RESET } from '../../constants/qa/pdirTemplateConstants';
import { createPDIRTemplate, getAllMasterDataForPDIRTemplate } from './../../actions/qa/pdirTemplateActions';



const PDIRTemplateCreateScreen = ({ history }) => {
   const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails)
  	const { user } = userDetails

  	const userLogin = useSelector((state) => state.userLogin)
  	const { userInfo } = userLogin

	const pdirTemplateCreate = useSelector((state) => state.pdirTemplateCreate)
	const { success, pdirTemplate, error: errorCreate } = pdirTemplateCreate

   const [ pdirTemplateCode, setPDIRTemplateCode ] = useState("");
   const [ pdirTemplateName, setPDIRTemplateName ] = useState("");
   const [ productCode, setProductCode ] = useState("");
   const [ inspectionParameter, setInspectionParameter ] = useState("");
   const [ inspectionMethod, setInspectionMethod ] = useState("");
   const [ inspectionStandard, setInspectionStandard ] = useState("");
   const [ pdirDetails, setPDIRDetails ] = useState([{}]);
   const [ selectedInspParam, setSelectedInspParam ] = useState([{}]);
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   const masterDataForPDIRTemplate = useSelector((state) => state.masterDataForPDIRTemplate)

   const { loading: loadingMasterData } = masterDataForPDIRTemplate;

   let prodCategories = [];
   let prodCodes = [];
   let inspectionparams = [];
   let inspectionmethods = [];

   let autoIncrementedPDIRTemplateNo = "";
   if(masterDataForPDIRTemplate !== undefined) {
      console.log("????????????????? masterDataForPDIRTemplate >>>>>>>>>>>>>> ", masterDataForPDIRTemplate)
      autoIncrementedPDIRTemplateNo = masterDataForPDIRTemplate.autoIncrementedPDIRTemplateNo;
      prodCategories = masterDataForPDIRTemplate.prodCategories;
      prodCodes = masterDataForPDIRTemplate.prodCodes;
      inspectionparams = masterDataForPDIRTemplate.inspectionparams;
      inspectionmethods = masterDataForPDIRTemplate.inspectionmethods;
      console.log("prodCategories >>>>>>>>>>>>>> ", prodCategories)
   }


   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForPDIRTemplate())
      }
		if (success) {
         history.push('/pdirconfig')
		   dispatch({ type: PDIR_TEMPLATE_LIST_RESET })
         NotificationManager.success(`Record has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: PDIR_TEMPLATE_LIST_RESET })
         NotificationManager.error(`Error in creating Record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( pdirTemplateName.trim().length === 0 ) {
         newErrors.pdirTemplateName = 'Enter a Template Name!'
      }

      // if ( inspectionParameter.trim().length === 0 ) {
      //    newErrors.inspectionParameter = 'Select an Inspection Parameter!'
      // }
      // if ( productCode.trim().length === 0 ) {
      //    newErrors.productCode = 'Select a Product Code!'
      // }

      // if ( inspectionMethod.trim().length === 0 ) {
      //    newErrors.inspectionMethod = 'Select an Inspection Method!'
      // }
      // if ( inspectionStandard.trim().length === 0 ) {
      //    newErrors.inspectionStandard = 'Enter an Inspection Standard!'
      // }
      

      return newErrors;
   }

   const handlePDIRDetails = () => {
      setPDIRDetails([...pdirDetails, { 
         id: uuidv4(),  
         lineNumber: '1', 
         inspectionParameter: inspectionParameter,
         inspectionMethod: inspectionMethod,
         inspectionStandard: inspectionStandard
      }])
      setInspectionParameter("");
      setInspectionMethod("");
      setInspectionStandard("");

   }

   const handleRemoveFields = id => {
      const values  = [...pdirDetails];
      values.splice(values.findIndex(value => value.id === id), 1);
      setPDIRDetails(values);
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
            createPDIRTemplate({
               pdirTemplateCode: autoIncrementedPDIRTemplateNo,
               productCode,
               pdirTemplateName,
               pdirDetails
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

   // const handleInspParam = (event) => {
   //    setInspectionParameter(event.value);
   // }

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
               <h4>Add PDIR Template</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Enter The Details !!!" >
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
                              value={autoIncrementedPDIRTemplateNo}
                              onChange={(e) => setPDIRTemplateCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.pdirTemplateCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='productCode'>
                           <Form.Label>Select Product Code<span className="mandatory">*</span></Form.Label>
                           <Select 
                              name="productCode"
                              options = {prodCodes!==undefined?(prodCodes.map(ip => {
                                 return { value: ip.name, label: ip.name }
                              })):null} 
                              onChange={event => setProductCode(event.label)}
                           />
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
                  <div style={{border:"1px solid red", borderRadius:"7px"}} className="my-2">
                     <Row className="mx-2 my-2">
                        <Col>
                           <h5>PDIR Template Details</h5>
                        </Col>
                     </Row>
                     <Row className="mx-2 my-2">
                        <Col lg={4} md={12} xs={12}>
                           <Form.Group controlId='inspectionParameter'>
                              <Form.Label>Select Inspection Parameter<span className="mandatory">*</span></Form.Label>
                              <Select 
                                 name="inspectionParameter"
                                 options = {inspectionparams!==undefined?(inspectionparams.map(ip => {
                                    return { value: ip.inspectionParameterName, label: ip.inspectionParameterName }
                                 })):null} 
                                 onChange={event => setInspectionParameter(event.label)}
                              />
                              <p className="validation-error">{errors.inspectionParameter}</p>
                           </Form.Group>
                        </Col>
                        <Col lg={4} md={12} xs={12}>
                           <Form.Group controlId='inspectionMethod'>
                              <Form.Label>Select Inspection Method<span className="mandatory">*</span></Form.Label>
                              <Select 
                                 name="inspectionMethod"
                                 options = {inspectionmethods!==undefined?(inspectionmethods.map(ip => {
                                    return { value: ip.inspectionMethodName, label: ip.inspectionMethodName }
                                 })):null} 
                                 onChange={event => setInspectionMethod(event.label)}
                              />
                              <p className="validation-error">{errors.inspectionMethod}</p>
                           </Form.Group>
                        </Col>
                        <Col lg={4} md={12} xs={12}>
                           <Form.Group controlId='inspectionStandard'>
                           <Form.Label>Standard Requirement<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='inspectionStandard'
                                 value={inspectionStandard}
                                 onChange={(e) => setInspectionStandard(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.inspectionStandard}</p>
                           </Form.Group>
                        </Col>
                     </Row>
                     <Row className="mx-2 my-0">
                        <Col lg={12} md={12} xs={12} style={{textAlign:"end", marginTop:"5px"}}>
                           <Button 
                              className='my-2 btn-sm ' 
                              onClick={handlePDIRDetails}
                           >
                              (+) Add
                           </Button>
                        </Col>
                     </Row>
                  </div>
                  <br></br>
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
                                                <b>{pdird.inspectionStandard}</b>
                                             </td>
                                             <td  className="col-3 my-2" style={tableStyle} colSpan={1}>
                                                <Button
                                                   variant="danger" 
                                                   className="btn-sm my-2"
                                                   disabled={pdird.length === 1} 
                                                   onClick={() => handleRemoveFields(pdird.id)}
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
                           disabled={ pdirDetails.length === 0 }
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

export default PDIRTemplateCreateScreen
