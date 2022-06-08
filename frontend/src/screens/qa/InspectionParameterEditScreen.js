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

import { getInspectionParameterDetails, updateInspectionParameter } from '../../actions/qa/inspectionParameterActions';
import { INSPECTION_PARAM_UPDATE_RESET } from '../../constants/qa/inspectionParameterConstants';

const InspectionParameterEditScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const paramId = match.params.id;
   
   const inspectionParameterDetails = useSelector((state) => state.inspectionParameterDetails)

   const { loading, inspectionParameter, error } = inspectionParameterDetails;

   //post updated the record
   const inspectionParameterUpdate = useSelector((state) => state.inspectionParameterUpdate);
   const { success: successUpdate, error: errorUpdate } = inspectionParameterUpdate

   const [ inspectionParameterCode, setInspectionParameterCode ] = useState("");
   const [ inspectionParameterName, setInspectionParameterName ] = useState("");
   const [ active, setActive ] = useState("");
   const [ isActive, setIsActive ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   useEffect(() => {
      
      if (inspectionParameter._id !== paramId) {
         dispatch(getInspectionParameterDetails(paramId))
      } else {
         //logger("user.role._id ", user.isActive)
         setInspectionParameterCode(inspectionParameter.inspectionParameterCode);
         setInspectionParameterName(inspectionParameter.inspectionParameterName);
         setIsActive(inspectionParameter.isActive);
      }
      if(successUpdate) {
         history.push('/pdirconfig');
         dispatch({ type: INSPECTION_PARAM_UPDATE_RESET })
         NotificationManager.success(`The record has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: INSPECTION_PARAM_UPDATE_RESET })
         NotificationManager.error(`Error in updating the record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [paramId, inspectionParameter, successUpdate]);

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( inspectionParameterName.trim().length === 0 ) {
         newErrors.inspectionParameterName = 'Enter a Parameter Name!'
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
            updateInspectionParameter({
               _id: paramId,
               inspectionParameterCode,
               inspectionParameterName,
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
         <Breadcrumb listPage = "pdirconfig" />
         <br></br>
         <Row>
            <Col>
               <h4>Edit Inspection Parameter</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Edit The Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='inspectionParameterCode'>
                        <Form.Label>Inspection Parameter Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              readOnly
                              name='inspectionParameterCode'
                              value={inspectionParameterCode}
                              onChange={(e) => setInspectionParameterCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.inspectionParameterCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='inspectionParameterName'>
                        <Form.Label>Inspection Parameter Name<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='inspectionParameterName'
                              value={inspectionParameterName}
                              onChange={(e) => setInspectionParameterName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.inspectionParameterName}</p>
                        </Form.Group>
                     </Col>
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
                           <p className="validation-error">{errors.active}</p>
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

export default InspectionParameterEditScreen
