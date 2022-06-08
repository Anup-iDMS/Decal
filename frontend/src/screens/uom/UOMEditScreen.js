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

import { UOM_UPDATE_RESET } from '../../constants/masters/uomConstants';
import { getUOMDetails, updateUOM } from './../../actions/masters/uomActions';

const UOMEditScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const uomId = match.params.id;
   
   const uomDetails = useSelector((state) => state.uomDetails)

   const { loading, uom, error } = uomDetails;

   //post updated JC record
   const uomUpdate = useSelector((state) => state.uomUpdate);
   const { success: successUpdate, error: errorUpdate } = uomUpdate

   const [ name, setName] = useState("");
   const [ active, setActive ] = useState("");
   const [ isActive, setIsActive ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   useEffect(() => {
      
      if (uom._id !== uomId) {
         dispatch(getUOMDetails(uomId))
      } else {
         //logger("user.role._id ", user.isActive)
         setName(uom.name);
         setActive(uom.isActive?"Yes":"No");
         setIsActive(uom.active==="Yes"?true:false);
      }
      if(successUpdate) {
         history.push('/uomlist');
         dispatch({ type: UOM_UPDATE_RESET })
         NotificationManager.success(`UOM record has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: UOM_UPDATE_RESET })
         NotificationManager.error(`Error in updating UOM record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [uomId, uom, successUpdate]);

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( name.trim().length === 0 ) {
         newErrors.name = 'Enter a Name!'
      }
      return newErrors;
   }

   const handleUOMActive = (e) => {
      setActive(e.target.value)
      setIsActive(e.target.value === "Yes"?true:false)
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
            updateUOM({
               _id: uomId,
               name,
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
               <h4>Edit UOM</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Enter UOM Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='name'>
                        <Form.Label>UOM<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='name'
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.name}</p>
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
                              value={active}
                              onChange={(e) => handleUOMActive(e)}
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
                        <Button type='submit' className=' my-3 btn-md button-class' onClick={(e) => e.currentTarget.blur()} ><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
      </FormContainer>
   )
}

export default UOMEditScreen
