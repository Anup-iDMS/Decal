//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';
//import Job Card Input Redux "action(s)"
import { updateJobCard, getAllMasterDataForJobCard, getJobCardDetails } from './../../actions/production/jobCardActions';

//import Redux "constantc(s)"
import { JOB_CARD_UPDATE_RESET, JOB_CARD_LIST_RESET } from '../../constants/production/jobCardConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

const JobCardInputEditScreen = ({ history, match }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const jobCardId = match.params.id;
   //console .log("1. Edit Sales Order Screen Sales Order Id ==== ", jobCardId)

   const jobCardDetails = useSelector((state) => state.jobCardDetails)

   const { loading, jobCard, error } = jobCardDetails;
	console .log(">>>>> Inside Edit JOB CARD screen and detais are <<<<<< ", jobCard)

   const masterDataForJobCard = useSelector((state) => state.masterDataForJobCard)

   const { loading: loadingMasterData } = masterDataForJobCard;

   //post updated Job Card Record
   const jobCardUpdate = useSelector((state) => state.jobCardUpdate);
   const { success: successUpdate, error: errorUpdate } = jobCardUpdate

   // 2. Define All Form Variables and their state
   const [ jobCardNo, setJobCardNo ] = useState("");
   const [ jobCardStatus, setJobCardStatus ] = useState(1);
   const [ jcId, setJCId ] = useState("");
   const [ jcNo, setJCNo ] = useState("");
   const [ jcDescription, setJCDescription ] = useState("");
   const [ productId, setProductId ] = useState("");
   const [ productCode, setProductCode ] = useState("");
   const [ productDescription, setProductDescription ] = useState("");
   const [ batchDate, setBatchDate ] = useState(new Date());
   const [ inputQuantity, setInputQuantity ] = useState(0);
   const [ totalOutputQuantity, setTotalOutputQuantity ] = useState(0);
   const [ company, setCompany ] = useState(userInfo.companyId);
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});
   //disable button on click
   const [executing, setExecuting] = useState(false);

   useEffect(() => {
      
      if (jobCard._id !== jobCardId) {
         //console .log("2. Edit Sales Order Screen and Inside useEffect. Before getting SO Details ==== ")
         dispatch(getJobCardDetails(jobCardId))
      } else {
         setFormData();
      }
      if(successUpdate) {
         history.push('/jobcardinputlist');
         dispatch({ type: JOB_CARD_LIST_RESET })
         dispatch({ type: JOB_CARD_UPDATE_RESET })
         NotificationManager.success(`Job Card # ${jobCard.jobCardNo} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         NotificationManager.error(`Error in updating Job Card # ${jobCard.jobCardNo} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
         dispatch({ type: JOB_CARD_UPDATE_RESET })
      }
   }, [jobCardId, jobCard, successUpdate]);

   const setFormData = () => {
      setJobCardNo(jobCard.jobCardNo);
      setBatchDate((new Date(jobCard.batchDate)));
      setInputQuantity(jobCard.inputQuantity);
      setTotalOutputQuantity(jobCard.totalOutputQuantity);
      setJCId(jobCard.jcNo._id)
      setJCNo(jobCard.jcNo.jcno)
      setJCDescription(jobCard.jcNo.jcDescription)
      setProductId(jobCard.jcProdCode._id)
      setProductDescription(jobCard.jcProdCode.name);
      //setBatchDate(jobCard.batchDate);
   }

   // 4. Validate the "FORM" before submit
   const findFormErrors = () => {
      const newErrors = {};
      if ( inputQuantity  === 0 ) {
         newErrors.inputQuantity = 'Enter an Input Quantity!'
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
         setExecuting(true);
         dispatch(
            updateJobCard({
               _id: jobCardId,
               company,
               jobCardNo,
               jcNo: jcId,
               batchDate,
               inputQuantity
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
            listPage = "jobcardinputlist"
         />
         <br></br>
         {loadingMasterData ? (
            <Loader />
         ) : errorUpdate  ? (
            <Message variant='danger'>{ errorUpdate }</Message>
         ) : (
            <>
               <Row>
                  <Col>
                     <h3>Job Card Input Entry</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Edit Job Card Input Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jobCardNo'>
                                 <Form.Label>Job Card #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='jobCardNo'
                                    readOnly
                                    value={jobCardNo}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcNo'>
                                 <Form.Label>JC #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='jcNo'
                                    readOnly
                                    value={jcNo}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcDescription'>
                                 <Form.Label>JC Description<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='jcDescription'
                                    readOnly
                                    value={jcDescription}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='productDescription'>
                              <Form.Label>Product Code<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='productDescription'
                                 readOnly
                                 value={productDescription}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='batchDate'>
                              <Form.Label>Batch Date<span className="mandatory">*</span></Form.Label>
                              <DatePicker 
                                 dateFormat="dd-MMM-yyyy"
                                 className="form-control"
                                 selected={batchDate} 
                                 onChange={(date) => setBatchDate(date)} 
                                 maxDate={new Date()}
                                 readOnly
                              />
                              <p className="validation-error">{errors.batchDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='inputQuantity'>
                              <Form.Label>Input Quantity<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 className="numberInputStyle"
                                 type='number'
                                 name='inputQuantity'
                                 value={inputQuantity}
                                 onChange={(e) => setInputQuantity(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of last row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button 
                                 type='submit' 
                                 className=' my-3 btn-md button-class'
                                 disabled={totalOutputQuantity>0 || executing}
                                 onClick={(e) => e.currentTarget.blur()}
                              >
                                 <i className="fas fa-save"></i> Save
                              </Button>
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

export default JobCardInputEditScreen
