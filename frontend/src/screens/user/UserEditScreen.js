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

//import User Redux "action(s)"
import { updateUserProfile, getAllMasterDataForUser, getUserDetails } from '../../actions/masters/userActions';

//import Redux "constantc(s)"
import { USER_UPDATE_PROFILE_RESET } from '../../constants/masters/userConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

const UserEditScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const userId = match.params.id;
   const userAction = match.params.action;

   const userDetails = useSelector((state) => state.userDetails)

   const { loading, user, error } = userDetails;

   //post updated JC record
   const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
   const { success: successUpdate, error: errorUpdate } = userUpdateProfile

   const masterDataForUser = useSelector((state) => state.masterDataForUser)

   const { loading: loadingMasterData } = masterDataForUser;

   //4. Define All Form Variables and their state
   const [ userCode, setUserCode ] = useState("");
   const [ name, setName] = useState("");
   const [ role, setRole ] = useState("");
   const [ email, setEmail ] = useState("");
   const [ password, setPassword ] = useState("");
   const [ active, setActive ] = useState("");
   const [ isActive, setIsActive ] = useState("");
   // const [ customerId, setCustomerId ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors, salesOrders ] = useState({});

   let roles = [];
   let options = [];

   if(masterDataForUser !== undefined) {
      roles = masterDataForUser.roles
      if(roles !== undefined) {
         roles.map(role => {
            let dropDownEle = { label: role.role, value: role._id };
            return options.push(dropDownEle);
         });
      }
   }

   useEffect(() => {
      
      if (user._id !== userId) {
         dispatch(getAllMasterDataForUser())
         dispatch(getUserDetails(userId))
      } else {
         //logger("user.role._id ", user.isActive)
         setUserCode(user.userCode);
         setName(user.name);
         setPassword(user.password);
         setRole(user.role._id);
         setEmail(user.email);
         setActive(user.isActive?"Yes":"No");
         setIsActive(user.active==="Yes"?true:false);
      }
      if(successUpdate) {
         history.push('/userlist');
         dispatch({ type: USER_UPDATE_PROFILE_RESET })
         NotificationManager.success(`User # ${user.userCode} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: USER_UPDATE_PROFILE_RESET })
         NotificationManager.error(`Error in updating User # ${user.userCode} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [userId, user, successUpdate]);

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
      // if ( password.trim().length === 0 ) {
      //    newErrors.password = 'Enter a Password!'
      // }

      return newErrors;
   }

   const handleUserActive = (e) => {
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
         //logger("User Active === ", active)
         //logger("User Active === isActive ", isActive)
         dispatch(
            updateUserProfile({
               _id: userId,
               userCode,
               email,
               role,
               password,
               name,
               isActive
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
               <h4>Edit Application User</h4>
            </Col>
         </Row>
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
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
                              value={userCode}
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
                     <Col lg={3} md={12} xs={12}>
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
                     <Col lg={3} md={12} xs={12}>
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
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='role'>
                           <Form.Label>Role<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              as='select'
                              custom
                              name='role'
                              placeholder='Select User Role'
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                           >
                              {roles!==undefined?(roles.map(role => {
                                 return <option key={role._id} value={role._id}>{role.role}</option>
                              })):null}
                           </Form.Control>
                           <p className="validation-error">{errors.role}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='active'>
                           <Form.Label>Active<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              as='select'
                              custom
                              name='active'
                              placeholder='Select'
                              value={active}
                              onChange={(e) => handleUserActive(e)}
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
                        <Button type='submit' className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
         )}
      </FormContainer>
   )
}

export default UserEditScreen
