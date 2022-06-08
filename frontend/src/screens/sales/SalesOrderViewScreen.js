//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
// import Select from 'react-select'
// import { format } from 'date-fns'
import { logger } from './../../util/ConsoleHelper';
import ReactTooltip from 'react-tooltip';
import axios from 'axios'
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
   getAllMasterDataForSalesOrder,
   deleteSalesOrder
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
import { format } from 'date-fns'

const SalesOrderViewScreen = ({ history, match }) => {

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const salesOrderId = match.params.id;
   //console .log("1. Edit Sales Order Screen Sales Order Id ==== ", salesOrderId)

   const salesOrderDetails = useSelector((state) => state.salesOrderDetails)

   const { loading, salesOrder, error } = salesOrderDetails;
	//console .log(">>>>> Inside Edit SALES ORDER Master screen and detais are <<<<<< ", salesOrder)

   // 2. Define All Form Variables and their state
   const [ soNo, setSoNo ] = useState("");
   const [ soId, setSOId ] = useState(1);
   const [ soNumber, setSONumber ] = useState("");
   const [ soDate, setSODate ] = useState(new Date());
   const [ soStatus, setSOStatus ] = useState(1);
   const [ customer, setCustomer ] = useState("");
   const [ customerCode, setCustomerCode ] = useState("");
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
   const [ poFileName, setPOFileName ] = useState("-");

   const [soDetails, setSODetails] = useState([
      { 
         id: uuidv4(), 
         lineNumber:'1', 
         jcNo: '', 
         cpin: '',
         orderedQty: '',
         soUnitRate: '',
         lineValue: '',
         customerPONumber: '',
         customerPODate: null,
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
      window.scrollTo(0, 0)
   }, [salesOrderId, salesOrder ]);

   const setFormData = () => {
      dispatch(getCustomerJCs(salesOrder.customer._id))
      setSONumber(salesOrder.soNumber);
      setSODate((new Date(salesOrder.soDate)));
      setCustomer(salesOrder.customer.custName);
      setCustomerCode(salesOrder.customer.custCode);
      setCustomerId(salesOrder.customer._id);
      setBillState(salesOrder.billState);
      setBillPinCode(salesOrder.billPinCode);
      setShipState(salesOrder.shipState);
      setShipPinCode(salesOrder.shipPinCode);
      setSOTotalAmount(salesOrder.soTotalAmount);
      setPONumber(salesOrder.poNumber);
      //po file name
      setPOFileName(salesOrder.poFileName !== undefined?salesOrder.poFileName:"-")
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

         sod.customerPONumber = sod.customerPONumber===undefined?"":sod.customerPONumber;
         sod.customerPODate = sod.customerPODate===undefined?null:sod.customerPODate;
         
         if(sod.balancedQty < sod.orderedQty) {
            setBalQtyUpdated(true);
         }
         return sod;
      })
      setSODetails(newSODetails1);
   }

   const viewFile = e => {
      console.log("------------- viewFile START -------------", poFileName)
      e.currentTarget.blur()
      axios(`/api/upload/pofile?fileName=${poFileName} `, {
         method: "GET",
         responseType: "blob"
         //Force to receive data in a Blob Format
       })
         .then(response => {
           //Create a Blob from the PDF Stream
           const file = new Blob([response.data], {
             type: "application/pdf"
           });
           //Build a URL from the file
           const fileURL = URL.createObjectURL(file);
           //Open the URL on new Window
           window.open(fileURL);
         })
         .catch(error => {
           console.log(error);
         });

      console.log("------------- viewFile END -------------")
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
      <React.Fragment>
         <Breadcrumb
            listPage = "salesorderslist"
         />
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col>
                     <h3>View Sales Order Details</h3>
                  </Col>
               </Row>
               <br></br>
               <div style={{border:"1px solid black", borderRadius:"5px", background:"white"}}>
                  <h6 className="px-2 py-2" style={{background:"#e84347", color:"white"}}>Sales Order Details !!!</h6>
                  <br></br>
                  <Form>
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
                           <Col lg={3} md={12} xs={12}>
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
                           <Col lg={3} md={12} xs={12}>
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
                           <Col lg={3} md={12} xs={12}>
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
                           <Col lg={3} md={12} xs={12}>
                              <Form.Label>View PO File</Form.Label><br />
                              <Button 
                                 className='my-2 btn-sm ' 
                                 onClick={(e)=>viewFile(e)}
                                 disabled={ poFileName === "" || poFileName === "-" }
                              >View PO</Button>
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
                                             <td className="col-2" style={{ ...tableStyle, color:"black" }}>
                                                {index+1}
                                             </td>

                                             <ReactTooltip id={"poDetails"+index} place="bottom" effect="solid">
                                                JC Description: {inputField.jcNo.jcDescription}<br />
                                                PO #: {inputField.jcNo.jcCustomerDetails!==undefined?inputField.jcNo.jcCustomerDetails[0].customerPONumber:""}<br />
                                                PO Date: {inputField.jcNo.jcCustomerDetails!==undefined?(inputField.jcNo.jcCustomerDetails[0].customerPODate==null?"-":format(new Date(inputField.jcNo.jcCustomerDetails[0].customerPODate), 'dd-MMM-yyyy')):""}
                                             </ReactTooltip>

                                             <td className="col-12" style={{ ...tableStyle, color:"black" }}>
                                                {inputField.jcNo.jcDescription}
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
                                             <td className="col-5" style={{ ...tableStyle, color:"black" }}>
                                                {inputField.jcNo.jcCustomerDetails !==undefined? inputField.jcNo.customerPartNumber:""}
                                             </td>
                                             <td className="col-5" style={{ ...tableStyle, color:"black" }}>
                                                {inputField.orderedQty}
                                             </td>
                                             <td className="col-6" style={{ ...tableStyle, color:"black" }}>
                                                {parseFloat(inputField.soUnitRate).toFixed(2)}
                                             </td>
                                             <td className="col-6" style={{ ...tableStyle, color:"black" }}>
                                                {parseFloat(inputField.lineValue).toFixed(2)}
                                             </td>
                                             <td className="col-6" style={{ ...tableStyle, color:"black" }}>
                                                {format(new Date(inputField.soLineTargetDate===undefined?soTargetDate:inputField.soLineTargetDate), 'dd-MMM-yyyy')}
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </Col>
                              </Row>
                        </React.Fragment>
                        )) }
                        <br></br>
                        {/* START of 6th row in the form */}
                        <Row>
                           <Col lg={8} md={12} xs={12} style={{textAlign:"end"}}>
                              <Form.Label><b style={{textAlign:"center"}}>Total (₹) <br></br>(Exclusive of GST)</b></Form.Label>
                           </Col>
                           <Col lg={2} md={12} xs={12} 
                              style={{textAlign:"end", marginLeft:"10px", border:"1px solid black", borderRadius:"5px", height:"40px", width:"30%", background:"#ededed"}}>
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
                           </Col>
                        </Row>
                     </Col>
                  </Form>
               </div>
            </React.Fragment>
         )}
      </React.Fragment>
   )
}

export default SalesOrderViewScreen
