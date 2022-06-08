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

import { getServiceMasterDetails, updateServiceMaster, getAllMasterDataForServiceMaster } from '../../actions/masters/serviceMasterActions';
import { SERVICE_MASTER_UPDATE_RESET } from '../../constants/masters/serviceMasterConstants';


const EditServiceMasterScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const serviceId = match.params.id;
   
   const serviceMasterDetails = useSelector((state) => state.serviceMasterDetails)

   const { loading, serviceMaster, error } = serviceMasterDetails;

   const masterDataForServiceMaster = useSelector((state) => state.masterDataForServiceMaster)

   const { loading: loadingMasterData } = masterDataForServiceMaster;

   let autoIncrementeServiceMasterNo = "";
   let hsnsacs = [];
   if(masterDataForServiceMaster !== undefined) {
      autoIncrementeServiceMasterNo = masterDataForServiceMaster.autoIncrementeServiceMasterNo;
      hsnsacs = masterDataForServiceMaster.hsnsacs;
   }

   //post updated the record
   const serviceMasterUpdate = useSelector((state) => state.serviceMasterUpdate);
   const { success: successUpdate, error: errorUpdate } = serviceMasterUpdate

   const [ serviceCode, setServiceCode ] = useState("");
   const [ serviceDescription, setServiceDescription ] = useState("");
   const [ sac, setSAC ] = useState("");
   const [ isActive, setIsActive ] = useState("Yes");
   
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
      
      if (serviceMaster._id !== serviceId) {
         dispatch(getServiceMasterDetails(serviceId))
      } else {
         //logger("user.role._id ", user.isActive)
         setServiceCode(serviceMaster.serviceCode);
         setServiceDescription(serviceMaster.serviceDescription);
         setIsActive(serviceMaster.isActive);
         setGST(0.00);
         setCGST(0.00);
         setSGST(0.00);
         setIGST(0.00);
      }
      if(successUpdate) {
         history.push('/servicemasterlist');
         dispatch({ type: SERVICE_MASTER_UPDATE_RESET })
         NotificationManager.success(`The record has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: SERVICE_MASTER_UPDATE_RESET })
         NotificationManager.error(`Error in updating the record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [serviceId, serviceMaster, successUpdate]);
   
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
         setGST(naam[0].gstRate);
         setCGST(naam[0].cgstRate);
         setSGST(naam[0].sgstRate);
         setIGST(naam[0].igstRate);
      }
   }
   
   const handleReset = () => {
      window.location.reload();
   }

   const handleActiveStatus = (e) => {
      setIsActive(e.target.value)
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
            updateServiceMaster({
               _id: serviceId,
               serviceDescription,
               unit,
               sac,
               servicePrice,
               isActive
            })
         );
      }
   }

   return (
      <FormContainer>
         <Breadcrumb listPage = "servicemasterlist" />
         <br></br>
         <Row>
            <Col>
               <h4>Edit Service Details</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Edit The Details !!!" >
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
                              value={serviceCode}
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
                                 return { value: s._id, label: s.sacCode }
                              })):null} 
                              onChange={event => handleSACSelection(event)}
                           />
                           <p className="validation-error">{errors.sac}</p>
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
                  {/* START of LAST row in the form */}
                  <Row>
                     <Col style={{textAlign:"end"}}>
                        <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                        <Button type='submit' className=' my-3 btn-md button-class' onClick={(e) => e.currentTarget.blur()}><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
      </FormContainer>
   )
}

export default EditServiceMasterScreen
