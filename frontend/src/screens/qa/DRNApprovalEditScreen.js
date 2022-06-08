//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
// import Select from 'react-select'
import { format } from 'date-fns'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// React Notification
import { NotificationManager } from 'react-notifications';
import { logger } from './../../util/ConsoleHelper';


//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from '../../components/app/Breadcrumb';
//import DRN Redux "action(s)"
import { updateDRN, getAllMasterDataForDRN, getDRNDetails } from '../../actions/production/drnActions';

//import Redux "constantc(s)"
import { DRN_UPDATE_RESET } from '../../constants/production/drnConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import { getCustomerOpenSalesOrders } from '../../actions/sales/salesOrderActions';
import StepperComponent from './../../components/app/StepperComponent';
import { Card } from 'react-bootstrap';

const DRNApprovalEditScreen = ({ match, history }) => {

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const drnId = match.params.id;

   const drnData = useSelector((state) => state.drnDetails)

   const { loading, drn, error } = drnData;

   //Customer specific JCs
   let customerOpenSalesOrders = [];
   let customers = [];
   let options = [];
   
   //4. Define All Form Variables and their state
   const [ drnNumber, setDRNNo ] = useState("");
   const [ dRNStatus, setDRNStatus ] = useState("");
   const [ drnDate, setDRNDate] = useState(new Date());
   const [ customer, setCustomer ] = useState("");
   const [ customerId, setCustomerId ] = useState("");
   const [ qaRemark, setQARemark ] = useState("");
   const [ openSOCount, setOpenSOCount ] = useState(0);
   const [ billState, setBillState ] = useState("");
   const [ billPinCode, setBillPinCode ] = useState("");
   const [ shipState, setShipState ] = useState("");
   const [ shipPinCode, setShipPinCode ] = useState("");
   const [ drnTotalAmount, setDRNTotalAmount ] = useState(0);
   const [ batchId, setBatchId ] = useState("");
   //const [ batchId, setBatchId ] = useState([{}]);

   const [ dispObj, setDispObj ] = useState({name:'', value:0});

   //empty object array to store 
   const [drnDetails, setDRNDetails] = useState([{}]);
   const [deletedDRNDetails, setDeletedDRNDetails] = useState([{}]);

   //address details
   const [ supplierAddress, setSupplierAddress ] = useState([{}]);
   const [ customerBillingAddress, setCustomerBillingAddress ] = useState([{}]);
   const [ customerShipingAddress, setCustomerShipingAddress ] = useState([{}]);

   //Payment Terms
   const [ paymentTerms, setPaymentTerms ] = useState("Within 45 Days"); 

   // 4.1 Validation Errors
   const [ errors, setErrors, drns ] = useState({});

   //post updated JC record
   const drnUpdate = useSelector((state) => state.drnUpdate);
   const { success: successUpdate, error: errorUpdate } = drnUpdate

   useEffect(() => {
      logger(">>>>>>>>---- USE EFFECT Triggerd <<<<<---------")
      if (drn._id !== drnId) {
         //console .log("2. Edit Sales Order Screen and Inside useEffect. Before getting SO Details ==== ")
         dispatch(getDRNDetails(drnId))
      } else {
         //format(new Date(value), 'dd-MMM-yyyy')
         setFormData();
      }
      if(successUpdate) {
         history.push('/drnapprovallist');
         dispatch({ type: DRN_UPDATE_RESET })
         NotificationManager.success(`DRN # ${drn.drnNumber} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: DRN_UPDATE_RESET })
         NotificationManager.error(`Error in updating DRN # ${drn.drnNumber} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [drnId, drn, successUpdate]);

   const setFormData = () => {
      setDRNNo(drn.drnNumber);
      let status = "";
      if(drn.drnStatus === "R") {
         status = "Rejected"
      } else if(drn.drnStatus === "O") {
         status = "Open"
      } else if(drn.drnStatus === "P") {
         status = "Pending For Approval"
      }
      setDRNStatus(status);
      setDRNDate((new Date(drn.drnDate)));
      setCustomer(drn.customer.custName);
      setCustomerId(drn.customer._id);
      setPaymentTerms(drn.paymentTerms === undefined?"Within 30 Days":drn.paymentTerms)
      setBillState(drn.billState);
      setBillPinCode(drn.billPinCode);
      setShipState(drn.shipState);
      setShipPinCode(drn.shipPinCode);
      setDRNTotalAmount(drn.drnTotalAmount);
      setDRNDetails(drn.drnDetails);
      console.log("--------> drn.customerBillingAddress[0] <----------- ", drn.customerBillingAddress[0])
      console.log("--------> drn.customerShipingAddress[0] <----------- ", drn.customerBillingAddress[0])
      setSupplierAddress(drn.supplierAddress[0])
      setCustomerBillingAddress(drn.customerBillingAddress[0])
      setCustomerShipingAddress(drn.customerShipingAddress[0])
   }

   const findFormErrors = () => {

   }

   const handleRemoveFields = id => {
      logger("1. Remove Row and Details ID ==>>><<==== ", id)
      const values  = [...drnDetails];
      //logger("2. Before Rmoving The Data ==>>><<==== ", values)
      values.splice(id,1);
      //logger("3. After Rmoving The Data ==>>><<==== ", values)
      setDRNDetails(values);
   }

   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const handleReset = () => {
      window.location.reload();
   }

   const handleReject = () => {
      dispatch(
         updateDRN({
            _id: drnId,
            drnNumber,
            drnStatus: "R",
            drnDate,
            customerId,
            qaRemark,
            billState,
            billPinCode,
            shipState,
            shipPinCode,
            drnDetails,
            deletedDRNDetails
         })
      )
   }

   //handleApproval
   const handleApproval = () => {
      dispatch(
         updateDRN({
            _id: drnId,
            drnNumber,
            drnStatus: "A",
            drnDate,
            customerId,
            qaRemark,
            billState,
            billPinCode,
            shipState,
            shipPinCode,
            drnDetails,
            deletedDRNDetails
         })
      )
   }

   //8. Form Submit
   const submitHandler = (e) => {
      e.preventDefault();

      const newErrors = findFormErrors();

      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
         NotificationManager.error(`Please fill in the required details !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      } 
      else {
         dispatch(
            updateDRN({
               _id: drnId,
               drnNumber,
               drnDate,
               customer,
               qaRemark,
               billState,
               billPinCode,
               shipState,
               shipPinCode,
               drnDetails,
               deletedDRNDetails
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
            listPage = "drnapprovallist"
         />
         <br></br>
         <StepperComponent activeStep= {2} />
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col>
                     <h4>Dispatch Request Note Details Edit Details</h4>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Edit DRN Details !!!">
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='drnNumber'>
                              <Form.Label>DRN #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='drnNumber'
                                    readOnly
                                    value={drnNumber}
                                    onChange={(e) => setDRNNo(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='dRNStatus'>
                              <Form.Label>DRN Status<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='dRNStatus'
                                    readOnly
                                    value={dRNStatus}
                                    onChange={(e) => setDRNStatus(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='drnDate'>
                                 <Form.Label>DRN Date<span className="mandatory">*</span></Form.Label>
                                 <DatePicker
                                    dateFormat="dd-MMM-yyyy" 
                                    className="form-control"
                                    selected={drnDate} 
                                    onChange={(date) => setDRNDate(date)} 
                                    readOnly
                                 />
                                 <p className="validation-error">{errors.drnDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
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
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Card>
                                 <Card.Header style={{ fontWeight:"bold" }}>Supplier Address</Card.Header>
                                 <Card.Body>
                                    <Card.Text style={{ fontSize:"12px" }}>
                                       {supplierAddress.addressLine1}<br />
                                       {supplierAddress.addressLine2}<br />
                                       {supplierAddress.addressLine3}<br />
                                    </Card.Text>
                                 </Card.Body>
                              </Card>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Card>
                                 <Card.Header style={{ fontWeight:"bold" }}>Billing Address</Card.Header>
                                 <Card.Body>
                                    <Card.Text style={{ fontSize:"12px" }}>
                                       {customerBillingAddress.addressLine1}<br />
                                       {customerBillingAddress.addressLine2}<br />
                                       {customerBillingAddress.addressLine3}<br />
                                    </Card.Text>
                                 </Card.Body>
                              </Card>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Card>
                                 <Card.Header style={{ fontWeight:"bold" }}>Shipping Address</Card.Header>
                                 <Card.Body>
                                    {/*<Card.Title>Special title treatment</Card.Title>*/}
                                    <Card.Text style={{ fontSize:"12px" }}>
                                       {customerShipingAddress.addressLine1}<br />
                                       {customerShipingAddress.addressLine2}<br />
                                       {customerShipingAddress.addressLine3}<br />
                                    </Card.Text>
                                 </Card.Body>
                              </Card>
                           </Col>
                        </Row>
                        <br />
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='paymentTerms'>
                                 <Form.Label>Payment Terms<span className="mandatory"></span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='paymentTerms'
                                    value={paymentTerms}
                                    readOnly
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={8} md={12} xs={12}>
                              <Form.Group controlId='qaRemark'>
                                 <Form.Label>QA Remarks<span className="mandatory"></span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='qaRemark'
                                    value={qaRemark}
                                    onChange={(e)=>setQARemark(e.target.value)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.qaRemark}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of row in the form to DISPLAY Delivery Note Details */}
                        <br></br>
                        <Row>
                           <Col>
                              <h5>Delivery Request Note Details Details</h5>
                           </Col>
                        </Row>
                        <p className="validation-error">{errors.drndetails}</p>
                        <Row>
                           <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                              <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed"  }}>
                                 <thead>
                                 <tr>
                                    <th className="col-3" style={{ ...tableStyle, color:"black" }}>#</th>
                                    <th className="col-4" style={{ ...tableStyle, color:"black" }}>SO#</th>
                                    <th className="col-12" style={{ ...tableStyle, color:"black" }}>JC Description</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>CPIN</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>Batch</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>Dispatch Qty</th>
                                 </tr>
                                 </thead>
                                 <tbody>
                                 </tbody>
                              </table>
                           </Col>
                        </Row>
                        {drnDetails.map((drnd, index) => (
                           <React.Fragment>
                              {index > -1?(
                                 <Row>
                                    <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                       <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" , marginTop:index===0?"0px":"-22px" }}>
                                          <tbody>
                                             <tr>
                                                <td style={tableStyle} className="col-3">
                                                   <b>{drnd.drnLineNumber}</b>
                                                </td>
                                                <td style={tableStyle} className="col-4">
                                                   {drnd.soNo !== undefined?drnd.soNo.soNumber:""}
                                                </td>
                                                <td style={tableStyle} className="col-12">
                                                   {drnd.jcNo !== undefined?drnd.jcNo.jcDescription:""}
                                                </td>
                                                <td style={tableStyle} className="col-5">
                                                   {drnd.jcNo !== undefined?drnd.jcNo.customerPartNumber:""}
                                                </td>
                                                <td style={tableStyle} className="col-5">
                                                   {format(new Date(drnd.batchDate!== undefined?drnd.batchDate:null), 'dd-MMM-yyyy')}
                                                </td>
                                                <td style={tableStyle} className="col-5">
                                                   {drnd.dispatchQty!== undefined?drnd.dispatchQty:0}
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </Col>
                                 </Row>
                              
                           ):(null)}
                            <br></br>  
                           </React.Fragment>
                        ))}
                        <br></br>
                        {/* START of LAST row in the form */}
                        <Row>
                           <Col lg={12} md={12} xs={12} style={{textAlign:"end"}}>
                              <Button 
                                 type='button' 
                                 onClick={handleReject}
                                 className=' mx-2 my-3 btn-md button-class' style={{background:"red"}} >
                                 <i className="fab fa-r-project"></i> Reject DRN
                              </Button>
                              <Button 
                                 type='button' 
                                 onClick={handleApproval}
                                 className=' mx-2 my-3 btn-md button-class' style={{background:"green"}} >
                                 <i className="fas fa-thumbs-up"></i> Approve DRN
                              </Button>
                           </Col>
                        </Row>
                     </Col>
                  </Form>
               </FormFieldsContainer>
            </React.Fragment>
         )}
         <br></br>
      </FormContainer>
   )
}

export default DRNApprovalEditScreen