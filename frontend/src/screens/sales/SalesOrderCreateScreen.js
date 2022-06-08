//import standard React Components
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select'
import ReactTooltip from 'react-tooltip';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';
//import Sales Order Redux "action(s)"
import { createSalesOrder, getAllMasterDataForSalesOrder } from './../../actions/sales/salesOrderActions';
import { logger } from './../../util/ConsoleHelper';
import { format } from 'date-fns'

//import Redux "constantc(s)"
import { SALES_ORDER_CREATE_RESET } from '../../constants/sales/salesOrderConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';


//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';
import { getCustomerJCs } from './../../actions/masters/jcMasterActions';
import ErrorModal from './../../components/modals/ErrorModal';


const SalesOrderCreateScreen = ({ history }) => {

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const salesOrderCreate = useSelector((state) => state.salesOrderCreate)

   const { success, salesOrder, error: errorCreate } = salesOrderCreate

   const masterDataForSalesOrder = useSelector((state) => state.masterDataForSalesOrder)

   const { loading: loadingMasterData } = masterDataForSalesOrder;

   //check to get Customer specific JCs
   const allCustomerJCList = useSelector((state) => state.allCustomerJCList)
   //const { loading: loadingJCData, error: errorJCDataLoad } = allCustomerJCList;

   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
       } else {
         dispatch(getAllMasterDataForSalesOrder())
       }
		if (success) {
         //history.push('/salesorderslist');
         history.push(`/salesorders/${salesOrder._id}/confirm`)
		   dispatch({ type: SALES_ORDER_CREATE_RESET })
         NotificationManager.info(`Please confirm Sales Order # ${salesOrder.soNumber} Details !`, 'Confirm!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         NotificationManager.error(`Error in saving Sales Order !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      window.scrollTo(0, 0)
		// eslint-disable-next-line
	}, [history, success])

   
   
   // 3. Set Master Data on The Screen

   let customers = [];
   let options = [];

   let autoIncrementedSalesOrderNo = "";
   if(masterDataForSalesOrder !== undefined) {
      customers = masterDataForSalesOrder.customers
      autoIncrementedSalesOrderNo = masterDataForSalesOrder.autoIncrementedSalesOrderNo
      //console .log(">>>>> Master data for Sales Order Screen is ", autoIncrementedSalesOrderNo)
      if(customers !== undefined) {
         customers.map(customer => {
            let dropDownEle = { label: customer.custName, value: customer._id };
            return options.push(dropDownEle);
         });
      }
      //setSoNo(autoIncrementedSalesOrderNo);
   }
   //Customer specific JCs
   let customerSpecificJCs = [];

   if(allCustomerJCList !== undefined) {
      customerSpecificJCs = allCustomerJCList.customerJCs;
      //logger("*********** Nadi naale na jao sham paiya padooooooooooooo >>>>>>>>>>> ", customerSpecificJCs);
   }

   // 2. Define All Form Variables and their state
   const [ soNo, setSoNo ] = useState(autoIncrementedSalesOrderNo);
   const [ soId, setSOId ] = useState(1);
   const [ soNumber, setSONumber ] = useState("");
   const [ soDate, setSODate ] = useState(new Date());
   const [ soStatus, setSOStatus ] = useState(1);
   const [ customer, setCustomer ] = useState("");
   const [ customerCode, setCustomerCode ] = useState("");
   const [ billState, setBillState ] = useState("");
   const [ billPinCode, setBillPinCode ] = useState("");
   const [ shipState, setShipState ] = useState("");
   const [ shipPinCode, setShipPinCode ] = useState("");
   const [ soTotalAmount, setSOTotalAmount ] = useState(0);
   const [ isActive, setIsActive ] = useState("A");
   const [ poNumber, setPONumber ] = useState("");
   const [ poFileName, setPOFileName ] = useState("");
   const [ uploadPO, setUploadPO ] = useState("");
   const [uploading, setUploading] = useState(false)


   const [ poDate, setPODate ] = useState(null);
   const [ soTargetDate, setSOTargetDate ] = useState(new Date());
   
   const [ company, setCompany ] = useState(userInfo.companyId);
   //JC Details
   const [ selectedJCNo, setSelectedJCNo ] = useState([{}]);
   const [ selectedJCDescription, setSelectedJCDescription ] = useState([{}]);

   const [soDetails, setSODetails] = useState([{}]);

   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   //const defined on 10 Oct 2021
   const [ lineNumber, LineNumber ] = useState("");
   const [ jcId, setjcId ] = useState("");
   const [ jcNo, setjcNo ] = useState("");
   const [ jcDescription, setJCDescription ] = useState("");
   
   const [ customerPONumber, setCustomerPONumber ] = useState("");
   const [ customerPODate, setCustomerPODate ] = useState(null);
   const [ tmo, setTMO ] = useState("");
   
   const [ cpin, setcpin ] = useState("");
   const [ unitRate, setUnitRate ] = useState(0);
   const [ lineValue, setLineValue ] = useState(0);
   const [ orderedQty, setOrderedQty ] = useState(0);
   const [ soLineTargetDate, setSOLineTargetDate ] = useState();

   //disable button on click
   const [executing, setExecuting] = useState(false);

   // 3. Define all handler functions to change the state of FORM variables
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const handleCustomerName = (e) => {
      //console .log("target is ", e)
      setjcId("");
      setcpin("");
      setOrderedQty(0);
      setUnitRate(0);
      setLineValue(0);
      setSelectedJCNo([{}]);
      setSelectedJCDescription([{}]);
      if(e.value.trim() === "") {
         setCustomer("")
      } else {
         setCustomer(e.value);
         let srs = [...customers];
         let naam = srs.filter(cust=>{
            return cust._id.trim() === e.value.trim();
         })
         console.log("naam[0].custCode ", naam[0].custCode)
         setCustomerCode((naam === undefined || naam[0] === undefined)? "":naam[0].custCode);
         setBillState((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillState);
         setBillPinCode((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillPinCode);
         setShipState((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipState);
         setShipPinCode((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipPinCode);
         resetErrorMessage("customer")
         //logger("Now dispatching very critical operations and customer id is ", naam[0]._id)
         dispatch(getCustomerJCs(naam[0]._id))
      }
   }

   // 3.1 Functions to set dynamic form fields state
   const  handleSOTotalValue = () => {
      let totalSOValue = 0;
      const newInputFields = soDetails.map(i => {
         totalSOValue += parseFloat(i.lineValue === null?"0":i.lineValue)
      })
      setSOTotalAmount(totalSOValue);
   }

   const handleOrderLineDetails = () => {
      console.log("before adding details customerPODate =========== ", customerPODate)
      setSODetails([...soDetails, { 
         id: uuidv4(),  
         lineNumber: '1', 
         jcNo: jcId,
         jcId: jcId,
         jcDescription: jcDescription,
         customerPONumber: customerPONumber,
         customerPODate: customerPODate,
         tmo: tmo,
         cpin: cpin,
         orderedQty: orderedQty,
         soUnitRate: unitRate,
         lineValue: lineValue,
         soLineTargetDate: soLineTargetDate
      }])
      setjcId("");
      setjcNo("");
      setJCDescription("");
      setCustomerPONumber("");
      setCustomerPODate(null);
      setTMO("");
      setcpin("");
      setUnitRate(0);
      setOrderedQty(0);
      setLineValue(0);
      setSOLineTargetDate();
      setSelectedJCDescription([{}]);
      setSelectedJCNo([{}]);

      let totalSOAmount = soTotalAmount + parseFloat(lineValue === null?"0":lineValue);
      setSOTotalAmount(totalSOAmount)
      //handleSOTotalValue();
   }

   const handleJCSelection = (event) => {
      if(event.label != undefined) {
         let srs = [...customerSpecificJCs];
         let naam = srs.filter(pc=>{
            //return pc._id.trim() === event.target.value.trim();
            return pc._id.trim() === event.value;
         })
         if(naam !== undefined && naam[0] !== undefined && naam[0].jcCustomerDetails[0] !== undefined) {
            console.log("Selected JC detailsa are >>>>>>>>>>>> ", naam[0])
            let dropDownJCDescEle = { label: naam[0].jcDescription, value: event.value };
            let dropDownJCNoEle = { label: naam[0].jcno, value: event.value };
            setSelectedJCDescription(dropDownJCDescEle);
            setSelectedJCNo(dropDownJCNoEle);
            setjcId(event.value);
            setJCDescription(naam[0].jcDescription)
            
            if(customerCode === "C0022") {
               setCustomerPONumber(naam[0].jcCustomerDetails[0].customerPONumber);
               console.log("When Customer is TATA G Y customerPODate >>>>>>>>>>>> ", naam[0].jcCustomerDetails[0].customerPODate)
               if(naam[0].jcCustomerDetails[0].customerPODate !== undefined) {
                  console.log("When Customer is TATA G Y customerPODate IS NOT NULL >>>>>>>>>>>> ", naam[0].jcCustomerDetails[0].customerPODate)
                  setCustomerPODate(new Date(naam[0].jcCustomerDetails[0].customerPODate));
               } else {
                  console.log("Customer PO DAte is undefined =============== ")
                  setCustomerPODate(null);
               }
               setTMO(naam[0].jcCustomerDetails[0].tmo);
            }
            setcpin(naam[0].customerPartNumber);
            //setjcNo(naam[0].jcno);
            setOrderedQty(0);
            for (const cust of naam[0].jcCustomerDetails) {
               if(cust.customerId === customer) {
                 // i.cpin= cust.customerPartNumber;
                 setUnitRate(cust.customerPrice);
               }
            }
            
            setLineValue(0);
            setSOLineTargetDate(new Date(soTargetDate));
            resetErrorMessage("jcNo")
         } else {
            setjcId("");
            setcpin("");
            setOrderedQty(0);
            setUnitRate(0);
            setLineValue(0);
            setSOLineTargetDate();
         }
            
      }
   }

   const handleOrderedQty = (event) => {
      let qty = event.target.value;
      if(qty === "" || qty === undefined) {
         qty = 0;
      }
      setOrderedQty(qty);
      setLineValue((qty * unitRate).toFixed(2));
   }

   const handleRemoveFields = id => {
      const values  = [...soDetails];
      values.splice(values.findIndex(value => value.id === id), 1);
      setSODetails(values);
      let totalSOValue = 0;
      const newInputFields = values.map(i => {
         totalSOValue += parseFloat(i.lineValue === null || i.lineValue === undefined?"0":i.lineValue)
      })
      setSOTotalAmount(totalSOValue);
      //handleSOTotalValue();
   }
   
   // 4. Validate the "FORM" before submit
   const findFormErrors = () => {
      const newErrors = {};
      if ( customer.trim().length === 0 ) {
         newErrors.customer = 'Select a Customer!'
      }
      if ( soDate === null ) {
          newErrors.soDate = 'Select a SO Date!'
      }
      if ( poNumber.trim().length === 0 ) {
         newErrors.poNumber = 'Enter a PO Number!'
      }
      if ( poDate === null ) {
         newErrors.poDate = 'Select a PO Date!'
      }
      if ( soTargetDate === null ) {
         newErrors.soTargetDate = 'Select a Target Dispatch Date!'
      }
      /*
      soDetails.map(inputField => {
         if(inputField.jcNo.trim().length === 0) {
            newErrors.jcNo = 'Select a JC !'
         }
         if(inputField.orderedQty.trim().length === 0) {
            newErrors.orderedQty = 'SO Qty Cannot be blank !'
         }
         return;
      });
      */

      return newErrors;
   }
   
   // 5. Reset and Submit Form functions

   // 5.1 Reset The FORM
   const handleReset = () => {
      window.location.reload();
   }

   const uploadFileHandler = async (e) => {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      setUploading(true)
  
      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
  
        const { data } = await axios.post('/api/upload', formData, config)
  
        setUploadPO(data)
        setUploading(false)
      } catch (error) {
        console.error(error)
        setUploading(false)
      }
   }

   const onChangeHandler=event=>{
      const data = new FormData() 
      data.append('file', event.target.files[0])
      setPOFileName(event.target.files[0].name);
      try {
         axios.post("/api/upload/po", data, { // receive two parameter endpoint url ,form data 
         })
         .then(res => { // then print response status
         })
      } catch (error) {
         console.log("Error-------- ", error)
      }
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
         console.log("----------- soDetails ------------ ", soDetails)
         dispatch(
            createSalesOrder({
               company,
               soNumber: autoIncrementedSalesOrderNo,
               soDate,
               soStatus,
               customer,
               billState,
               billPinCode,
               shipState,
               shipPinCode,
               soTotalAmount,
               poNumber,
               poFileName,
               poDate,
               soTargetDate,
               soDetails
            })
         )
      }
   }

   /** styling start */
   let tableStyle = {
      border: "1px solid black",
      width: "100%",
      height: "100%",
      fontFamily:"Arial"
   }
   /** styling end */
   // 6. On "Successful" "FORM" submission navigate user to appropriate screen


   return (
     
      <FormContainer>
         <Breadcrumb
            listPage = "salesorderslist"
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
                     <h3>Sales Order Details Entry</h3>
                  </Col>
               </Row>
               <br></br>
               <div style={{border:"1px solid black", borderRadius:"5px", background:"white"}}>
                  <h6 className="px-2 py-2" style={{background:"#e84347", color:"white"}}>Please Enter Sales Order Details !!!</h6>
                  <br></br>
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='soNo'>
                              <Form.Label>Sales Order #<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='soNo'
                                 readOnly
                                 value={autoIncrementedSalesOrderNo}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='soDate'>
                              <Form.Label>Sales Order Date<span className="mandatory">*</span></Form.Label>
                              <DatePicker
                                 dateFormat="dd-MMM-yyyy" 
                                 className="form-control"
                                 selected={soDate} 
                                 readOnly
                                 onChange={(date) => setSODate(date)} 
                              />
                              <p className="validation-error">{errors.soDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='customer'>
                                 <Form.Label>Select Customer<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={options}
                                    onChange={(e) => handleCustomerName(e)}
                                 />
                                 <p className="validation-error">{errors.customer}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <hr></hr>
                        {/* START of 2nd row in the form */}
                        <Row>
                           <Col>
                              <h5>Address Details</h5>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='billState'>
                              <Form.Label>State of Supply (BILL)<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='billState'
                                 readOnly
                                 value={billState}
                                 onChange={(e) => setBillState(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='billPinCode'>
                              <Form.Label>Pincode<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='billPinCode'
                                 readOnly
                                 value={billPinCode}
                                 onChange={(e) => setBillPinCode(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='shipState'>
                              <Form.Label>State of Supply (SHIP)<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='shipState'
                                 readOnly
                                 value={shipState}
                                 onChange={(e) => setShipState(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='shipPinCode'>
                              <Form.Label>Pincode<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='shipPinCode'
                                 readOnly
                                 value={shipPinCode}
                                 onChange={(e) => setShipPinCode(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        <hr></hr>
                        {/* START of 3rd row in the form */}
                        <Row>
                           <Col>
                              <h5>PO Details</h5>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='poNumber'>
                              <Form.Label>P.O. #<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='poNumber'
                                 value={poNumber}
                                 onChange={(e) => setPONumber(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.poNumber}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='poDate'>
                              <Form.Label>P.O. Date<span className="mandatory">*</span></Form.Label>
                              <DatePicker 
                                 className="form-control"
                                 dateFormat="dd-MMM-yyyy" 
                                 selected={poDate} 
                                 onChange={(date) => setPODate(date)} 
                                 maxDate={new Date()}
                              />
                              <p className="validation-error">{errors.poDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='soTargetDate'>
                                 <Form.Label>Target Dispatch Date<span className="mandatory">*</span></Form.Label>
                                 <DatePicker 
                                    className="form-control"
                                    dateFormat="dd-MMM-yyyy" 
                                    selected={soTargetDate} 
                                    onChange={(date) => setSOTargetDate(date)} 
                                 />
                                 <p className="validation-error">{errors.soTargetDate}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={6} md={12} xs={12}>
                              <Form.Label>Upload PO File <span style={{fontWeight:"bold"}}>(Only PDF Files)</span></Form.Label>
                              <br />
                              <input 
                                 type="file" 
                                 name="file" 
                                 onChange={onChangeHandler}
                              />
                              {uploading && <Loader />}
                              <br />
                              {/*
                              <Form.Group controlId='uploadPO'>
                                 <Form.Label>Upload PO File</Form.Label>
                                 <Form.File
                                 id='image-file'
                                 label='Choose File'
                                 custom
                                 onChange={onChangeHandler}
                                 ></Form.File>
                                 {uploading && <Loader />}
                                 <Form.Label>Image</Form.Label>
                                 <Form.Control
                                 type='text'
                                 placeholder='Enter PO url'
                                 value={uploadPO}
                                 onChange={(e) => setUploadPO(e.target.value)}
                                 ></Form.Control>
                                 <Form.File
                                 id='image-file'
                                 label='Choose File'
                                 custom
                                 onChange={uploadFileHandler}
                                 ></Form.File>
                                 {uploading && <Loader />}
                              </Form.Group>*/}
                           </Col>
                        </Row>
                        {/* START of 4th row in the form */}
                        <br />
                        <div style={{border:"1px solid red", borderRadius:"7px"}} className="my-2">
                           <Row className="mx-2 my-2">
                              <Col>
                                 <h5>Order Details</h5>
                              </Col>
                           </Row>
                           <Row className="mx-2 my-2">
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='customerId'>
                                    <Form.Label>Select JC Description<span className="mandatory">*</span></Form.Label>
                                    <Select 
                                       name="jcDescription"
                                       options = {customerSpecificJCs!==undefined?(customerSpecificJCs.map(jc => {
                                          return { value: jc._id, label: jc.jcDescription }
                                       })):null} 
                                       onChange={event => handleJCSelection(event)}
                                       value={selectedJCDescription}
                                    />
                                    <p className="validation-error">{errors.jcNo}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={2} md={12} xs={12}>
                                 <Form.Group controlId='customerId'>
                                    <Form.Label>Select JC #<span className="mandatory">*</span></Form.Label>
                                    <Select 
                                       name="jcNo"
                                       options = {customerSpecificJCs!==undefined?(customerSpecificJCs.map(jc => {
                                          return { value: jc._id, label: jc.jcno }
                                       })):null} 
                                       onChange={event => handleJCSelection(event)}
                                       value={selectedJCNo}
                                    />
                                    <p className="validation-error">{errors.jcNo}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={3} md={12} xs={12}>
                                 <Form.Group controlId='cpin'>
                                    <Form.Label>CPN<span className="mandatory">*</span></Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={cpin}
                                       name="cpin"
                                       readOnly
                                    ></Form.Control>
                                    <p className="validation-error">{errors.cpin}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={3} md={12} xs={12}>
                                 <Form.Group controlId='soUnitRate'>
                                    <Form.Label>Unit Rate(₹)<span className="mandatory">*</span></Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={Number(unitRate).toFixed(2)}
                                       name="soUnitRate"
                                       readOnly
                                    ></Form.Control>
                                    <p className="validation-error">{errors.soUnitRate}</p>
                                 </Form.Group>
                              </Col>
                           </Row>
                           <Row className="mx-2 my-2">
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='orderedQty'>
                                    <Form.Label>Enter Order Qty.<span className="mandatory">*</span></Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={orderedQty}
                                       name="orderedQty"
                                       onChange={event => handleOrderedQty(event)}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.orderedQty}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={3} md={12} xs={12}>
                                 <Form.Group controlId='lineValue'>
                                    <Form.Label>Line Value(₹)<span className="mandatory">*</span></Form.Label>
                                       <Form.Control
                                          type='text'
                                          placeholder=''
                                          value={lineValue}
                                          name="lineValue"
                                          readOnly
                                       ></Form.Control>
                                    <p className="validation-error">{errors.orderedQty}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={3} md={12} xs={12}>
                                 <Form.Group controlId='soLineTargetDate'>
                                    <Form.Label>Target Dispatch Date<span className="mandatory">*</span></Form.Label>
                                    <DatePicker 
                                       className="form-control"
                                       dateFormat="dd-MMM-yyyy" 
                                       selected={soLineTargetDate} 
                                       onChange={(date) => setSOLineTargetDate(date)} 
                                    />
                                    <p className="validation-error">{errors.soTargetDate}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={2} md={12} xs={12} style={{textAlign:"end", marginTop:"20px"}}>
                                 <Button 
                                    className='my-3 btn-sm ' 
                                    onClick={handleOrderLineDetails}
                                    disabled={ lineValue <= 0 }
                                 >
                                    (+) Add
                                 </Button>
                              </Col>
                           </Row>
                        </div>
                        <br></br>
                        <Row>
                           <Col>
                              <h5>Added Order Details</h5>
                           </Col>
                        </Row>
                        <p className="validation-error">{errors.drndetails}</p>
                        <hr></hr>
                        <Row>
                           <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                              <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" }}>
                                 <thead>
                                    <tr>
                                       <th className="col-2" style={{ ...tableStyle, color:"black" }}>#</th>
                                       <th className="col-12" style={{ ...tableStyle, color:"black" }}>JC Description</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>CPN</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Qty</th>
                                       <th className="col-6" style={{ ...tableStyle, color:"black" }}>Unit Rate(₹)</th>
                                       <th className="col-6" style={{ ...tableStyle, color:"black" }}>Line Value(₹)</th>
                                       <th className="col-6" style={{ ...tableStyle, color:"black" }}>Target Date</th>
                                       <th className="col-3" style={{ ...tableStyle, color:"black" }}></th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                 </tbody>
                              </table>
                           </Col>
                        </Row>
                        {soDetails.map((openSO, index) => (
                           <React.Fragment key={index}>
                              {index > 0?(
                                 <React.Fragment>
                                    <Row>
                                       <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                          <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed", marginTop:"-22px" }}>
                                             <tbody>
                                                <tr>
                                                   <td  className="col-2" style={tableStyle} colSpan={1}>
                                                      <b>{index}</b>
                                                   </td>
                                                   <td  className="col-12" style={tableStyle} colSpan={1}>
                                                      <b>{openSO.jcDescription}</b>
                                                      <h6 
                                                         style={{ 
                                                            cursor:"pointer",
                                                            display: (customerCode!==undefined?(customerCode.trim() !== "C0022" ? 'none' : 'block'):"") }}
                                                         className='my-3 px-2 btn-sm button-class' 
                                                         data-tip data-for={"poDetails"+index} 
                                                      >
                                                         View PO Details 
                                                      </h6>
                                                   </td>
                                                   <ReactTooltip id={"poDetails"+index} place="bottom" effect="solid">
                                                      JC Description: {openSO.jcDescription}<br />
                                                      PO #: {openSO.customerPONumber}<br />
                                                      PO Date: {openSO.customerPODate==null?"-":format(new Date(openSO.customerPODate), 'dd-MMM-yyyy')}
                                                   </ReactTooltip>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{openSO.cpin}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{openSO.orderedQty}</b>
                                                   </td>
                                                   <td  className="col-6" style={tableStyle} colSpan={1}>
                                                      <b>{openSO.soUnitRate}</b>
                                                   </td>
                                                   <td  className="col-6" style={tableStyle} colSpan={1}>
                                                      <b>{openSO.lineValue}</b>
                                                   </td>
                                                   <td  className="col-6" style={tableStyle} colSpan={1}>
                                                      <b>{format(new Date(openSO.soLineTargetDate), 'dd-MMM-yyyy')}</b>
                                                   </td>
                                                   <td  className="col-3 my-2" style={tableStyle} colSpan={1}>
                                                      <Button
                                                         variant="danger" 
                                                         className="btn-sm my-2"
                                                         disabled={soDetails.length === 1} 
                                                         onClick={() => handleRemoveFields(openSO.id)}
                                                      >X
                                                      </Button>
                                                   </td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </Col>
                                    </Row>
                                 </React.Fragment>
                           ):(null)}
                            <br></br>  
                           </React.Fragment>
                        ))}
                        <br />
                        <br />
                        {/* START of 6th row in the form */}
                        <Row>
                           <Col lg={8} md={12} xs={12} style={{textAlign:"end"}}>
                              <Form.Label><b style={{textAlign:"center"}}>Total (₹) <br></br>(Exclusive of GST)</b></Form.Label>
                           </Col>
                           <Col lg={2} md={12} xs={12} style={{textAlign:"end"}}>
                              <Form.Control
                                 type='text'
                                 placeholder=''
                                 value={Number(soTotalAmount).toFixed(2)}
                                 name="soTotalAmount"
                                 readOnly
                                 
                              ></Form.Control>
                           </Col>
                        </Row>
                        
                        {/* START of 7th row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='mx-3 my-3 btn-md reset-button-class' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button 
                                 type='submit' 
                                 disabled={soDetails.length === 1 || executing}
                                 className=' my-3 btn-md button-class' 
                                 onClick={(e) => e.currentTarget.blur()}
                              >
                                 <i className="fas fa-save"></i> Save
                              </Button>
                           </Col>
                        </Row>
                        
                     </Col>
                  </Form>
               </div>
            </>
         )}
      </FormContainer>
   )
}

export default SalesOrderCreateScreen
