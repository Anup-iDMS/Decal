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

import { createAutoIncrement } from '../../actions/masters/autoIncrementActions';
import { AUTO_INCREMENT_CREATE_RESET } from '../../constants/masters/autoIncrementConstants';

const AutoIncrementCreateScreen = ({ history }) => {
   const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails)
  	const { user } = userDetails

  	const userLogin = useSelector((state) => state.userLogin)
  	const { userInfo } = userLogin

	const autoIncrementCreate = useSelector((state) => state.autoIncrementCreate)
	const { success, autoIncrement, error: errorCreate } = autoIncrementCreate

   const [ autoIncrementValue, setAutoIncrementValue] = useState(1);
   const [ module, setModule ] = useState("");
   const [ moduleName, setModuleName ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors, salesOrders ] = useState({});

   //9. Trigger useEffect hook to get all the form details
   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      }
		if (success) {
         history.push('/autoincrementlist')
		   dispatch({ type: AUTO_INCREMENT_CREATE_RESET })
         NotificationManager.success(`Auto Increment Module has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: AUTO_INCREMENT_CREATE_RESET })
         NotificationManager.error(`Error in creating Auto Increment Module !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

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
            createAutoIncrement({
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
               <h4>Add Auto Increment Module</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Add Auto Increment Details !!!" >
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

export default AutoIncrementCreateScreen
