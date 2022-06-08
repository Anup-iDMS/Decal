//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
// import Select from 'react-select'
import { format, parse } from 'date-fns'
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// React Notification
import { NotificationManager } from 'react-notifications';

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
import { logger } from './../../util/ConsoleHelper';


const DRNEditScreen = ({ match, history }) => {

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const drnId = match.params.id;
   const userAction = match.params.action;
   let cta = "";
   let cts = "";
   if(userAction === "approve") {
      cts = "none"
   } else if(userAction === "save") {
      cta = "none"
   }

   const drnData = useSelector((state) => state.drnDetails)

   const { loading, drn, error } = drnData;
   //Customer specific JCs
   let customerOpenSalesOrders = [];
   let customers = [];
   let options = [];
   let supplierAddressOptions = [];
   let supplierSelectedAddressOption = {};
   //let billingSelectedAddressOption = {};
   //let shipingSelectedAddressOption = {};

   let paymentOptionsList = [
      { id: 0, name:"Within 30 Days" },
      { id: 1, name:"Within 45 Days" },
      { id: 2, name:"Within 60 Days" },
      { id: 3, name:"100% Advance" }
   ]

   let paymentOptions = []
   
   //4. Define All Form Variables and their state
   const [ drnNumber, setDRNNo ] = useState("");
   const [ dRNStatus, setDRNStatus ] = useState("");
   const [ drnDate, setDRNDate] = useState(new Date());
   const [ customer, setCustomer ] = useState("");
   const [ customerId, setCustomerId ] = useState("");
   const [ openSOCount, setOpenSOCount ] = useState(0);
   const [ billState, setBillState ] = useState("");
   const [ billPinCode, setBillPinCode ] = useState("");
   const [ shipState, setShipState ] = useState("");
   const [ shipPinCode, setShipPinCode ] = useState("");
   const [ drnTotalAmount, setDRNTotalAmount ] = useState(0);
   const [ batchId, setBatchId ] = useState("");
   //const [ batchId, setBatchId ] = useState([{}]);
   //supplier address
   const [ supplierAddressIndex, setSupplierAddressIndex ] = useState(0);
   const [ supplierAddress, setSupplierAddress ] = useState([{}]);
   const [ supplierSelectedAddress, setSupplierSelectedAddress ] = useState([{}]);
   //customer bill to address
   const [ customerBillingAddressIndex, setCustomerBillingAddressIndex ] = useState(0);
   const [ customerBillingAddress, setCustomerBillingAddress ] = useState([{}]);
   const [ customerBillingSelectedAddress, setCustomerBillingSelectedAddress ] = useState([{}]);
   //customer ship to address
   const [ customerShipingAddressIndex, setCustomerShipingAddressIndex ] = useState(0);
   const [ customerShipingAddress, setCustomerShipingAddress ] = useState([{}]);
   const [ customerShipingSelectedAddress, setCustomerShipingSelectedAddress ] = useState([{}]);
   //customer ship to/bill to address options
   const [customerBillingAddressOptions, setCustomerBillingAddressOptions] = useState([]);
   const [customerShipingAddressOptions, setCustomerShipingAddressOptions] = useState([]);

   //payment option
   const [ paymentTerms, setPaymentTerms ] = useState("Within 30 Days"); 
   const [ selectedPaymentOption, setSelectedPaymentOption] = useState([{ label: "Within 30 Days", value: 1 }]);

   //const [ supplierSelectedAddressOption, setSupplierSelectedAddressOption ] = useState([{}]);

   const [ dispObj, setDispObj ] = useState({name:'', value:0});

   //empty object array to store 
   const [drnDetails, setDRNDetails] = useState([{}]);
   const [deletedDRNDetails, setDeletedDRNDetails] = useState([{}]);

   // 4.1 Validation Errors
   const [ errors, setErrors, drns ] = useState({});

   //post updated JC record
   const drnUpdate = useSelector((state) => state.drnUpdate);
   const { success: successUpdate, error: errorUpdate } = drnUpdate

   //disable button on click
   const [executing, setExecuting] = useState(false);

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
         history.push('/drnlist');
         dispatch({ type: DRN_UPDATE_RESET })
         NotificationManager.success(`DRN # ${drn.drnNumber} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         NotificationManager.error(`Error in updating DRN # ${drn.drnNumber} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [drnId, drn, successUpdate]);

   if(userInfo !== undefined) {
      const addresses = userInfo.companyAddress
      if(addresses !== undefined) {
         addresses.map((address, index) => {
            let fullAddress = `${address.addressLine1}, ${address.addressLine2}, ${address.addressLine3}`
            let dropDownEle = { label: fullAddress, value: index };
            //setSupplierSelectedAddressOption(dropDownEle);
            if(index === supplierAddressIndex) {
               supplierSelectedAddressOption = dropDownEle;
            }
            return supplierAddressOptions.push(dropDownEle);
         });
      }
   }

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
      setBillState(drn.billState);
      setBillPinCode(drn.billPinCode);
      setShipState(drn.shipState);
      setShipPinCode(drn.shipPinCode);
      setDRNTotalAmount(drn.drnTotalAmount);
      setSupplierAddressIndex(drn.supplierAddressIndex)
      setSupplierAddress(drn.supplierAddress[0])
      setCustomerBillingAddress(drn.customerBillingAddress[0])
      setCustomerShipingAddress(drn.customerShipingAddress[0])
      setSupplierSelectedAddress(drn.supplierAddress)
      setDRNDetails(drn.drnDetails);
      let customerBillingAddressOptions1 = []
      //let customerShipingAddressOptions1 = []
      if(drn.customer !== undefined) {
         const addresses = drn.customer.customerAddress
         if(addresses !== undefined) {
            addresses.map((address, index) => {
               let fullAddress = `${address.addressLine1} ${address.addressLine2} ${address.addressLine3}`
               let dropDownEle = { label: fullAddress, value: index };
               if(index === customerBillingAddressIndex) {
                  //billingSelectedAddressOption = ;
                  setCustomerBillingSelectedAddress(dropDownEle)
               }
               if(index === customerShipingAddressIndex) {
                  setCustomerShipingSelectedAddress(dropDownEle);
               }
               return customerBillingAddressOptions1.push(dropDownEle);
            });
         }
      }
      setCustomerBillingAddressOptions(customerBillingAddressOptions1)
      setCustomerShipingAddressOptions(customerBillingAddressOptions1)
      
      setPaymentTerms(drn.paymentTerms)

      let srs = [...paymentOptionsList];
      let naam = srs.filter((po,index) =>{
         if(po.name === drn.paymentTerms) {
            console.log("match drn.paymentTerms ============== ", drn.paymentTerms)
            let dropDownEle = { label: po.name, value: index };
            setSelectedPaymentOption(dropDownEle);
         }
      })
     
   }

   paymentOptionsList.map(po => {
      let dropDownEle = { label: po.name, value: po.id };
      return paymentOptions.push(dropDownEle);
   })

   const handlePaymentTermsChanges = (e) => {
      let srs = [...paymentOptionsList];
      let naam = srs.filter(po=>{
         return po.id === e.value;
      })
      let dropDownPTEle = { label: naam[0].name, value: e.value };
      console.log("dropDownPTEle ", dropDownPTEle)
      console.log("naam[0].name ", naam[0].name)
      console.log("value ", e.value)
      setSelectedPaymentOption(dropDownPTEle);
		setPaymentTerms(naam[0].name);
   }

   const handleBillingAddress = (e) => {
      console.log("handleBillingAddress--->e.value ", e.value)
      setCustomerBillingAddressIndex(e.value)
	   const addresses = drn.customer.customerAddress
      let sdk = addresses[e.value]
      console.log("handleBillingAddress--->adddress ", sdk)
      setCustomerBillingAddress(sdk)
      const srs = [...customerBillingAddressOptions]
      let naam = srs[e.value]
      console.log("handleBillingAddress--->naam ", naam)
      setCustomerBillingSelectedAddress(naam);
      resetErrorMessage("customerBillingAddress")
   }

   const handleShipingAddress = (e) => {
      setCustomerShipingAddressIndex(e.value)
      const addresses = drn.customer.customerAddress
      let sdk = addresses[e.value]
      setCustomerShipingAddress(sdk)
      const srs = [...customerShipingAddressOptions]
      let naam = srs[e.value]
      setCustomerShipingSelectedAddress(naam);
      resetErrorMessage("customerShipingAddress")
   }

   const handleSupplierAddress = (e) => {
      setSupplierAddressIndex(e.value)
      setSupplierAddress(userInfo.companyAddress[e.value])
      resetErrorMessage("supplierAddress")
   }

   const findFormErrors = () => {
      const newErrors = {};
      if(drnDetails.length === 0) {
         newErrors.drndetails = 'Please add Dispatch Request Note Details !'
      }
      if ( paymentTerms.trim().length === 0 ) {
         newErrors.customerShipingAddress = 'Select Payment Terms!'
      }
      return newErrors;
   }

   const handleRemoveFields = id => {
      const values  = [...drnDetails];
      setDeletedDRNDetails([...deletedDRNDetails, values[id]])
      values.splice(id,1);
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
            paymentTerms,
            billState,
            billPinCode,
            shipState,
            shipPinCode,
            drnDetails,
            supplierAddress,
            supplierAddressIndex,
            customerBillingAddressIndex,
            customerBillingAddress,
            customerShipingAddressIndex,
            customerShipingAddress,
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
            drnStatus: "P",
            drnDate,
            customerId,
            paymentTerms,
            billState,
            billPinCode,
            shipState,
            shipPinCode,
            drnDetails,
            supplierAddress,
            supplierAddressIndex,
            customerBillingAddressIndex,
            customerBillingAddress,
            customerShipingAddressIndex,
            customerShipingAddress,
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
         console.log("customerBillingAddressIndex before saving ======== ", customerBillingAddressIndex)
         console.log("customer Billing Address before saving ======== ", customerBillingAddress)
         setExecuting(true);
         dispatch(
            updateDRN({
               _id: drnId,
               drnNumber,
               drnDate,
               customer,
               paymentTerms,
               supplierAddressIndex,
               supplierAddress,
               customerBillingAddressIndex,
               customerBillingAddress,
               customerShipingAddressIndex,
               customerShipingAddress,
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

   const handleChangeInput = (index, event) => {
      const values  = [...drnDetails];
      let originalQty = values[index].originalDispatchQty;
      let diffQty = originalQty - parseFloat(event.target.value)
      values[index].originalDispatchQty = originalQty
      values[index].differenceQty = diffQty 
      values[index].dispatchQty = event.target.value
      setDRNDetails(values);
   }

   const handleChangeInputQty = (index, event) => {
      const values  = [...drnDetails];
      if(values[index].originalDispatchQty === undefined) {
         let originalQty = values[index].dispatchQty;
         values[index].originalDispatchQty = originalQty
      } 
      setDRNDetails(values);
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
            listPage = "drnlist"
         />
         <br></br>
         <StepperComponent activeStep= {1} />
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col>
                     <h4>Dispatch Request Note Details</h4>
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
                           <Col lg={12} md={12} xs={12}>
                              <Form.Group controlId='supplierAddress'>
                                 <Form.Label>Select Supplier Address<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={supplierAddressOptions}
                                    onChange={(e) => handleSupplierAddress(e)}
                                    value={supplierSelectedAddressOption}
                                    isDisabled={userAction.trim()==="approve"}
                                 />
                                 <p className="validation-error">{errors.supplierAddress}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={6} md={12} xs={12}>
                              <Form.Group controlId='customerBillingAddress'>
                                 <Form.Label>Select Bill To Address<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={customerBillingAddressOptions}
                                    onChange={(e) => handleBillingAddress(e)}
                                    value={customerBillingSelectedAddress}
                                    isDisabled={userAction.trim()==="approve"}
                                 />
                                 <p className="validation-error">{errors.customerBillingAddress}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={6} md={12} xs={12}>
                              <Form.Group controlId='customerShipingAddress'>
                                 <Form.Label>Select Ship To Address<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={customerShipingAddressOptions}
                                    onChange={(e) => handleShipingAddress(e)}
                                    value={customerShipingSelectedAddress}
                                    isDisabled={userAction.trim()==="approve"}
                                 />
                                 <p className="validation-error">{errors.customerShipingAddress}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={6} md={12} xs={12}>
                              <Form.Group controlId='paymentTerms'>
                                 <Form.Label>Select Payment Terms<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    isDisabled={userAction.trim()==="approve"}
                                    style={{background:"#e84347", color:"white"}} 
                                    options={paymentOptions}
                                    value={selectedPaymentOption}
                                    name="jcId"
                                    onChange={(e) => handlePaymentTermsChanges(e)}
                                 />
                                 <p className="validation-error">{errors.paymentTerms}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of row in the form to DISPLAY Delivery Note Details */}
                        <br></br>
                        <Row>
                           <Col>
                              <h5>Dispatch Request Note Details</h5>
                           </Col>
                        </Row>
                        <p className="validation-error">{errors.drndetails}</p>
                        <hr></hr>
                        <Row>
                           <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                              <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" }}>
                                 <thead>
                                 <tr>
                                    <th className="col-3" style={{ ...tableStyle, color:"black" }}>#</th>
                                    <th className="col-4" style={{ ...tableStyle, color:"black" }}>SO#</th>
                                    <th className="col-10" style={{ ...tableStyle, color:"black" }}>JC Description</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>CPIN</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>Batch</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>Batch Qty</th>
                                    <th className="col-5" style={{ ...tableStyle, color:"black" }}>Dispatch Qty</th>
                                    <th className="col-4" style={{ ...tableStyle, color:"black" }}></th>
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
                                 <React.Fragment>
                                    <Row>
                                       <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                          <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed", marginTop:index===0?"0px":"-22px" }}>
                                             <tbody>
                                                <tr>
                                                   <td style={tableStyle} className="col-3">
                                                      <b>{drnd.drnLineNumber}</b>
                                                   </td>
                                                   <td style={tableStyle} className="col-4">
                                                      {drnd.soNo !== undefined?drnd.soNo.soNumber:""}
                                                   </td>
                                                   <td style={tableStyle} className="col-10">
                                                      {drnd.jcNo !== undefined?drnd.jcNo.jcDescription:""}
                                                   </td>
                                                   <td style={tableStyle} className="col-5">
                                                      {drnd.jcNo !== undefined?drnd.jcNo.customerPartNumber:""}
                                                   </td>
                                                   <td style={tableStyle} className="col-5">
                                                      {format(new Date(drnd.batchDate!== undefined?drnd.batchDate:null), 'dd-MMM-yyyy')}
                                                   </td>
                                                   <td style={tableStyle} className="col-5">
                                                      {drnd.dispatchQty!== undefined?drnd.batchId.batchQuantity:0}
                                                   </td>
                                                   <td style={tableStyle} className="col-5">
                                                      <Form.Group controlId='dispatchQty' style={{paddingTop:"10px"}}>
                                                         <Form.Control
                                                            type='text'
                                                            placeholder=''
                                                            value={drnd.dispatchQty!== undefined?drnd.dispatchQty:0}
                                                            name="dispatchQty"
                                                            onChange={(event) => handleChangeInput(index, event)}
                                                            onFocus={(event) => handleChangeInputQty(index, event)}
                                                         ></Form.Control>
                                                         <p className="validation-error">{errors.dispatchQty}</p>
                                                      </Form.Group>
                                                      {/*drnd.dispatchQty!== undefined?drnd.dispatchQty:0*/}
                                                   </td>
                                                   <td style={tableStyle} className="col-4">
                                                      <Button
                                                         variant="danger" 
                                                         className="btn-sm"
                                                         disabled={drnDetails.length === 1} 
                                                         onClick={() => handleRemoveFields(index)}
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
                        <br></br>
                        {/* START of LAST row in the form */}
                        <Row style={{ display: (userAction.trim()==="save" ? 'none' : 'block') }} >
                           <Col lg={12} md={12} xs={12} style={{textAlign:"end"}}>
                              <Button 
                                 disabled={drn.drnStatus !== "O"}
                                 type='button' 
                                 onClick={handleReject}
                                 className=' mx-2 my-3 btn-md button-class' style={{background:"red"}} >
                                 <i className="fab fa-r-project"></i> Reject DRN
                              </Button>
                              <Button 
                                 disabled={drn.drnStatus !== "O"}
                                 type='button' 
                                 onClick={handleApproval}
                                 className=' mx-2 my-3 btn-md button-class' style={{background:"green"}} >
                                 <i className="fas fa-thumbs-up"></i> Send For Approval
                              </Button>
                           </Col>
                        </Row>
                        <Row style={{ display: (userAction.trim()==="approve" ? 'none' : 'block') }} >
                           <Col lg={12} md={12} xs={12} style={{textAlign:"end"}}>
                              <Button 
                                 disabled={drn.drnStatus !== "O"}
                                 type='reset' 
                                 onClick={(e) => e.currentTarget.blur()}
                                 onClick={handleReset}
                                 className=' reset-button-class mx-2 my-3 btn-md'  >
                                 <i className="fas fa-undo fa-1x"></i> Reset
                              </Button>
                              <Button 
                                 disabled={drn.drnStatus !== "O" || drnDetails.length === 0 || executing}
                                 type='submit' 
                                 onClick={(e) => e.currentTarget.blur()}
                                 className=' mx-2 my-3 btn-md button-class'  >
                                 <i className="fas fa-save fa-1x"></i> Save
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

export default DRNEditScreen
