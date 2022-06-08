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
import { createJobCard, getAllMasterDataForJobCard } from './../../actions/production/jobCardActions';
import { logger } from './../../util/ConsoleHelper';


//import Redux "constantc(s)"
import { JOB_CARD_CREATE_RESET } from '../../constants/production/jobCardConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

const JobCardInputCreateScreen = ({ history, location }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   //const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const jobCardCreate = useSelector((state) => state.jobCardCreate)

   const { success, jobCard, error: errorCreate } = jobCardCreate

   const masterDataForJobCard = useSelector((state) => state.masterDataForJobCard)

   const { loading: loadingMasterData } = masterDataForJobCard;

   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
       } else {
         dispatch(getAllMasterDataForJobCard())
       }
		if (success) {
         //console .log("Record has been successfully created ==== and detauls area as below ")
         //logger(jcMaster)
         history.push('/jobcardinputlist');
         //history.replace(`/jobcardinput/${jobCard._id}/edit`)
		   dispatch({ type: JOB_CARD_CREATE_RESET })
         NotificationManager.success(`Job Card Input # ${jobCard.jobCardNo} has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         NotificationManager.error(`Error in creating Job Card Input Entry !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
         dispatch({ type: JOB_CARD_CREATE_RESET })
      }
      
		// eslint-disable-next-line
	}, [history, success])
   
   let jcMasters = [];
   let optionsJCNo = [];
   let optionsJCDesc = [];
   let autoIncrementedJobCardNo = "";

   if(masterDataForJobCard !== undefined) {
      jcMasters = masterDataForJobCard.jcMasters
      autoIncrementedJobCardNo = masterDataForJobCard.autoIncrementedJobCardNo
     ;   
      if(jcMasters !== undefined) {
         //logger("%%%%%%%% I am here are JC masters are ======== ", jcMasters[0])
         jcMasters.map(jc => {
            let dropDownEle = { label: jc.jcno, value: jc._id };
            return optionsJCNo.push(dropDownEle);
         });
      }

      if(jcMasters !== undefined) {
         jcMasters.map(jc => {
            let dropDownEle = { label: jc.jcDescription, value: jc._id };
            return optionsJCDesc.push(dropDownEle);
         });
      }
   }

   // 2. Define All Form Variables and their state
   const [ jobCardNo, setJobCardNo ] = useState(autoIncrementedJobCardNo);
   const [ jobCardStatus, setJobCardStatus ] = useState(1);
   const [ jcId, setJCId ] = useState("");
   const [ jcNo, setJCNo ] = useState("");
   const [ jcDescription, setJCDescription ] = useState("");
   const [ productId, setProductId ] = useState("");
   const [ productCode, setProductCode ] = useState("");
   const [ productDescription, setProductDescription ] = useState("");
   const [ batchDate, setBatchDate ] = useState(new Date());
   const [ inputQuantity, setInputQuantity ] = useState(0);
   const [ company, setCompany ] = useState(userInfo.companyId);
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});
   //JC Master Dropdown
   const [ selectedJCNo, setSelectedJCNo ] = useState([{}]);
   const [ selectedJCDescription, setSelectedJCDescription ] = useState([{}]);
   //disable button on click
   const [executing, setExecuting] = useState(false);
   // 3. Define all handler functions to change the state of FORM variables
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const handleJCNo = (e) => {
      //console .log("target is ", e)
      if(e.value.trim() === "") {
         setJCId("")
      } else {
         setJCId(e.value);
         let srs = [...jcMasters];
         let naam = srs.filter(jcs=>{
             return jcs._id.trim() === e.value.trim();
         })
         
         if(naam !== undefined || naam[0] !== undefined) {
            let mama = naam[0].jcDescription;
            setJCId((naam === undefined || naam[0] === undefined)? "":naam[0]._id);
            setJCDescription((naam === undefined || naam[0] === undefined)? "":naam[0].jcDescription);

            setProductId((naam === undefined || naam[0] === undefined)? "":naam[0].jcProdCode._id);
            setProductDescription((naam === undefined || naam[0] === undefined)? "":naam[0].jcProdCode.name);
            
            let dropDownJCDescEle = { label: naam[0].jcDescription, value: e.value };
            let dropDownJCNoEle = { label: naam[0].jcno, value: e.value };
            setSelectedJCDescription(dropDownJCDescEle);
            setSelectedJCNo(dropDownJCNoEle);
         }
      }
   }

   const handleJCDescription = (e) => {
      //console .log("target is ", e)
      if(e.value.trim() === "") {
         setJCDescription("")
      } else {
         setJCDescription(e.value);
         let srs = [...jcMasters];
         let naam = srs.filter(jcs=>{
             return jcs._id.trim() === e.value.trim();
         })
         
         if(naam !== undefined || naam[0] !== undefined) {
            setJCId((naam === undefined || naam[0] === undefined)? "":naam[0]._id);
            setProductId((naam === undefined || naam[0] === undefined)? "":naam[0].jcProdCode._id);
            setProductDescription((naam === undefined || naam[0] === undefined)? "":naam[0].jcProdCode.name);
         }
      }
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
            createJobCard({
               company,
               jobCardNo: autoIncrementedJobCardNo,
               jcNo: jcId,
               jcProdCode: productId,
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
         ) : errorCreate  ? (
            <Message variant='danger'>{ errorCreate }</Message>
         ) : (
            <>
               <Row>
                  <Col>
                     <h3>Job Card Input Entry</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Enter Job Input Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='soNo'>
                                 <Form.Label>Job Card #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='jobCardNo'
                                    readOnly
                                    value={autoIncrementedJobCardNo}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcNo'>
                                 <Form.Label>Select JC #<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={optionsJCNo}
                                    onChange={(e) => handleJCNo(e)}
                                    value={selectedJCNo}
                                 />
                                 <p className="validation-error">{errors.jcId}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcDescription'>
                                 <Form.Label>Select JC Description<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={optionsJCDesc}
                                    onChange={(e) => handleJCNo(e)}
                                    value={selectedJCDescription}
                                 />
                                 <p className="validation-error">{errors.jcDescription}</p>
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
                                 className="form-control"
                                 dateFormat="dd-MMM-yyyy"
                                 selected={batchDate} 
                                 onChange={(date) => setBatchDate(date)} 
                                 maxDate={new Date()}
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
                                 disabled={executing} 
                                 className=' my-3 btn-md button-class' onClick={(e) => e.currentTarget.blur()}><i className="fas fa-save"></i> Save</Button>
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

export default JobCardInputCreateScreen
