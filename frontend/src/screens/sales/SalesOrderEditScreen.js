//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
// import Select from 'react-select'
// import { format } from 'date-fns'
import { logger } from './../../util/ConsoleHelper';


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// React Notification
import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';
//import Sales Order Redux "action(s)"
import {
   getSalesOrderDetails,
   updateSalesOrder, 
   getAllMasterDataForSalesOrder 
} from './../../actions/sales/salesOrderActions';

//import Redux "constantc(s)"
import { 
   SALES_ORDER_UPDATE_REQUEST, 
   SALES_ORDER_UPDATE_RESET 
} from '../../constants/sales/salesOrderConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';
import { getCustomerJCs } from './../../actions/masters/jcMasterActions';
import NumberFormat from 'react-number-format';


const SalesOrderEditScreen = ({ history, match }) => {
   
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const salesOrderId = match.params.id;
   //console .log("1. Edit Sales Order Screen Sales Order Id ==== ", salesOrderId)

   const salesOrderDetails = useSelector((state) => state.salesOrderDetails)

   const { loading, salesOrder, error } = salesOrderDetails;
	//console .log(">>>>> Inside Edit SALES ORDER Master screen and detais are <<<<<< ", salesOrder)

   const masterDataForSalesOrder = useSelector((state) => state.masterDataForSalesOrder)

   const { loading: loadingMasterData, error: errorMasterDataLoad } = masterDataForSalesOrder;

   //check to get Customer specific JCs
   const allCustomerJCList = useSelector((state) => state.allCustomerJCList)
   const { loading: loadingJCData, error: errorJCDataLoad } = allCustomerJCList;

   //post updated JC record
   const salesOrderUpdate = useSelector((state) => state.salesOrderUpdate);
   const { success: successUpdate, error: errorUpdate } = salesOrderUpdate
   //logger("1. Insode update success is ======== ", successUpdate)

   // 2. Define All Form Variables and their state
   const [ soNo, setSoNo ] = useState("");
   const [ soId, setSOId ] = useState(1);
   const [ soNumber, setSONumber ] = useState("");
   const [ soDate, setSODate ] = useState(new Date());
   const [ soStatus, setSOStatus ] = useState(1);
   const [ customer, setCustomer ] = useState("");
   const [ customerId, setCustomerId ] = useState("");
   const [ billState, setBillState ] = useState("");
   const [ billPinCode, setBillPinCode ] = useState("");
   const [ shipState, setShipState ] = useState("");
   const [ shipPinCode, setShipPinCode ] = useState("");
   const [ soTotalAmount, setSOTotalAmount ] = useState(0);
   const [ isActive, setIsActive ] = useState("A");
   const [ poNumber, setPONumber ] = useState("");
   const [ poDate, setPODate ] = useState(null);
   const [ soTargetDate, setSOTargetDate ] = useState(null);
   const [ company, setCompany ] = useState(userInfo.companyId);
   const [ balQtyUpdated, setBalQtyUpdated ] = useState(false);
   
   //disable button on click
   const [executing, setExecuting] = useState(false);

   const [soDetails, setSODetails] = useState([
      { 
         id: uuidv4(), 
         lineNumber:'1', 
         jcNo: '', 
         cpin: '',
         orderedQty: '',
         soUnitRate: '',
         lineValue: '' 
      },
   ]);

   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   useEffect(() => {
      
      if (salesOrder._id !== salesOrderId) {
         //console .log("2. Edit Sales Order Screen and Inside useEffect. Before getting SO Details ==== ")
         dispatch(getSalesOrderDetails(salesOrderId))
      } else {
         //format(new Date(value), 'dd-MMM-yyyy')
         setFormData();
      }
      if(successUpdate) {
         history.push('/salesorderslist');
         dispatch({ type: SALES_ORDER_UPDATE_RESET })
         NotificationManager.success(`Sales Order # ${salesOrder.soNumber} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         NotificationManager.error(`Error in updating Sales Order # ${salesOrder.soNumber} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [salesOrderId, salesOrder, successUpdate]);

   const setFormData = () => {
      dispatch(getCustomerJCs(salesOrder.customer._id))
      setSONumber(salesOrder.soNumber);
      setSODate((new Date(salesOrder.soDate)));
      setCustomer(salesOrder.customer.custName);
      setCustomerId(salesOrder.customer._id);
      setBillState(salesOrder.billState);
      setBillPinCode(salesOrder.billPinCode);
      setShipState(salesOrder.shipState);
      setShipPinCode(salesOrder.shipPinCode);
      setSOTotalAmount(salesOrder.soTotalAmount);
      setPONumber(salesOrder.poNumber);
      setPODate(new Date(salesOrder.poDate));
      setSOTargetDate(new Date(salesOrder.soTargetDate));
      let newSODetails = [...salesOrder.soDetails]
      let newSODetails1 = newSODetails.map(sod => {
         sod.id = uuidv4(); 
         sod.lineNumber = sod.lineNumber; 
         sod.jcNo = sod.jcNo; 
         sod.cpin = sod.jcNo.customerPartNumber;
         sod.orderedQty = sod.orderedQty;
         sod.soUnitRate = sod.soUnitRate;
         sod.lineValue = sod.lineValue;
         if(sod.balancedQty < sod.orderedQty) {
            setBalQtyUpdated(true);
         }
         return sod;
      })
      //logger("--------> before setting data <----------- ", newSODetails1)
      setSODetails(newSODetails1);
   }

   // 3. Input Field Handlers
   //Customer specific JCs
  //Customer specific JCs
  let customerSpecificJCs = [];

  if(allCustomerJCList !== undefined) {
     customerSpecificJCs = allCustomerJCList.customerJCs;
     //console .log("*********** Nadi naale na jao sham paiya padooooooooooooo >>>>>>>>>>> ", customerSpecificJCs);
  }
   // 3.1 Functions to set dynamic form fields state
   const  handleSOTotalValue = () => {
      //logger(">>>>>  handleSOTotalValue ==== ", event)
      let totalSOValue = 0;
      const newInputFields = soDetails.map(i => {
         totalSOValue += parseFloat(i.lineValue === null?"0":i.lineValue)
      })
      setSOTotalAmount(totalSOValue);
   }

   const handleChangeInput = (id, event) => {
      let soValue = 0;
      const newInputFields = soDetails.map(i => {
         //console .log("Now printing input fields ==== ", i)
         //console .log("Now printing ID of Input Field ==== ", id)
         if(id === i.id) {
            i[event.target.name] = event.target.value
            if(event.target.name === "jcNo") {
               let srs = [...customerSpecificJCs];
               let naam = srs.filter(pc=>{
                  return pc._id.trim() === event.target.value.trim();
               })
               console .log(">>>>>>>>>> JC Number Selected and Value is <<<<<<<<<<<< ", naam)
               if(naam !== undefined) {
                  i.orderedQty= 0;
                  i.cpin = naam[0].customerPartNumber;
                  for (const cust of naam[0].jcCustomerDetails) {
                     if(cust.customerId === customerId) {
                        i.soUnitRate= cust.customerPrice;
                     }
                  }
                  i.lineValue = 0;
                  //resetErrorMessage("jcNo")
               } else {
                  i.cpin = "";
                  i.orderedQty = "";
                  i.soUnitRate= "";
                  i.lineValue = "";
               }
                  
            }
               
            if(event.target.name === "orderedQty") {
               i.lineValue = (parseFloat(i.orderedQty === ""?"0":i.orderedQty) * parseFloat(i.soUnitRate)).toFixed(2);
               //console .log("!@#$%^&*() Line Order Qty = ", event.target.value)
               //resetErrorMessage("orderedQty")
            }
               
         }
         return i;
      })
      //logger("New Input Fields are ", newInputFields)
      setSODetails(newInputFields);
   }

   const handleAddFields = () => {
      setSODetails([...soDetails, { 
         id: uuidv4(),  
         lineNumber: '2', 
         jcNo: '',
         cpin: '',
         orderedQty: '0',
         soUnitRate: '0',
         lineValue: '0' 
      }])
   }

   const handleRemoveFields = id => {
      const values  = [...soDetails];
      values.splice(values.findIndex(value => value.id === id), 1);
      setSODetails(values);
      let totalSOValue = 0;
      const newInputFields = values.map(i => {
         totalSOValue += parseFloat(i.lineValue === null?"0":i.lineValue)
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

      soDetails.map(inputField => {
         
         // if(inputField.jcNo._id.trim().length === 0) {
         //    logger("5. Insiode Validate Function and input values are ", inputField)
         //    newErrors.jcNo._id = 'Select a JC !'
         // }
         // if(inputField.orderedQty.trim().length === 0) {
         //    newErrors.orderedQty = 'SO Qty Cannot be blank !'
         // }
         return;
      });

      return newErrors;
   }

   // 5. Reset and Submit Form functions
   // 5.1 Reset The FORM
   const handleReset = () => {
      //setFormData();
      window.location.reload();
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
         logger("2. Triggering Update Action for SO ID ==== ", salesOrderId)
         logger("2. Triggering Update Action for SO Details ==== ", soDetails)
         dispatch(
            updateSalesOrder({
               _id: salesOrderId,
               soDetails,
               soStatus: 1
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

   return (
      <FormContainer>
         <Breadcrumb
            listPage = "salesorderslist"
         />
         <br></br>
         {loadingMasterData ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <>
               <Row>
                  <Col>
                     <h3>Sales Order Details Edit</h3>
                  </Col>
               </Row>
               <br></br>
               <div style={{border:"1px solid black", borderRadius:"5px", background:"white"}}>
                  <h6 className="px-2 py-2" style={{background:"#e84347", color:"white"}}>Please Edit Sales Order Details !!!</h6>
                  <br></br>
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='soNumber'>
                                 <Form.Label>Sales Order #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='soNumber'
                                    readOnly
                                    value={soNumber}
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
                                    onChange={(date) => setSODate(date)} 
                                    readOnly
                                 />
                                 <p className="validation-error">{errors.soDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='customer'>
                                 <Form.Label>Customer<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='customer'
                                    readOnly
                                    value={customer}
                                 ></Form.Control>
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
                                 readOnly
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
                                 dateFormat="dd-MMM-yyyy" 
                                 readOnly
                                 className="form-control"
                                 selected={poDate} 
                                 onChange={(date) => setPODate(date)} 
                              />
                              <p className="validation-error">{errors.poDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='soTargetDate'>
                                 <Form.Label>Target Dispatch Date<span className="mandatory">*</span></Form.Label>
                                 <DatePicker
                                    dateFormat="dd-MMM-yyyy" 
                                    readOnly
                                    className="form-control"
                                    selected={soTargetDate} 
                                    onChange={(date) => setSOTargetDate(date)} 
                                 />
                                 <p className="validation-error">{errors.soTargetDate}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <hr></hr>
                        {/* START of 4th row in the form */}
                        <Row>
                           <Col>
                              <h5>Order Details</h5>
                           </Col>
                        </Row>
                        {/* START of 5th row in the form */}
                        {/*<Row>
                           <Col lg={1} md={12} xs={12}>
                              <Form.Label><b>#</b><span className="mandatory"></span></Form.Label>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Label><b>JC Description</b><span className="mandatory">*</span></Form.Label>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Label><b>CPIN</b></Form.Label>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Label><b>Qty</b></Form.Label>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Label><b>Rate(₹)</b></Form.Label>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Label><b>SO Value(₹)</b></Form.Label>
                           </Col>
                           <Col lg={1} md={12} xs={12} style={{textAlign:"end"}}>
                              <Button
                              className="btn-md "
                              style={{marginRight:"0px"}}
                              onClick={handleAddFields}
                              >+</Button>
                           </Col>
                        </Row>*/}
                        {/*<hr></hr>*/}
                        <Row>
                           <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                              <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" }}>
                                 <thead>
                                 <tr>
                                    <th className="col-2" style={{ ...tableStyle, color:"black" }}>#</th>
                                    <th className="col-10" style={{ ...tableStyle, color:"black" }}>JC Description</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>CPN</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>Qty</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>Rate(₹)</th>
                                    <th className="col-6" style={{ ...tableStyle, color:"black" }}>SO Value(₹)</th>
                                    <th className="col-2" style={{ ...tableStyle, color:"black" }}>
                                       <Button
                                       className="btn-sm"
                                       style={{marginRight:"0px"}}
                                       onClick={handleAddFields}
                                       >+</Button>
                                    </th>
                                 </tr>
                                 </thead>
                                 <tbody>
                                 </tbody>
                              </table>
                           </Col>
                        </Row>
                        { soDetails.map((inputField, index) => (
                           <React.Fragment>
                              <Row key={index}>
                                 <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                    <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed", marginTop:index===0?"0px":"0px" }}>
                                       <tbody>
                                          <tr>
                                             <td style={tableStyle} className="col-2">
                                                {<Form.Label style={{marginTop:"10px"}}><b>{index+1}</b></Form.Label>}
                                             </td>
                                             <td style={tableStyle} className="col-10">
                                                <Form.Group controlId='customerId'>
                                                   <Form.Control
                                                      as='select'
                                                      custom
                                                      placeholder='Select JC'
                                                      value={inputField.jcNo._id}
                                                      name="jcNo"
                                                      onChange={event => handleChangeInput(inputField.id, event)}
                                                   >
                                                      <option value="none">Select</option>
                                                      {customerSpecificJCs!==undefined?(customerSpecificJCs.map(jc => {
                                                         return <option key={jc._id}  value={jc._id}>{jc.jcDescription}</option>
                                                      })):null}
                                                   </Form.Control>
                                                   <p className="validation-error">{errors.jcNo}</p>
                                                </Form.Group>
                                             </td>
                                             <td style={tableStyle} className="col-5">
                                                <Form.Group controlId='cpin'>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={inputField.jcNo.jcCustomerDetails !==undefined? inputField.jcNo.customerPartNumber:""}
                                                      name="cpin"
                                                      readOnly
                                                      onChange={event => handleChangeInput(inputField.id, event)}
                                                   ></Form.Control>
                                                   <p className="validation-error">{errors.cpin}</p>
                                                </Form.Group>
                                             </td>
                                             <td style={tableStyle} className="col-5">
                                                <Form.Group controlId='orderedQty'>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={inputField.orderedQty}
                                                      name="orderedQty"
                                                      onChange={event => handleChangeInput(inputField.id, event)}
                                                      onBlur={event => handleSOTotalValue()}
                                                   ></Form.Control>
                                                   <p className="validation-error">{errors.orderedQty}</p>
                                                </Form.Group>
                                             </td>
                                             <td style={tableStyle} className="col-5">
                                                <Form.Group controlId='soUnitRate'>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={parseFloat(inputField.soUnitRate).toFixed(2)}
                                                      name="soUnitRate"
                                                      readOnly
                                                      onChange={event => handleChangeInput(inputField.id, event)}
                                                   ></Form.Control>
                                                   <p className="validation-error">{errors.soUnitRate}</p>
                                                </Form.Group>
                                             </td>
                                             <td style={tableStyle} className="col-6">
                                                <Form.Group controlId='lineValue'>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={parseFloat(inputField.lineValue).toFixed(2)}
                                                      name="lineValue"
                                                      readOnly
                                                      onChange={event => handleChangeInput(inputField.id, event)}
                                                   ></Form.Control>
                                                   <p className="validation-error">{errors.lineValue}</p>
                                                </Form.Group>
                                             </td>
                                             <td style={tableStyle} className="col-2">
                                                <Button
                                                   variant="danger" 
                                                   className="btn-sm"
                                                   style={{marginTop:"10px"}}
                                                   disabled={soDetails.length === 1} 
                                                   onClick={() => handleRemoveFields(inputField.id)}
                                                >X
                                                </Button>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </Col>
                              </Row>
                           {/*<Row key={index}>
                              <Col lg={1} md={12} xs={12}>
                                 <Form.Label style={{marginTop:"10px"}}><b>{index+1}</b></Form.Label>
                              </Col>
                              <Col lg={2} md={12} xs={12}>
                                 <Form.Group controlId='customerId'>
                                    
                                    <Form.Control
                                       as='select'
                                       custom
                                       placeholder='Select JC'
                                       value={inputField.jcNo._id}
                                       name="jcNo"
                                       onChange={event => handleChangeInput(inputField.id, event)}
                                    >
                                       <option value="none">Select</option>
                                       {customerSpecificJCs!==undefined?(customerSpecificJCs.map(jc => {
                                          return <option key={jc._id}  value={jc._id}>{jc.jcDescription}</option>
                                       })):null}
                                    </Form.Control>
                                    <p className="validation-error">{errors.jcNo}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={2} md={12} xs={12}>
                                 <Form.Group controlId='cpin'>
                                    
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={inputField.jcNo.jcCustomerDetails !==undefined? inputField.jcNo.customerPartNumber:""}
                                       name="cpin"
                                       readOnly
                                       onChange={event => handleChangeInput(inputField.id, event)}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.cpin}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={2} md={12} xs={12}>
                                 <Form.Group controlId='orderedQty'>
                                    
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={inputField.orderedQty}
                                       name="orderedQty"
                                       onChange={event => handleChangeInput(inputField.id, event)}
                                       onBlur={event => handleSOTotalValue()}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.orderedQty}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={2} md={12} xs={12}>
                                 <Form.Group controlId='soUnitRate'>
                                    
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={parseFloat(inputField.soUnitRate).toFixed(2)}
                                       name="soUnitRate"
                                       readOnly
                                       onChange={event => handleChangeInput(inputField.id, event)}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.soUnitRate}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={2} md={12} xs={12}>
                                 <Form.Group controlId='lineValue'>
                                    
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={parseFloat(inputField.lineValue).toFixed(2)}
                                       name="lineValue"
                                       readOnly
                                       onChange={event => handleChangeInput(inputField.id, event)}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.lineValue}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={1} md={12} xs={12} style={{textAlign:"end"}}>
                                 <Button
                                    variant="danger" 
                                    className="btn-md"
                                    style={{marginTop:"10px"}}
                                    disabled={soDetails.length === 1} 
                                    onClick={() => handleRemoveFields(inputField.id)}
                                 >X
                                 </Button>
                                 
                              </Col>
                           </Row>*/}
                        </React.Fragment>
                        )) }
                        <br></br>
                        {/* START of 6th row in the form */}
                        <Row>
                           <Col lg={9} md={12} xs={12} style={{textAlign:"end"}}>
                              <Form.Label><b style={{textAlign:"center"}}>Total (₹) <br></br>(Exclusive of GST)</b></Form.Label>
                           </Col>
                           <Col lg={2} md={12} xs={12} style={{textAlign:"end", border:"1px solid black", borderRadius:"5px", height:"40px", width:"30%", background:"#ededed"}}>
                              <NumberFormat
                                 style={{fontSize:"16px", fontWeight:"bold", marginTop:"5px"}}
                                 thousandsGroupStyle="lakh"
                                 value = {soTotalAmount!==undefined?soTotalAmount.toFixed(2):"0.00"}
                                 decimalSeparator="."
                                 displayType="text"
                                 type="text"
                                 thousandSeparator={true}
                                 allowNegative={true} 
                              />
                              {/*<Form.Control
                                 type='text'
                                 placeholder=''
                                 value={soTotalAmount.toFixed(2)}
                                 name="soTotalAmount"
                                 readOnly
                                 
                              ></Form.Control>*/}
                           </Col>
                        </Row>
                        {/* START of 7th row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button 
                                 type='submit'
                                 disabled={executing} 
                                 className=' my-3 btn-md button-class' onClick={(e) => e.currentTarget.blur()} disabled={salesOrder.soStatus !== 1 || balQtyUpdated} ><i className="fas fa-save"></i> Save</Button>
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

export default SalesOrderEditScreen
