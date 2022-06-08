//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { format } from 'date-fns'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NotificationManager } from 'react-notifications';

//import User Redux "action(s)"
import { createUser, getAllMasterDataForUser } from '../../actions/masters/userActions';

//import Redux "constantc(s)"
import { USER_REGISTER_RESET } from '../../constants/masters/userConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';

const UserCreateScreen = ({ history, location }) => {
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   //2. Get the master data required for User generation
   
   const userCreate = useSelector((state) => state.userCreate)

   const { success, user, error: errorCreate } = userCreate

   const masterDataForUser = useSelector((state) => state.masterDataForUser)

   const { loading: loadingMasterData } = masterDataForUser;
   
   let autoIncrementedUserNo = "";
   let roles = [];
   let options = [];

   if(masterDataForUser !== undefined) {
      roles = masterDataForUser.roles
      autoIncrementedUserNo = masterDataForUser.autoIncrementedUserNo
      //logger("masterDataForUser ========= ", masterDataForUser)
      if(roles !== undefined) {
         roles.map(role => {
            let dropDownEle = { label: role.role, value: role._id };
            return options.push(dropDownEle);
         });
      }
   }

   //4. Define All Form Variables and their state
   const [ userCode, setUserCode ] = useState(autoIncrementedUserNo);
   const [ name, setName] = useState("");
   const [ role, setRole ] = useState("");
   const [ email, setEmail ] = useState("");
   const [ password, setPassword ] = useState("");
   // const [ customerId, setCustomerId ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors, salesOrders ] = useState({});
   //disable button on click
   const [executing, setExecuting] = useState(false);

   //9. Trigger useEffect hook to get all the form details
   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForUser())
      }
		if (success) {
         history.push('/userlist')
		   dispatch({ type: USER_REGISTER_RESET })
         NotificationManager.success(`User # ${user.userCode} has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: USER_REGISTER_RESET })
         NotificationManager.error(`Error in creating User !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( name.trim().length === 0 ) {
         newErrors.name = 'Enter a Name!'
      }
      if ( role.trim().length === 0 ) {
         newErrors.role = 'Select a Role!'
      }
      if ( email.trim().length === 0 ) {
         newErrors.email = 'Enter a User Name!'
      }
      if ( password.trim().length === 0 ) {
         newErrors.password = 'Enter a Password!'
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
         setExecuting(true);
         dispatch(
            createUser({
               userCode: autoIncrementedUserNo,
               email,
               role,
               password,
               name
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
                        <Form.Group controlId='userCode'>
                        <Form.Label>User #<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='userCode'
                              readOnly
                              value={autoIncrementedUserNo}
                              onChange={(e) => setUserCode(e.target.value)}
                           ></Form.Control>
                        </Form.Group>
                     </Col>
                     <Col lg={8} md={12} xs={12}>
                        <Form.Group controlId='name'>
                        <Form.Label>User Name<span className="mandatory">*</span></Form.Label>
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
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='email'>
                           <Form.Label>Login Id<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text' 
                                 name='email'
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.email}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='password'>
                           <Form.Label>Password<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text' 
                                 name='password'
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.password}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='role'>
                           <Form.Label>Select Role<span className="mandatory">*</span></Form.Label>
                           <Select
                              style={{background:"#e84347", color:"white"}} 
                              options={options}
                              onChange={(e) => setRole(e.value)}
                           />
                           <p className="validation-error">{errors.role}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                  {/* START of LAST row in the form */}
                  <Row>
                     <Col style={{textAlign:"end"}}>
                        <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                        <Button
                           onClick={(e) => e.currentTarget.blur()} 
                           disabled={executing}
                           type='submit' 
                           className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
      </FormContainer>
   )
}

export default UserCreateScreen
