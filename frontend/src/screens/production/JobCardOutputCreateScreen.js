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
   listAllJobCards,
   updateJobCard 
} from './../../actions/production/jobCardActions';
import { JOB_CARD_CREATE_RESET, JOB_CARD_UPDATE_RESET } from '../../constants/production/jobCardConstants';
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application';
import { logger } from './../../util/ConsoleHelper';


const JobCardOutputCreateScreen = ({ location, history, match }) => {
   
   const pageNumber = match.params.pageNumber || 1

   const jobStatus = match.params.jobStatus || "O"

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const allJobCardList = useSelector((state) => state.allJobCardList)
	const { loading, error: errorCreate, jobCards, page, pages } = allJobCardList;

   //post updated Job Card Record
   const jobCardUpdate = useSelector((state) => state.jobCardUpdate);
   const { success: successUpdate, error: errorUpdate } = jobCardUpdate

   if(!loading) {
      console .log("1. %%%% JOB CARD OUTPUT ENTRY SCREEN  ======= ", jobCards)
   }

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			console .log("2. Inside JOb Card Input Entry LIST Screen useEffect function ==== ")
			dispatch(listAllJobCards(pageNumber, jobStatus))
		  }
		}
      if(successUpdate) {
         history.push('/jobcardoutputlist');
         dispatch({ type: JOB_CARD_UPDATE_RESET })
         NotificationManager.success(`Jb Card # ${jobCardNo} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         NotificationManager.error(`Error in updating Job Card # ${jobCardNo} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
         dispatch({ type: JOB_CARD_CREATE_RESET })
      }
	}, [dispatch, history, userInfo, user, pageNumber, successUpdate])

   let optionsJobCards = [];

   if(jobCards !== undefined) {
      //logger("%%%%%%%% I am here are JC masters are ======== ", jcMasters[0])
      jobCards.map(jc => {
         let dropDownEle = { label: jc.jobCardNo, value: jc._id };
         return optionsJobCards.push(dropDownEle);
      });
   }

   // 2. Define All Form Variables and their state
   const [ jobCardId, setJobCardId ] = useState("");
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
   const [ totalOutputQuantity, setOutputQuantity ] = useState(0);
   const [ company, setCompany ] = useState(userInfo.companyId);

   const [ outputDate1, setOutputDate1] = useState(null);
   const [ outputQty1, setOutputQty1] = useState(0);

   const [ outputDate2, setOutputDate2] = useState(null);
   const [ outputQty2, setOutputQty2] = useState(0);

   const [ outputDate3, setOutputDate3] = useState(null);
   const [ outputQty3, setOutputQty3] = useState(0);

   const [ outputDate4, setOutputDate4] = useState(null);
   const [ outputQty4, setOutputQty4] = useState(0);

   const [ outputDate5, setOutputDate5] = useState(null);
   const [ outputQty5, setOutputQty5] = useState(0);

   const [ jobCardOutputDetails, setJobCardOutputDetails ] = useState([]);

   //disable button on click
   const [executing, setExecuting] = useState(false);

    // 2.1 Validation Errors
    const [ errors, setErrors ] = useState({});

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
      if ( jcId.trim().length === 0 ) {
         newErrors.jcId = 'Select a JC!'
      }
      if ( batchDate === null ) {
          newErrors.batchDate = 'Select a Batch Date Date!'
      }
      if ( inputQuantity  === 0 ) {
         newErrors.inputQuantity = 'Enter an Input Quantity!'
      }

      if ( outputDate1  === null || outputQty1 === 0) {
         newErrors.outputQty1 = 'Enter an Output Date & Quantity!'
      }
      logger("inputQuantity ", inputQuantity)
      logger("totalOutputQuantity ", totalOutputQuantity)
      if ( inputQuantity  < totalOutputQuantity ) {
         newErrors.totalOutputQuantity = 'Error: Output Quantity cannot be more than Input Quantity!'
      }

      // else if ( outputDate2  === null || outputQty2 === 0) {
      //    newErrors.outputQty2 = 'Enter an Output Date & Quantity!'
      // } else if ( outputDate3  === null || outputQty3 === 0) {
      //    newErrors.outputQty3 = 'Enter an Output Date & Quantity!'
      // } else if ( outputDate4  === null || outputQty4 === 0) {
      //    newErrors.outputQty4 = 'Enter an Output Date & Quantity!'
      // } else if ( outputDate5  === null || outputQty5 === 0) {
      //    newErrors.outputQty5 = 'Enter an Output Date & Quantity!'
      // }

      return newErrors;
   }

   const handleJobCard = (e) => {
      //logger("---- inside a drop down to select Job card Number and ID is ", e.value)
      if(e.value.trim() === "") {
         setJobCardId("")
         setJobCardNo("")
         setJCId("")
         setJCNo("")
         setJCDescription("")
         setProductId("")
         setProductDescription("")
         setBatchDate(null)
         setInputQuantity(0)
      } else {
         setJobCardNo(e.value);
         let srs = [...jobCards];
         let naam = srs.filter(jcs=>{
            return jcs._id.trim() === e.value.trim();
        })

        if(naam !== undefined || naam[0] !== undefined) {
            setJobCardId(naam[0]._id)
            setJobCardNo(naam[0].jobCardNo)
            setJCId(naam[0].jcNo._id)
            setJCNo(naam[0].jcNo.jcno)
            setJCDescription(naam[0].jcNo.jcDescription)
            setProductId(naam[0].jcProdCode)
            setProductDescription(naam[0].jcProdCode.name)
            setBatchDate(new Date(naam[0].batchDate))
            setInputQuantity(naam[0].inputQuantity)

            resetErrorMessage("jcId")
        }

        //logger("***** Selected Job Card Details are ", naam)
      }

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
      
      setOutputQuantity(totalOutQty);
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
         ) : errorCreate  ? (
            <Message variant='danger'>{ errorCreate }</Message>
         ) : (
            <>
               <Row>
                  <Col>
                     <h3>Job Card Output Entry</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Enter Job Card Output Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcNo'>
                                 <Form.Label>Job Card #<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={optionsJobCards}
                                    onChange={(e) => handleJobCard(e)}
                                 />
                                 <p className="validation-error">{errors.jcId}</p>
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
                                 disabled={executing} 
                                 className=' my-3 btn-md button-class' onClick={(e) => e.currentTarget.blur()} ><i className="fas fa-save"></i> Save</Button>
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

export default JobCardOutputCreateScreen
