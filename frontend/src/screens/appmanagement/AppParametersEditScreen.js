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

import { getAppParameterDetails, updateAppParameter } from '../../actions/masters/appParameterActions';
import { APP_PARAMETER_UPDATE_RESET } from '../../constants/masters/appParameterConstants';



const AppParametersEditScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const paramId = match.params.id;
   
   const appParameterDetails = useSelector((state) => state.appParameterDetails)

   const { loading, appParameter, error } = appParameterDetails;

   //post updated the record
   const appParameterUpdate = useSelector((state) => state.appParameterUpdate);
   const { success: successUpdate, error: errorUpdate } = appParameterUpdate

   const [ appParameterCode, setAppParameterCode ] = useState("");
   const [ appParameterAppCode, setAppParameterAppCode ] = useState("");
   const [ appParameterName, setAppParameterName ] = useState("");
   const [ appParameterValue, setAppParameterValue ] = useState("");
   const [ isActive, setIsActive ] = useState("Yes");
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   useEffect(() => {
      
      if (appParameter._id !== paramId) {
         dispatch(getAppParameterDetails(paramId))
      } else {
         //logger("user.role._id ", user.isActive)
         setAppParameterCode(appParameter.appParameterCode);
         setAppParameterAppCode(appParameter.appParameterAppCode);
         setAppParameterName(appParameter.appParameterName);
         setAppParameterValue(appParameter.appParameterValue);
         setIsActive(appParameter.isActive);
      }
      if(successUpdate) {
         history.push('/parameterslist');
         dispatch({ type: APP_PARAMETER_UPDATE_RESET })
         NotificationManager.success(`The record has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: APP_PARAMETER_UPDATE_RESET })
         NotificationManager.error(`Error in updating the record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [paramId, appParameter, successUpdate]);

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( appParameterName.trim().length === 0 ) {
         newErrors.appParameterName = 'Enter a Method Name!'
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
         dispatch(
            updateAppParameter({
               _id: paramId,
               appParameterAppCode,
               appParameterName,
               appParameterValue,
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

   return (
      <FormContainer>
         <Breadcrumb listPage = "parameterslist" />
         <br></br>
         <Row>
            <Col>
               <h4>Edit Parameter Details</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Edit The Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='appParameterCode'>
                        <Form.Label>App Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              readOnly
                              name='appParameterCode'
                              value={appParameterCode}
                              onChange={(e) => setAppParameterCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.appParameterCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='appParameterAppCode'>
                        <Form.Label>Parameter Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              readOnly
                              name='appParameterAppCode'
                              value={appParameterAppCode}
                              onChange={(e) => setAppParameterAppCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.appParameterAppCode}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                  <Row>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='appParameterName'>
                        <Form.Label>Parameter Name<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='appParameterName'
                              value={appParameterName}
                              onChange={(e) => setAppParameterName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.appParameterName}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='appParameterValue'>
                        <Form.Label>Parameter Value<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='appParameterValue'
                              value={appParameterValue}
                              onChange={(e) => setAppParameterValue(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.appParameterAppCode}</p>
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

export default AppParametersEditScreen
