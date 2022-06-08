//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

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

import { getAutoIncrementDetails, updateAutoIncrement } from '../../actions/masters/autoIncrementActions';
import { AUTO_INCREMENT_UPDATE_RESET } from '../../constants/masters/autoIncrementConstants';



const AutoIncrementEditScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const autoIncrementId = match.params.id;
   
   const autoIncrementDetails = useSelector((state) => state.autoIncrementDetails)

   const { loading, autoIncrement, error } = autoIncrementDetails;

   //post updated JC record
   const autoIncrementUpdate = useSelector((state) => state.autoIncrementUpdate);
   const { success: successUpdate, error: errorUpdate } = autoIncrementUpdate

   const [ autoIncrementValue, setAutoIncrementValue] = useState(1);
   const [ module, setModule ] = useState("");
   const [ moduleName, setModuleName ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   useEffect(() => {
      
      if (autoIncrement._id !== autoIncrementId) {
         dispatch(getAutoIncrementDetails(autoIncrementId))
      } else {
         console.log("autoIncrement details =========== ", autoIncrement)
         setAutoIncrementValue(autoIncrement.autoIncrementValue);
         setModule(autoIncrement.module);
         setModuleName(autoIncrement.moduleName);
      }
      if(successUpdate) {
         history.push('/autoincrementlist');
         dispatch({ type: AUTO_INCREMENT_UPDATE_RESET })
         NotificationManager.success(`Auto Increment Module has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: AUTO_INCREMENT_UPDATE_RESET })
         NotificationManager.error(`Error in updating Auto Increment Module !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [autoIncrementId, autoIncrement, successUpdate]);

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( autoIncrementValue === 0 ) {
         newErrors.autoIncrementValue = 'Enter a correct Value!'
      }
      if ( module.trim().length === 0 ) {
         newErrors.module = 'Enter a Prefix!'
      }
      if ( moduleName.trim().length === 0 ) {
         newErrors.moduleName = 'Enter a Module Name!'
      }
      return newErrors;
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
            updateAutoIncrement({
               _id: autoIncrementId,
               autoIncrementValue,
               module,
               moduleName
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
               <h4>Edit Auto Increment Module</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Edit Auto Increment Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='moduleName'>
                        <Form.Label>Module Name<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='moduleName'
                              value={moduleName}
                              onChange={(e) => setModuleName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.moduleName}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='moduleName'>
                        <Form.Label>Module Prefix<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='module'
                              value={module}
                              onChange={(e) => setModule(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.module}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='autoIncrementValue'>
                        <Form.Label>Auto Increment Value<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='autoIncrementValue'
                              value={autoIncrementValue}
                              onChange={(e) => setAutoIncrementValue(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.autoIncrementValue}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                  {/* START of LAST row in the form */}
                  <Row>
                     <Col style={{textAlign:"end"}}>
                        <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                        <Button type='submit' className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
      </FormContainer>
   )
}

export default AutoIncrementEditScreen
