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
import { logger } from './../../util/ConsoleHelper';


//import FGMI Card Input Redux "action(s)"
import { createFGMI, getAllMasterDataForFGMI } from './../../actions/production/fgmiActions';

//import Redux "constantc(s)"
import { FGMI_CREATE_RESET } from '../../constants/production/fgmiConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

const FGMICreateScreen = ({ history, location }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const fgmiCreate = useSelector((state) => state.fgmiCreate)

   const { success, fgmi, error: errorCreate } = fgmiCreate

   const masterDataForFGMI = useSelector((state) => state.masterDataForFGMI)

   const { loading: loadingMasterData } = masterDataForFGMI;

   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
       } else {
         dispatch(getAllMasterDataForFGMI())
       }
		if (success) {
         //history.replace(`/fgmi/${fgmi._id}/edit`)
         history.replace('/fgmilist')
		   dispatch({ type: FGMI_CREATE_RESET })
         NotificationManager.success(`FGMI Entry # ${fgmi.fgmiNo} has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         NotificationManager.error(`Error in creating FGMI Entry !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      
		// eslint-disable-next-line
	}, [history, success])
   
   let jcMasters = [];
   let optionsJCNo = [];
   let optionsJCDesc = [];
   let autoIncrementedFGMINo = "";

   if(masterDataForFGMI !== undefined) {
      jcMasters = masterDataForFGMI.jcMasters
      autoIncrementedFGMINo = masterDataForFGMI.autoIncrementedFGMINo;   
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
   const [ fgmiNo, setFGMINo ] = useState(autoIncrementedFGMINo);
   const [ batchStatus, setBatchStatus ] = useState("O");
   const [ jcId, setJCId ] = useState("");
   const [ jcNo, setJCNo ] = useState("");
   const [ source, setSource ] = useState("FGMI");
   const [ jcDescription, setJCDescription ] = useState("");
   const [ batchDate, setBatchDate ] = useState(new Date());
   const [ entryDate, setEntryDate ] = useState(new Date());
   const [ batchQuantity, setBatchQuantity ] = useState(0);
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
            //logger("naam is ===========> ", naam)
            //setJCDescription(mama)
            setJCId((naam === undefined || naam[0] === undefined)? "":naam[0]._id);
            setJCDescription((naam === undefined || naam[0] === undefined)? "":naam[0].jcDescription);
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
            let dropDownJCDescEle = { label: naam[0].jcDescription, value: e.value };
            let dropDownJCNoEle = { label: naam[0].jcno, value: e.value };
            setSelectedJCDescription(dropDownJCDescEle);
            setSelectedJCNo(dropDownJCNoEle);
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
          newErrors.batchDate = 'Select a Batch Date!'
      }
      if ( entryDate === null ) {
         newErrors.entryDate = 'Select an Entry Date!'
      }
      logger("batchQuantity === ", batchQuantity)
      if ( batchQuantity  === 0 ) {
         newErrors.batchQuantity = 'Enter an Input Quantity!'
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
            createFGMI({
               company,
               fgmiNo: autoIncrementedFGMINo,
               jcNo: jcId,
               source,
               batchDate,
               batchStatus,
               batchQuantity,
               entryDate
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
            listPage = "fgmilist"
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
                     <h3>Finished Goods Entry</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Enter FGMI Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='soNo'>
                                 <Form.Label>FGM #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='fgmiNo'
                                    readOnly
                                    value={autoIncrementedFGMINo}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcNo'>
                                 <Form.Label>JC #<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={optionsJCNo}
                                    onChange={(e) => handleJCDescription(e)}
                                    value={selectedJCNo}
                                 />
                                 <p className="validation-error">{errors.jcId}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcDescription'>
                                 <Form.Label>JC Description<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={optionsJCDesc}
                                    onChange={(e) => handleJCDescription(e)}
                                    value={selectedJCDescription}
                                 />
                                 <p className="validation-error">{errors.jcDescription}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='batchQuantity'>
                              <Form.Label>Batch Quantity<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 className="numberInputStyle"
                                 type='number'
                                 name='batchQuantity'
                                 value={batchQuantity}
                                 onChange={(e) => setBatchQuantity(e.target.value)}
                              />
                              <p className="validation-error">{errors.batchQuantity}</p>
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
                              <Form.Group controlId='entryDate'>
                              <Form.Label>Entry Date<span className="mandatory">*</span></Form.Label>
                              <DatePicker 
                                 className="form-control"
                                 dateFormat="dd-MMM-yyyy"
                                 selected={entryDate} 
                                 onChange={(date) => setEntryDate(date)} 
                                 maxDate={new Date()}
                              />
                              <p className="validation-error">{errors.entryDate}</p>
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
                                 onClick={(e) => e.currentTarget.blur()} className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
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

export default FGMICreateScreen

