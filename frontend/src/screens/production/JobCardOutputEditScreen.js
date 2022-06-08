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
//Redux actions
import { 
   getJobCardDetails,
   updateJobCard 
} from './../../actions/production/jobCardActions';

import { JOB_CARD_UPDATE_RESET, JOB_CARD_LIST_RESET } from '../../constants/production/jobCardConstants';
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application';
import { logger } from './../../util/ConsoleHelper';


const JobCardOutputEditScreen = ({ location, history, match }) => {
   
   const pageNumber = match.params.pageNumber || 1

   //const jobStatus = match.params.jobStatus || "O"
   const jobCardId = match.params.id;
   console .log("1. Edit JOB OUT SCREEN AND  Id ==== ", jobCardId)
   const jobCardDetails = useSelector((state) => state.jobCardDetails)

   const { loading, jobCard, error } = jobCardDetails;
   console.log("job card details are  $$$$$$$$$$$$ ", jobCard.jobCardOutputDetails)
   if(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate1'] !== undefined) {
      console.log("job card details are undefined 888888888888888888888 ", jobCard.jobCardOutputDetails)
   } else {
      console.log("Inside ELSE ", jobCard.jobCardOutputDetails)
   }
   //console .log(">>>>> Inside Edit JOB CARD screen and detais are <<<<<< ******** ", jobCard.jobCardOutputDetails)
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   //post updated Job Card Record
   const jobCardUpdate = useSelector((state) => state.jobCardUpdate);
   const { success: successUpdate, error: errorUpdate } = jobCardUpdate

   // 2. Define All Form Variables and their state
   const [ jobCardNo, setJobCardNo ] = useState("");
   const [ jobCardStatus, setJobCardStatus ] = useState(2);
   const [ jcId, setJCId ] = useState("");
   const [ jcNo, setJCNo ] = useState("");
   const [ jcDescription, setJCDescription ] = useState("");
   const [ productId, setProductId ] = useState("");
   const [ productCode, setProductCode ] = useState("");
   const [ productDescription, setProductDescription ] = useState("");
   const [ markCompleted, setMarkCompleted] = useState("N");
   const [ batchDate, setBatchDate ] = useState(null);
   const [ inputQuantity, setInputQuantity ] = useState(0);
   
   const [ company, setCompany ] = useState(userInfo.companyId);
   
   const [ totalOutputQuantity, setTotalOutputQuantity ] = useState(0);

   const [ outputDate1, setOutputDate1] = useState();
   const [ outputQty1, setOutputQty1] = useState();

   const [ outputDate2, setOutputDate2] = useState();
   const [ outputQty2, setOutputQty2] = useState();

   const [ outputDate3, setOutputDate3] = useState();
   const [ outputQty3, setOutputQty3] = useState();

   const [ outputDate4, setOutputDate4] = useState();
   const [ outputQty4, setOutputQty4] = useState();

   const [ outputDate5, setOutputDate5] = useState();
   const [ outputQty5, setOutputQty5] = useState();

   const [ jobCardOutputDetails, setJobCardOutputDetails ] = useState([]);

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
         history.push('/jobcardoutputlist');
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
      setJobCardOutputDetails(jobCard.jobCardOutputDetails)
      
      setMarkCompleted(jobCard.markCompleted)

      //window.location.reload();

      //console.log("??????? jobCard.jobCardOutputDetails[0].outputDate ------------- ", jobCard.jobCardOutputDetails[1].outputDate)

      if(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails[0] !== undefined) {
         setOutputDate1(new Date(jobCard.jobCardOutputDetails[0].outputDate));
         setOutputQty1(jobCard.jobCardOutputDetails[0].outputQuantity);
      }

      if(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails[1] !== undefined) {
         if(jobCard.jobCardOutputDetails[1].outputDate === null) {
            setOutputDate2("");
         } else {
            setOutputDate2(new Date(jobCard.jobCardOutputDetails[1].outputDate));
         }
         setOutputQty2(jobCard.jobCardOutputDetails[1].outputQuantity);
   
      }
  
      if(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails[2] !== undefined) {
         if(jobCard.jobCardOutputDetails[1].outputDate === null) {
            setOutputDate3("");
         } else {
            setOutputDate3(new Date(jobCard.jobCardOutputDetails[2].outputDate));
         }
         //setOutputDate3(new Date(jobCard.jobCardOutputDetails[2].outputDate));
         setOutputQty3(jobCard.jobCardOutputDetails[2].outputQuantity);
   
      }
      
      if(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails[3] !== undefined) {
         if(jobCard.jobCardOutputDetails[1].outputDate === null) {
            setOutputDate4("");
         } else {
            setOutputDate4(new Date(jobCard.jobCardOutputDetails[3].outputDate));
         }
         //setOutputDate4(new Date(jobCard.jobCardOutputDetails[3].outputDate));
         setOutputQty4(jobCard.jobCardOutputDetails[3].outputQuantity);
   
      }

      if(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails[4] !== undefined) {
         if(jobCard.jobCardOutputDetails[1].outputDate === null) {
            setOutputDate5("");
         } else {
            setOutputDate5(new Date(jobCard.jobCardOutputDetails[4].outputDate));
         }
         //setOutputDate5(new Date(jobCard.jobCardOutputDetails[4].outputDate));
         setOutputQty5(jobCard.jobCardOutputDetails[4].outputQuantity);
      }
      //setBatchDate(jobCard.batchDate);
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
   
      if ( outputDate1  === null || outputQty1 === 0) {
         newErrors.outputQty2 = 'Enter an Output Date & Quantity!'
      }
   
      if ( inputQuantity  < totalOutputQuantity ) {
         newErrors.totalOutputQuantity = 'Error: Output Quantity cannot be more than Input Quantity!'
      }

      return newErrors;
   }

   
   const handleOutputQty = (e) => {
      let totalOutQty = 0;
      //let opqty = e.target.value;
      // logger("Output Qty value is ", opqty)

      totalOutQty += outputQty1 > 0 ? parseInt(outputQty1):0
      totalOutQty += outputQty2 > 0 ? parseInt(outputQty2):0
      totalOutQty += outputQty3 > 0 ? parseInt(outputQty3):0
      totalOutQty += outputQty4 > 0 ? parseInt(outputQty4):0
      totalOutQty += outputQty5 > 0 ? parseInt(outputQty5):0
      
      setTotalOutputQuantity(totalOutQty);
      resetErrorMessage("totalOutputQuantity")
   }

   // 5.2 Submit The Form
   const submitHandler = (e) => {
      
      e.preventDefault();
      const newErrors = findFormErrors();
      logger("1. Inside SUBMIT HANDLER TO create record....", newErrors)
      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
      } 
      else {
         setExecuting(true);
         let outputDetails = [];
         
         let obj1 = {};
         let obj2 = {};
         let obj3 = {};
         let obj4 = {};
         let obj5 = {};

         logger("outputQty1 ========== ", outputQty1)
         obj1["outputDate"] = outputDate1;
         obj1["outputQuantity"] = outputQty1;
         outputDetails.push(obj1)
         
         obj2["outputDate"] = outputDate2;
         obj2["outputQuantity"] = outputQty2;
         outputDetails.push(obj2)
         
         obj3["outputDate"] = outputDate3;
         obj3["outputQuantity"] = outputQty3;
         outputDetails.push(obj3)
         
         obj4["outputDate"] = outputDate4;
         obj4["outputQuantity"] = outputQty4;
         outputDetails.push(obj4)
         
         obj5["outputDate"] = outputDate5;
         obj5["outputQuantity"] = outputQty5;
         outputDetails.push(obj5)

         //logger("2. Inside SUBMIT HANDLER TO create record.... ")
         //logger(outputDetails)
         setJobCardOutputDetails(outputDetails)

         logger("2. Inside SUBMIT HANDLER TO create record.... ")
         logger(jobCardOutputDetails)

         dispatch(
            updateJobCard({
               _id: jobCardId,
               totalOutputQuantity,
               jobCardStatus,
               markCompleted,
               jobCardOutputDetails: outputDetails
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
            listPage = "jobcardoutputlist"
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
                     <h3>Edit Job Card Output Entry</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Edit Job Output Details !!!" >
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
                        {/* START of 3rd row in the form */}
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
                              <Form.Group controlId='jcDescription'>
                                 <Form.Label>Batch Date<span className="mandatory">*</span></Form.Label>
                                 <DatePicker 
                                    dateFormat="dd-MMM-yyyy"
                                    className="form-control"
                                    selected={batchDate} 
                                    readOnly
                                 />
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='inputQuantity'>
                                 <Form.Label>Input Quantity<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='inputQuantity'
                                    readOnly
                                    value={inputQuantity}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        <hr></hr>
                        {/* START of 3rd row in the form */}
                        <Row>
                           <Col lg={12} md={12} xs={12}>
                              <h5>Output Details</h5>
                           </Col>
                        </Row>
                        <br></br>
                        {/* START of 4th row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='totalOutputQuantity'>
                                 <Form.Label>Cumulative Output Quantity<span className="mandatory"></span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='totalOutputQuantity'
                                    readOnly
                                    value={totalOutputQuantity}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.totalOutputQuantity}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='markCompleted'>
                                 <Form.Label>Mark Job as Complete<span className="mandatory"></span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='markCompleted'
                                    value={markCompleted}
                                    onChange={(e) => setMarkCompleted(e.target.value)}
                                 >
                                    <option value="N">No</option>
                                    <option value="Y">Yes</option>
                                 </Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        <br></br>
                        {/* START of 5th row in the form */}
                        <Row>
                           <Col lg={1} md={12} xs={12}>
                              <p><b>#</b></p>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <p><b>Output Date</b></p>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <p><b>Output Qty</b></p>
                           </Col>
                        </Row>

                        {/* START of 6th row in the form */}
                        <Row>
                           <Col lg={1} md={12} xs={12}>
                              <p>1</p>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='outputDate1'>
                                 <DatePicker 
                                    dateFormat="dd-MMM-yyyy"
                                    className="form-control"
                                    selected={outputDate1} 
                                    onChange={(date) => setOutputDate1(date)} 
                                    maxDate={new Date()}
                                    readOnly={(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate1'] !== undefined)?jobCard.jobCardOutputDetails[0].outputDate1!==null:false}
                                 />
                                 <p className="validation-error">{errors.outputQty1}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='outputQty1'>
                                 <Form.Control
                                    type='number'
                                    name='outputQty1'
                                    value={outputQty1}
                                    onChange={(e) => setOutputQty1(e.target.value)}
                                    onBlur={(e) => handleOutputQty(e)}
                                    readOnly={(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate1'] !== undefined)?jobCard.jobCardOutputDetails[0].outputQuantity>0:false}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.outputQty1}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of 7th row in the form */}
                        <Row>
                           <Col lg={1} md={12} xs={12}>
                              <p>2</p>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='outputDate2'>
                                 <DatePicker 
                                    dateFormat="dd-MMM-yyyy"
                                    className="form-control"
                                    selected={outputDate2} 
                                    onChange={(date) => setOutputDate2(date)} 
                                    maxDate={new Date()}
                                    readOnly={jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate2'] !== undefined?jobCard.jobCardOutputDetails[1].outputQuantity>0:false > 0}
                                 />
                                 <p className="validation-error">{errors.outputQty2}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='outputQty2'>
                                 <Form.Control
                                    type='number'
                                    name='outputQty2'
                                    value={outputQty2}
                                    onChange={(e) => setOutputQty2(e.target.value)}
                                    onBlur={(e) => handleOutputQty(e)}
                                    readOnly={jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate2'] !== undefined?jobCard.jobCardOutputDetails[1].outputQuantity>0:false > 0}
                                 >
                                 </Form.Control>
                                 <p className="validation-error">{errors.outputQty2}</p>
                              </Form.Group>
                           </Col>
                        </Row>

                        {/* START of 8th row in the form */}
                        <Row>
                           <Col lg={1} md={12} xs={12}>
                              <p>3</p>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='outputDate3'>
                                 <DatePicker 
                                    dateFormat="dd-MMM-yyyy"
                                    className="form-control"
                                    selected={outputDate3} 
                                    onChange={(date) => setOutputDate3(date)} 
                                    maxDate={new Date()}
                                    readOnly={(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate3'] !== undefined)?jobCard.jobCardOutputDetails[2].outputQuantity>0:false > 0}

                                 />
                                 <p className="validation-error">{errors.outputQty3}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='outputQty3'>
                                 <Form.Control
                                    type='number'
                                    name='outputQty3'
                                    value={outputQty3}
                                    onChange={(e) => setOutputQty3(e.target.value)}
                                    onBlur={(e) => handleOutputQty(e)}
                                    readOnly={(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate3'] !== undefined)?jobCard.jobCardOutputDetails[2].outputQuantity>0:false > 0}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.outputQty3}</p>
                              </Form.Group>
                           </Col>
                        </Row>

                        {/* START of 8th row in the form */}
                        <Row>
                           <Col lg={1} md={12} xs={12}>
                              <p>4</p>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='outputDate4'>
                                 <DatePicker 
                                    dateFormat="dd-MMM-yyyy"
                                    className="form-control"
                                    selected={outputDate4} 
                                    onChange={(date) => setOutputDate4(date)} 
                                    maxDate={new Date()}
                                    readOnly={(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate4'] !== undefined)?jobCard.jobCardOutputDetails[3].outputQuantity>0:false > 0}

                                 />
                                 <p className="validation-error">{errors.outputQty4}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='outputQty4'>
                                 <Form.Control
                                    type='number'
                                    name='outputQty4'
                                    value={outputQty4}
                                    onChange={(e) => setOutputQty4(e.target.value)}
                                    onBlur={(e) => handleOutputQty(e)}
                                    readOnly={(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate4'] !== undefined)?jobCard.jobCardOutputDetails[3].outputQuantity>0:false > 0}

                                 ></Form.Control>
                                 <p className="validation-error">{errors.outputQty4}</p>
                              </Form.Group>
                           </Col>
                        </Row>

                        {/* START of 7th row in the form */}
                        <Row>
                           <Col lg={1} md={12} xs={12}>
                              <p>5</p>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='outputDate5'>
                                 <DatePicker 
                                    dateFormat="dd-MMM-yyyy"
                                    className="form-control"
                                    selected={outputDate5} 
                                    onChange={(date) => setOutputDate5(date)} 
                                    maxDate={new Date()}
                                    readOnly={(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate5'] !== undefined)?jobCard.jobCardOutputDetails[4].outputQuantity>0:false > 0}
                                 />
                                 <p className="validation-error">{errors.outputQty5}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='outputQty5'>
                                 <Form.Control
                                    type='number'
                                    name='outputQty5'
                                    value={outputQty5}
                                    onChange={(e) => setOutputQty5(e.target.value)}
                                    onBlur={(e) => handleOutputQty(e)}
                                    readOnly={(jobCard.jobCardOutputDetails !== undefined && jobCard.jobCardOutputDetails['outputDate5'] !== undefined)?jobCard.jobCardOutputDetails[4].outputQuantity>0:false > 0}

                                 ></Form.Control>
                                 <p className="validation-error">{errors.outputQty5}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                         {/* START of last row in the form */}
                         <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button 
                                 type='submit' 
                                 onClick={(e) => e.currentTarget.blur()}
                                 disabled={jobCard.markCompleted === "Y" || executing}
                                 className=' my-3 btn-md button-class' >
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

export default JobCardOutputEditScreen
