//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';
//import Redux action to create Machine Master record
import { updateMachineMaster, getMachineMasterDetails } from './../../actions/masters/machineActions';

//import Redux "constantc(s)"
import { MACHINE_MASTER_UPDATE_RESET } from '../../constants/masters/machineConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

const MachineMasterEditScreen = ({ history, match }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const machineMasterId = match.params.id;
   
   const machineMasterDetails = useSelector((state) => state.machineMasterDetails)

   const { loading, machineMaster, error } = machineMasterDetails;

   //post updated Job Card Record
   const machineMasterUpdate = useSelector((state) => state.machineMasterUpdate);
   const { success: successUpdate, error: errorUpdate } = machineMasterUpdate

   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } 

      if (machineMaster._id !== machineMasterId) {
         dispatch(getMachineMasterDetails(machineMasterId))
      } else {
         setFormData();
      }

		if (successUpdate) {
         //history.replace(`/machine/${machineMaster._id}/edit`)
         history.push('/machinelist');
         dispatch({ type: MACHINE_MASTER_UPDATE_RESET })
         NotificationManager.success(`Machine Master Record ${machineMaster.machineNo} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorUpdate) {
         dispatch({ type: MACHINE_MASTER_UPDATE_RESET })
         NotificationManager.error(`Error in updating Machine Master Record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      
		// eslint-disable-next-line
	}, [history, machineMasterId, machineMaster, successUpdate])

   // 2. Define All Form Variables and their state
   const company = useState(userInfo.companyId);
   const [ machineCode, setMachineCode ] = useState("");
   const [ name, setName ] = useState("");
   const [ isActive, setisActive ] = useState("Y");
   const [ modelNo, setModelNo ] = useState("-");
   const [ serialNo, setSerialNo ] = useState("-");
   const [ purchaseDate, setPurchaseDate ] = useState(new Date());
   
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   const setFormData = () => {
      setMachineCode(machineMaster.machineCode);
      setName(machineMaster.name);
      setModelNo(machineMaster.modelNo);
      setSerialNo(machineMaster.serialNo)
      setPurchaseDate(new Date(machineMaster.purchaseDate))
   }

   // 3. Define all handler functions to change the state of FORM variables
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   // 4. Validate the "FORM" before submit
   const findFormErrors = () => {
      const newErrors = {};
      if (name.trim().length === 0 ) {
         newErrors.name = 'Enter Machine Name!'
      }

      return newErrors;
   }

   // 5.2 Submit The Form
   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();

      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
      } 
      else {
         resetErrorMessage("name");
         dispatch(
            updateMachineMaster({
               _id: machineMasterId,
               company,
               name,
               isActive,
               modelNo,
               serialNo,
               purchaseDate
            })
         )
      }
   }

   const handleReset = () => {
      window.location.reload();
   }


   return (
      <FormContainer>
         <Breadcrumb
            listPage = "machinelist"
         />
         <br></br>
         {loading ? (
            <Loader />
         ) : errorUpdate  ? (
            <Message variant='danger'>{ errorUpdate }</Message>
         ) : (
            <>
               <Row>
                  <Col>
                     <h3>Edit Machine Details</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Edit Machine Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='machineCode'>
                                 <Form.Label>Machine #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='machineCode'
                                    value={machineCode}
                                    onChange={(e) => setMachineCode(e.target.value)}
                                    readOnly
                                 />
                              </Form.Group>
                           </Col>
                           <Col lg={8} md={12} xs={12}>
                              <Form.Group controlId='name'>
                                 <Form.Label>Machine Name<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                 />
                                 <p className="validation-error">{errors.name}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of 2nd row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='modelNo'>
                                 <Form.Label>Model #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='modelNo'
                                    value={modelNo}
                                    onChange={(e) => setModelNo(e.target.value)}
                                 />
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='serialNo'>
                                 <Form.Label>Serial #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='serialNo'
                                    value={serialNo}
                                    onChange={(e) => setSerialNo(e.target.value)}
                                 />
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='purchaseDate'>
                                 <Form.Label>Purchase Date<span className="mandatory">*</span></Form.Label>
                                 <DatePicker
                                    dateFormat="dd-MMM-yyyy"
                                    className="form-control"
                                    selected={purchaseDate} 
                                    onChange={(date) => setPurchaseDate(date)}
                                    maxDate={new Date()}
                                 />
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of last row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button type='submit' className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                           </Col>
                        </Row>
                     </Col>
                  </Form>
               </FormFieldsContainer>
            </>
         )}
            
      </FormContainer>
   )
}

export default MachineMasterEditScreen

