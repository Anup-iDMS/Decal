//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { format } from 'date-fns'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NotificationManager } from 'react-notifications';

//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';
//import DRN Redux "action(s)"
import { updateCreditNote, getCreditNoteDetails } from '../../actions/sales/creditNoteActions';

//import Redux "constantc(s)"
import { CREDIT_NOTE_UPDATE_RESET } from '../../constants/sales/creditNoteConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import Loader from '../../components/app/Loader';
import Message from '../../components/app/Message';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';

const CreditNoteEditScreen = ({ history, location, match }) => {
   // 1. Get all the master data and dependent data required to create a form
   const creditNoteId = match.params.id;
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const creditNoteDetails = useSelector((state) => state.creditNoteDetails)
   const { loading, creditNote, error } = creditNoteDetails;
   
   const creditNoteUpdate = useSelector((state) => state.creditNoteUpdate)

   const { success: successUpdate, error: errorUpdate } = creditNoteUpdate

   useEffect(() => {
      //logger(">>>>>>>>---- USE EFFECT Triggerd <<<<<---------")
      if (creditNote._id !== creditNoteId) {
         //console .log("2. Edit Sales Order Screen and Inside useEffect. Before getting SO Details ==== ")
         dispatch(getCreditNoteDetails(creditNoteId))
      } else {
         //format(new Date(value), 'dd-MMM-yyyy')
         setFormData();
      }
      if(successUpdate) {
         history.push('/creditnotelist');
         dispatch({ type: CREDIT_NOTE_UPDATE_RESET })
         NotificationManager.success(`Credit Note has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: CREDIT_NOTE_UPDATE_RESET })
         NotificationManager.error(`Error in updating Credit Note !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [creditNoteId, creditNote, history]);

   //4. Define All Form Variables and their state
   const [ creditNoteNumber, setCreditNoteNumber ] = useState("");
   const [ creditNoteDate, setCreditNoteDate] = useState(new Date());
   const [ customer, setCustomer ] = useState("");
   const [ customerId, setCustomerId ] = useState("");
   const [ billState, setBillState ] = useState("");
   const [ billPinCode, setBillPinCode ] = useState("");
   const [ shipState, setShipState ] = useState("");
   const [ shipPinCode, setShipPinCode ] = useState("");
   //const [ salesInvoiceId, setSalesInvoiceId ] = useState("");
   //const [ salesInvoiceNumber, setSalesInvoiceNumber ] = useState("");
   //const [ salesInvoiceDate, setSalesInvoiceDate ] = useState("");
   //const [ salesInvoiceAmount, setSalesInvoiceAmount ] = useState(0);
   const [ creditNoteAmount, setCreditNoteAmount ] = useState(0);
   const [ creditNoteReason, setCreditNoteReason ] = useState("");
   //empty object array to store 
   //const [ salesInvoiceDetails, setSalesInvoiceDetails ] = useState([{}]);

   const [ cnDetails, setCNDetails ] = useState([{}]);
   // 4.1 Validation Errors
   const [ errors, setErrors, salesOrders ] = useState({});

   const setFormData = () => {
      setCreditNoteNumber(creditNote.creditNoteNumber)
      // setCreditNoteDate(creditNote.creditNoteDate)
      setCreditNoteDate(format(new Date(creditNote.creditNoteDate), 'dd-MMM-yyyy'));
      setBillState(creditNote.billState)
      setBillPinCode(creditNote.billPinCode)
      setShipState(creditNote.shipState)
      setShipPinCode(creditNote.shipPinCode)
      setCreditNoteAmount(creditNote.creditNoteTotalAmount)
      setCreditNoteReason(creditNote.creditNoteReason)

      setCNDetails(creditNote.creditNoteDetails);
      
      setCustomerId(creditNote.customer._id)

      setCustomer(creditNote.customer.custName)
      //setSalesInvoiceId(creditNote.salesInvoiceNumber._id)
      //setSalesInvoiceNumber(creditNote.salesInvoiceNumber.salesInvoiceNumber)
      //setSalesInvoiceAmount(creditNote.salesInvoiceNumber.salesInvoiceTotalAmount)
      //setSalesInvoiceDate(creditNote.salesInvoiceNumber.salesInvoiceDate)
      // if(creditNote.salesInvoiceNumber !== undefined) {
      //    if(creditNote.salesInvoiceNumber.salesInvoiceDate !== undefined) {
      //       setSalesInvoiceDate(format(new Date(creditNote.salesInvoiceNumber.salesInvoiceDate), 'dd-MMM-yyyy'));
      //    }
      // }
   }

   //6. Form Validation
   const findFormErrors = () => {
      const newErrors = {};
      
      if ( customer.trim().length === 0 ) {
         newErrors.customer = 'Select a Customer!'
      }
      // if ( salesInvoiceId.trim().length === 0 ) {
      //    newErrors.salesInvoiceId = 'Select a Sales Invoice !'
      // }
      if ( creditNoteAmount <= 0 ) {
         newErrors.creditNoteAmount = 'Enter Credit Amount !'
      }
      if ( creditNoteReason.trim().length === 0 ) {
         newErrors.creditNoteReason = 'Enter Credit Note Reason !'
      }
      return newErrors;
   }

   // 3. Define all handler functions to change the state of FORM variables
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const handleReset = () => {
      window.location.reload();
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
            updateCreditNote({
               _id: creditNoteId,
               // creditNoteNumber,
               // creditNoteDate,
               // salesInvoiceNumber: salesInvoiceId,
               // customer,
               // billState,
               // billPinCode,
               // shipState,
               // shipPinCode,
               //creditNoteAmount,
               creditNoteReason
            })
         )
       }
   }

   const handleChangeInput = (id, event) => {

   }

   const handleRemoveFields = id => {
      //console.log("1. Before Removing the item IGST is >>>>>>>>> ", creditNoteTotalIGSTAmount)
      const values  = [...creditNoteDetails];
      values.splice(values.findIndex(value => value.id === id), 1);
      setCNDetails(values);
      //handleTaxFields(values)
      
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
            listPage = "creditnotelist"
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
                     <h3>Credit Note Edit</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Enter Credit Note Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='creditNoteNumber'>
                              <Form.Label>Credit Note #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='creditNoteNumber'
                                    readOnly
                                    value={creditNoteNumber}
                                    onChange={(e) => setCreditNoteNumber(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='creditNoteDate'>
                                 <Form.Label>Credit Note Date<span className="mandatory">*</span></Form.Label>
                                 <DatePicker
                                    dateFormat="dd-MMM-yyyy" 
                                    className="form-control"
                                    value={creditNoteDate} 
                                    readOnly
                                    onChange={(date) => setCreditNoteDate(date)} 
                                 />
                                 <p className="validation-error">{errors.creditNoteDate}</p>
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
                                    onChange={(e) => setCustomer(e.target.value)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.customer}</p>
                              </Form.Group>
                           </Col>
                        </Row>
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
                        <br />
                        <Row style={{ display: (customer.trim().length === 0 ? 'none' : '') }}>
                           <Col>
                              <h5>Credit Note Details</h5>
                           </Col>
                        </Row>
                        <Row style={{ display: (customer.trim().length === 0 ? 'none' : '') }}>
                           <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                              <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" }}>
                                 <thead>
                                    <tr>
                                       <th className="col-2" style={{ ...tableStyle, color:"black" }}>#</th>
                                       {/*<th className="col-5" style={{ ...tableStyle, color:"black" }}>JC #</th>*/}
                                       <th className="col-8" style={{ ...tableStyle, color:"black" }}>JC Description</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Returned Qty</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Unit Rate</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Line Value</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Debit Note Ref</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Tax Invoice Ref</th>
                                       <th className="col-3" style={{ ...tableStyle, color:"black" }}></th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                 </tbody>
                              </table>
                           </Col>
                        </Row>
                        {cnDetails.map((cnd, index) => (
                           <React.Fragment key={index}>
                              {index > -1?(
                                 <React.Fragment>
                                    <Row style={{ display: (customer.trim().length === 0 ? 'none' : '') }}>
                                       <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                          <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed", marginTop:index===0?"0px":"-22px" }}>
                                             <tbody>
                                                <tr>
                                                   <td  className="col-2" style={tableStyle} colSpan={1}>
                                                      <b>{index}</b>
                                                   </td>
                                                   {/*<td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{cnd.jcNo}</b>
                                                   </td>*/}
                                                   <td  className="col-8" style={tableStyle} colSpan={1}>
                                                      <b>{cnd.jcDescription}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{cnd.returnedQty}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{cnd.unitRate}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{cnd.creditLineValue}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{cnd.debitNoteRef}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{cnd.taxInvoiceRef}</b>
                                                   </td>
                                                   <td style={tableStyle} className="col-3">
                                                      <Button
                                                         variant="danger" 
                                                         className="btn-sm"
                                                         style={{marginTop:"10px"}}
                                                         disabled={cnDetails.length > -1} 
                                                         onClick={() => handleRemoveFields(cnd.id)}
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
                        <Row style={{ display: (customer.trim().length === 0 ? 'none' : '') }} className="my-2">
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='creditNoteAmount'>
                                 <Form.Label>Credit Note Amount<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='number'
                                    name='creditNoteAmount'
                                    readOnly
                                    value={Number(creditNoteAmount).toFixed(2)}
                                    onChange={(e) => setCreditNoteAmount(e.target.value)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.creditNoteAmount}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={9} md={12} xs={12}>
                              <Form.Group controlId='creditNoteReason'>
                                 <Form.Label>Credit Note Reason<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='creditNoteReason'
                                    value={creditNoteReason}
                                    onChange={(e) => setCreditNoteReason(e.target.value)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.creditNoteReason}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of LAST row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button type='submit' className=' my-3 btn-md button-class' onClick={(e) => e.currentTarget.blur()}><i className="fas fa-save"></i> Save</Button>
                           </Col>
                        </Row>
                     </Col>
                  </Form>
               </FormFieldsContainer>
            </React.Fragment>
         )}
      </FormContainer>
   )
}

export default CreditNoteEditScreen
