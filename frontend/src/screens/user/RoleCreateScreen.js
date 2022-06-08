//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

import { NotificationManager } from 'react-notifications';

//import User Redux "action(s)"
import { createRole } from '../../actions/masters/userActions';

//import Redux "constantc(s)"
import { ROLE_CREATE_REQUEST, ROLE_CREATE_RESET } from '../../constants/masters/userConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';

const RoleCreateScreen = ({ history, location }) => {
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   //2. Get the master data required for User generation
   
   const roleCreate = useSelector((state) => state.roleCreate)

   const { success, user, error: errorCreate } = roleCreate

   const [ role, setRole ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors, salesOrders ] = useState({});

   useEffect(() => {
		if (success) {
         history.push('/rolelist')
		   dispatch({ type: ROLE_CREATE_RESET })
         NotificationManager.success(`Role has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: ROLE_CREATE_RESET })
         NotificationManager.error(`Error in creating Role !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( role.trim().length === 0 ) {
         newErrors.role = 'Select a Role!'
      }

      return newErrors;
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
            createRole({
               role
            })
         );
      }
   }

   return (
      <FormContainer>
         <Breadcrumb listPage = "userlist" />
         <br></br>
         <Row>
            <Col>
               <h4>Add Application User</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Enter User Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='role'>
                        <Form.Label>Role Name<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='role'
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                           ></Form.Control>
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

export default RoleCreateScreen
