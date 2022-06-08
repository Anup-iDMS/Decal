//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'

import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import FormFieldsContainer from '../../components/form/FormFieldsContainer';

import { createServiceMaster, getAllMasterDataForServiceMaster } from './../../actions/masters/serviceMasterActions';
import { SERVICE_MASTER_CREATE_RESET } from '../../constants/masters/serviceMasterConstants';



const CreateServiceMasterScreen = ({ history }) => {
   const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails)
  	const { user } = userDetails

  	const userLogin = useSelector((state) => state.userLogin)
  	const { userInfo } = userLogin

	const serviceMasterCreate = useSelector((state) => state.serviceMasterCreate)
	const { success, serviceMaster, error: errorCreate } = serviceMasterCreate

   const masterDataForServiceMaster = useSelector((state) => state.masterDataForServiceMaster)

   const { loading: loadingMasterData } = masterDataForServiceMaster;

   let autoIncrementeServiceMasterNo = "";
   let hsnsacs = [];
   if(masterDataForServiceMaster !== undefined) {
      autoIncrementeServiceMasterNo = masterDataForServiceMaster.autoIncrementeServiceMasterNo;
      hsnsacs = masterDataForServiceMaster.hsnsacs;
   }

   const [ serviceCode, setServiceCode ] = useState("");
   const [ serviceDescription, setServiceDescription ] = useState("");
   const [ sac, setSAC ] = useState("");
   
   const [ gst, setGST ] = useState(0.00);
   const [ cgst, setCGST ] = useState(0.00);
   const [ sgst, setSGST ] = useState(0.00);
   const [ igst, setIGST ] = useState(0.00);
   
   const [ unit, setUnit ] = useState("-");
   const [ servicePrice, setServicePrice ] = useState(0);
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});
   //disable button on click
   const [executing, setExecuting] = useState(false);

   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForServiceMaster())
      }
		if (success) {
         history.push('/servicemasterlist')
		   dispatch({ type: SERVICE_MASTER_CREATE_RESET })
         NotificationManager.success(`Record has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: SERVICE_MASTER_CREATE_RESET })
         NotificationManager.error(`Error in creating Record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
	}, [ history, success ])

   const findFormErrors = () => {
      const newErrors = {};
      
      /*if ( serviceCode.trim().length === 0 ) {
         newErrors.serviceCode = 'Enter a Service Code!'
      }*/
      if ( serviceDescription.trim().length === 0 ) {
         newErrors.serviceDescription = 'Enter a Service Description!'
      }
      if ( sac.trim().length === 0 ) {
         newErrors.sac = 'Select a SAC Code!'
      }

      return newErrors;
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
         setExecuting(true);
         dispatch(
            createServiceMaster({
               serviceCode: autoIncrementeServiceMasterNo,
               serviceDescription,
               unit,
               sac,
               servicePrice
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

   const handleSACSelection = (e) => {
      if(e.value.trim() === "") {
         setSAC("")
      } else {
         setSAC(e.value);
         let srs = [...hsnsacs];
         let naam = srs.filter(sac=>{
            return sac._id.trim() === e.value.trim();
         })
         console.log("handleSACSelection and details ", naam[0])
         if(naam[0] !== undefined) {
            if (naam[0].sacId !== undefined) {
               setGST(naam[0].sacId.gstRate);
               setCGST(naam[0].sacId.cgstRate);
               setSGST(naam[0].sacId.sgstRate);
               setIGST(naam[0].sacId.igstRate);
            }
         }
      }
   }

   return (
      <FormContainer>
         <Breadcrumb listPage = "servicemasterlist" />
         <br></br>
         <Row>
            <Col>
               <h4>Add A Service</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Enter The Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='serviceCode'>
                        <Form.Label>Service #<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              readOnly
                              name='serviceCode'
                              value={autoIncrementeServiceMasterNo}
                              onChange={(e) => setServiceCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.serviceCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='serviceDescription'>
                        <Form.Label>Service Description<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='serviceDescription'
                              value={serviceDescription}
                              onChange={(e) => setServiceDescription(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.serviceDescription}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='sac'>
                           <Form.Label>Select SAC<span className="mandatory">*</span></Form.Label>
                           <Select 
                              name="sac"
                              options = {hsnsacs!==undefined?(hsnsacs.map(s => {
                                 return { value: s._id, label: s.name }
                              })):null} 
                              onChange={event => handleSACSelection(event)}
                           />
                           <p className="validation-error">{errors.sac}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                  <Row>
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='gst'>
                           <Form.Label>GST Rate<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 readOnly
                                 name='gst'
                                 value={gst.toFixed(2)}
                                 onChange={(e) => setGST(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.gst}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='cgst'>
                           <Form.Label>CGST Rate<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 readOnly
                                 name='cgst'
                                 value={cgst.toFixed(2)}
                                 onChange={(e) => setCGST(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.cgst}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='sgst'>
                           <Form.Label>SGST Rate<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 readOnly
                                 name='sgst'
                                 value={sgst.toFixed(2)}
                                 onChange={(e) => setSGST(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.sgst}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='igst'>
                           <Form.Label>IGST Rate<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 readOnly
                                 name='igst'
                                 value={igst.toFixed(2)}
                                 onChange={(e) => setGST(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.igst}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                   {/* START of LAST row in the form */}
                   <Row>
                     <Col style={{textAlign:"end"}}>
                        <Button 
                           type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                        <Button 
                           type='submit' 
                           disabled={executing}
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

export default CreateServiceMasterScreen
