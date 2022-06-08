//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
// import Select from 'react-select'
import { format } from 'date-fns'
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// React Notification
import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from '../../components/app/Breadcrumb';
import { updateServiceCode, getServiceCodeDetails, getAllMasterDataForServiceCode } from './../../actions/masters/serviceCodeActions';
import { SERVICE_CODE_UPDATE_RESET } from '../../constants/masters/serviceCodeConstants';
import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';
import { logger } from './../../util/ConsoleHelper';

const ServiceCodeEditScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const serviceCodeId = match.params.id;
   
   const serviceCodeDetails = useSelector((state) => state.serviceCodeDetails)

   const { loading, serviceCode, error } = serviceCodeDetails;

   //post updated JC record
   const serviceCodeUpdate = useSelector((state) => state.serviceCodeUpdate);
   const { success: successUpdate, error: errorUpdate } = serviceCodeUpdate

   const masterDataForServiceCode = useSelector((state) => state.masterDataForServiceCode)

   const { loading: loadingMasterData } = masterDataForServiceCode;

   let sacs = [];
   let options = [];

   if(masterDataForServiceCode !== undefined) {
      sacs = masterDataForServiceCode.sacs
      if(sacs !== undefined) {
         sacs.map(sac => {
            let dropDownEle = { label: sac.sacCode, value: sac.sacCode };
            return options.push(dropDownEle);
         });
      }
   }

   const [ name, setName] = useState("");
   const [ code, setCode ] = useState("");
   const [ sacCode, setSACCode ] = useState("");
   //const [ active, setActive ] = useState("");
   const [ isActive, setIsActive ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});
   //disable button on click
   const [executing, setExecuting] = useState(false);

   useEffect(() => {
      
      if (serviceCode._id !== serviceCodeId) {
         dispatch(getAllMasterDataForServiceCode())
         dispatch(getServiceCodeDetails(serviceCodeId))
      } else {
         //logger("user.role._id ", user.isActive)
         setCode(serviceCode.code);
         setName(serviceCode.name);
         console.log("serviceCode.sac ", serviceCode.sac)
         setSACCode(serviceCode.sac);
         //setActive(serviceCode.isActive?"Yes":"No");
         setIsActive(serviceCode.isActive);
      }
      if(successUpdate) {
         history.push('/servicecodelist');
         dispatch({ type: SERVICE_CODE_UPDATE_RESET })
         NotificationManager.success(`Service Code has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: SERVICE_CODE_UPDATE_RESET })
         NotificationManager.error(`Error in updating Service Code !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [serviceCodeId, serviceCode, successUpdate]);

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( name.trim().length === 0 ) {
         newErrors.name = 'Enter a Name!'
      }
      if ( sacCode.trim().length === 0 ) {
         newErrors.sacCode = 'Select a SAC Code!'
      }
      
      return newErrors;
   }

   const handleServiceCodeActive = (e) => {
      //setActive(e.target.value)
      setIsActive(e.target.value)
   }

   //7. Form Reset
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const handleReset = (e) => {
      e.currentTarget.blur()
      window.location.reload();
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
            updateServiceCode({
               _id: serviceCodeId,
               code,
               name,
               sac: sacCode,
               isActive
            })
         );
      }
   }


   return (
      <FormContainer>
         <Breadcrumb listPage = "configuration" />
         <br></br>
         <Row>
            <Col>
               <h4>Edit Service Code</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Edit Service Code Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='code'>
                        <Form.Label>Service Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='code'
                              readOnly
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.name}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='name'>
                        <Form.Label>Service Name<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='name'
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.name}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                  <Row>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='sacCode'>
                           <Form.Label>Select SAC Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              as='select'
                              custom
                              name='sacCode'
                              value={sacCode}
                              onChange={(e) => setSACCode(e.target.value)}
                           >
                              {sacs!==undefined?(sacs.map(sac => {
                                 return <option key={sac.sacCode} value={sac.sacCode}>{sac.sacCode}</option>
                              })):null}
                           </Form.Control>
                           <p className="validation-error">{errors.sacCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='isActive'>
                           <Form.Label>Active<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              as='select'
                              custom
                              name='isActive'
                              placeholder='Select'
                              value={isActive}
                              onChange={(e) => handleServiceCodeActive(e)}
                           >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                           </Form.Control>
                           <p className="validation-error">{errors.isActive}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                  {/* START of LAST row in the form */}
                  <Row>
                     <Col style={{textAlign:"end"}}>
                        <Button 
                           type='reset' 
                           className='reset-button-class mx-3 my-3 btn-md' 
                           onClick={(e)=>handleReset(e)}
                        >
                           <i className="fas fa-undo"></i> Reset
                        </Button>
                        <Button 
                           type='submit'
                           disabled={executing}
                           onClick={(e) => e.currentTarget.blur()} 
                           className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
      </FormContainer>
   )
}

export default ServiceCodeEditScreen
