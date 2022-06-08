//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { format } from 'date-fns'

import Breadcrumb from './../../components/app/Breadcrumb';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NotificationManager } from 'react-notifications';
import { logger } from './../../util/ConsoleHelper';


//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';

//import FGMI Card Input Redux "action(s)"
import { getAllMasterDataForFGMI, getFGMIBatchedByJCId, updateFGMICorrection } from './../../actions/production/fgmiActions';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import './../css/screen.css';

const FGMICorrectionScreen = ({ history, location }) => {

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const masterDataForFGMI = useSelector((state) => state.masterDataForFGMI)

   const { loading: loadingMasterData, error: errorCreate } = masterDataForFGMI;

   //check to get Customer specific JCs
   const allFGMIBatchesByJCList = useSelector((state) => state.allFGMIBatchesByJCList)
   const { loading: loadingBatches } = allFGMIBatchesByJCList;

   let fgmiBatches = [];
   let fgmiDestinationBatches = [];

   if(allFGMIBatchesByJCList !== undefined) {
      fgmiBatches = allFGMIBatchesByJCList.fgmis;
      fgmiDestinationBatches = allFGMIBatchesByJCList.fgmis;
      //logger("Batches found are ========= ", fgmiBatches)
   }

   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
       } else {
         dispatch(getAllMasterDataForFGMI())
       }
		// if (success) {
      //    history.replace('/fgmilist')
		//    //dispatch({ type: FGMI_CREATE_RESET })
      //    //NotificationManager.success(`FGMI Entry # ${fgmi.fgmiNo} has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		// }

      // if(errorCreate) {
      //    NotificationManager.error(`Error in creating FGMI Entry !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      // }
	}, [history])

   let jcMasters = [];
   let optionsJCNo = [];
   let optionsJCDesc = [];

   if(masterDataForFGMI !== undefined) {
      jcMasters = masterDataForFGMI.jcMasters;

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
   //FGMI Collection Details
   const [ source, setSource ] = useState("");
   const [ batchDate, setBatchDate ] = useState(new Date());
   const [ batchStatus, setBatchStatus ] = useState("O");
   const [ entryDate, setEntryDate ] = useState(new Date());
   const [ batchQuantity, setBatchQuantity ] = useState(0);
   const [ fgmiId, setFGMIId ] = useState("");
   const [ fgmiNo, setFGMINo ] = useState("");
   const [ jcId, setJCId ] = useState("");
   const [ jcNo, setJCNo ] = useState("");
   const [ jcDescription, setJCDescription ] = useState("");
   //FGMI Correction Details
   const [ correctionCategory, setCorrectionCategory ] = useState("none");
   const [ sourceBatch, setSourceBatch ] = useState("none");
   const [ sourceBatchId, setSourceBatchId ] = useState("none");
   const [ sourceAvailableQty, setSourceAvailableQty ] = useState(0);
   const [ destinationBatch, setDestinationBatch ] = useState(null);
   const [ destinationBatchId, setDestinationBatchId ] = useState("none");
   const [ transferQty, setTransferQty ] = useState(0);
   const [ company, setCompany ] = useState(userInfo.companyId);
   //JC Master Dropdown
   const [ selectedJCNo, setSelectedJCNo ] = useState([{}]);
   const [ selectedJCDescription, setSelectedJCDescription ] = useState([{}]);
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});

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
         setCorrectionCategory("none")
         setSourceBatch("none")
         setSourceBatchId("")
         setDestinationBatchId("")
         setSourceAvailableQty(0)
      } else {
         setCorrectionCategory("none")
         setSourceBatch("none")
         setSourceBatchId("")
         setDestinationBatchId("")
         setSourceAvailableQty(0)
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

            //get all FGMI bataches for selected JC ID
            dispatch(getFGMIBatchedByJCId(naam[0]._id))
         }
      }
   }

   const handleCorrectionCategory = (e) => {
      if(e.target.value === "none") {
         setCorrectionCategory("none")
         setSourceBatch("none")
         setSourceBatchId("")
         setDestinationBatchId("")
         setSourceAvailableQty(0)
      } else {
         setCorrectionCategory(e.target.value)
      }
   }

   const handleSourceBatchId = (e) => {
      logger("handleSourceBatchId and value is ", e.target.value)
      if(e.target.value === "none") {
         setSourceBatchId("");
         setFGMIId("");
         setSourceAvailableQty(0)
      } else {
         let srs = fgmiBatches.filter(bt=>{
            if(bt._id === e.target.value) {
               return bt;
            }
         })
         logger("1. Printin Batch ==== ", srs)
         setFGMIId(srs[0]._id)

         setSourceBatchId(e.target.value);
         setSourceAvailableQty(srs[0].batchQuantity)
      }
   }

   const handleDestinationBatchId = (e) => {
      logger("handleDestinationBatchId and value of batch ID  ", sourceBatchId)
      setDestinationBatchId(e.target.value);
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
      logger("0. Before submitting the form ============ ")
      e.preventDefault();
      const newErrors = findFormErrors();

      if ( Object.keys(newErrors).length > 10 ) {
         logger("1. Before submitting the form ============ ")
         setErrors(newErrors)
         window.scrollTo(0, 0);  
      } 
      else {
         logger("2. Before submitting the form ============ ")
         dispatch(
            updateFGMICorrection({
               fgmiId,
               jcNo: jcId,
               batchDate,
               sourceBatchId,
               correctionCategory:"R",
               destinationBatchId,
               transferQty
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
                     <h3>FGM Correction</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Enter FGMI Correction Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           {/*<Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcId'>
                                 <Form.Label>JC #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    placeholder='Select JC #'
                                    value={jcId}
                                    name="jcId"
                                 >
                                    <option value="none">Select</option>
                                    {jcMasters!==undefined?(jcMasters.map(jc => {
                                       return <option key={jc._id}  value={jc._id}>{jc.jcno}</option>
                                    })):null}
                                 </Form.Control>
                                 <p className="validation-error">{errors.jcId}</p>
                              </Form.Group>
                                 </Col>*/}
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcId'>
                                 <Form.Label>Select JC #<span className="mandatory">*</span></Form.Label>
                                 <Select 
                                    name="jcId"
                                    options = {jcMasters!==undefined?(jcMasters.map(jc => {
                                    return { value: jc._id, label: jc.jcno }
                                    })):null} 
                                    onChange={event => handleJCDescription(event)}
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
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='correctionCategory'>
                                 <Form.Label>Correction Category<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='correctionCategory'
                                    placeholder='Select a Batch Category'
                                    value={correctionCategory}
                                    onChange={(e) => handleCorrectionCategory(e)}
                                 >
                                    <option value="none">Select</option>
                                    <option value="R">Rename Batch</option>
                                    <option value="T">Batch Transfer</option>
                                 </Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='sourceBatchId'>
                                 <Form.Label>Source Batch (From)<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    placeholder='Select Batch'
                                    value={sourceBatchId}
                                    name="sourceBatchId"
                                    disabled = {correctionCategory === "none"}
                                    onChange={(e) => handleSourceBatchId(e)}
                                 >
                                    <option value="none">Select</option>
                                    {fgmiBatches!==undefined?(fgmiBatches.map(jc => {
                                       return <option key={jc._id}  value={jc._id}>{format(new Date(jc.batchDate), 'dd-MMM-yyyy')}</option>
                                    })):null}
                                 </Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12} hidden={correctionCategory!=="T"}>
                              <Form.Group controlId='transferQty'>
                                 <Form.Label>Rename/Transfer Qty<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='number'
                                    name='transferQty'
                                    value={transferQty}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.transferQty}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12} hidden={correctionCategory!=="R"}>
                              <Form.Group controlId='batchDate'>
                              <Form.Label>New Batch<span className="mandatory">*</span></Form.Label>
                              <DatePicker 
                                 className="form-control"
                                 selected={batchDate} 
                                 onChange={(date) => setDestinationBatch(date)} 
                                 maxDate={new Date()}
                                 value={destinationBatch}
                              />
                              <p className="validation-error">{errors.batchDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12} hidden={correctionCategory!=="T"}>
                              <Form.Group controlId='destinationBatchId'>
                                 <Form.Label>Destination Batch (To)<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    placeholder='Select Batch'
                                    value={destinationBatchId}
                                    name="destinationBatchId"
                                    disabled = {sourceBatchId === "none"}
                                    onChange={(e) => handleDestinationBatchId(e)}
                                 >
                                    <option value="none">Select</option>
                                    {fgmiDestinationBatches!==undefined?(fgmiDestinationBatches.map(jc => {
                                       return <option key={jc._id}  value={jc._id}>{format(new Date(jc.batchDate), 'dd-MMM-yyyy')}</option>
                                    })):null}
                                 </Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                           </Col>
                           <Col lg={3} md={12} xs={12} hidden={correctionCategory === "none"}>
                              <Form.Group controlId='sourceAvailableQty'>
                                 <Form.Label>Available Source Qty<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='number'
                                    name='sourceAvailableQty'
                                    readOnly
                                    value={sourceAvailableQty}
                                    onChange={(e)=>setSourceAvailableQty(e.target.value)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.sourceAvailableQty}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
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

export default FGMICorrectionScreen
