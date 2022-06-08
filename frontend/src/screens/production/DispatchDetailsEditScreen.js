//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { format } from 'date-fns'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { logger } from './../../util/ConsoleHelper';


import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';

import { 
   updateDispatchDetails,
    
} from './../../actions/production/dispatchDetailsActions';

import { getDeliveryNoteDetails } from '../../actions/production/deliveryNoteActions';

import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application';
import { DISPATCH_DETAILS_CREATE_RESET, DISPATCH_DETAILS_UPDATE_RESET } from '../../constants/production/dispatchDetailsConstants';

const DispatchDetailsEditScreen = ({ history, location, match }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   //const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo, error: errorUser, loading: loadingUser } = userLogin

   const deliveryNoteId = match.params.id;

   const deliveryNoteDetails = useSelector((state) => state.deliveryNoteDetails)
   const { loading, deliveryNote, error } = deliveryNoteDetails;

   // 2. Define All Form Variables and their state
   const [ customer, setCustomer ] = useState("");
   const [ salesInvoiceId, setSalesInvoiceId ] = useState("");
   const [ salesInvoiceNumber, setSalesInvoiceNumber ] = useState("");
   const [ customerId, setCustomerId ] = useState("");
   const [ invoiceValue, setInvoiceValue ] = useState("");
   const [ invoiceDate, setInvoiceDate ] = useState();
   const [ transporter, setTransporter ] = useState("none");
   const [ modeOfTransport, setModeOfTransport ] = useState("none");
   const [ freightCharges, setFreightCharges ] = useState(0.00);
   const [ freightPercent, setFreightPercent ] = useState(0.00);
   const [ freightType, setFreightType ] = useState("none");
   const [ deliveryType, setDeliveryType ] = useState("none");
   const [ docketNumber, setDocketNumber ] = useState("");
   const [ docketDate, setDocketDate ] = useState();
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   //disable button on click
   const [executing, setExecuting] = useState(false);

   //post updated Dispatch Details record
   const dispatchDetailsUpdate = useSelector((state) => state.dispatchDetailsUpdate);
   const { success: successUpdate, error: errorUpdate } = dispatchDetailsUpdate
   logger("dispatchDetailsUpdate ==== ", dispatchDetailsUpdate)
   // 3. Define all handler functions to change the state of FORM variables
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   useEffect(() => {
      logger(">>>>>>>>---- USE EFFECT Triggerd <<<<<--------- ", successUpdate)
      if (deliveryNote._id !== deliveryNoteId) {
         dispatch(getDeliveryNoteDetails(deliveryNoteId))
      } else {
         setFormData();
      }
      if(successUpdate) {
         history.push('/dispatchdetailslist');
         dispatch({ type: DISPATCH_DETAILS_UPDATE_RESET })
         NotificationManager.success(`Dispatch Details has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: DISPATCH_DETAILS_UPDATE_RESET })
         NotificationManager.error(`Error in updating Dispatch Details !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [deliveryNoteId, deliveryNote, history, successUpdate]);

   const setFormData = () => {
      setCustomerId(deliveryNote.customer._id)
      setCustomer(deliveryNote.customer.custName)
      setSalesInvoiceId(deliveryNote.salesInvoiceNumber._id)
      setSalesInvoiceNumber(deliveryNote.salesInvoiceNumber.salesInvoiceNumber)
      setInvoiceValue(deliveryNote.invoiceValue)
      setInvoiceDate(deliveryNote.salesInvoiceNumber.salesInvoiceDate)
      setTransporter(deliveryNote.transporter)

      setModeOfTransport(deliveryNote.modeOfTransport)
      setFreightCharges(deliveryNote.freightCharges)
      setFreightPercent(deliveryNote.freightPercent)
      setFreightType(deliveryNote.freightType)
      setDeliveryType(deliveryNote.deliveryType)
      setDocketNumber(deliveryNote.docketNumber)
      setDocketDate(deliveryNote.docketDate!==undefined?new Date(deliveryNote.docketDate):null)
   }

   // 4. Validate the "FORM" before submit
   const findFormErrors = () => {
      const newErrors = {};
      if ( salesInvoiceId.trim().length === 0 ) {
         newErrors.salesInvoiceId = 'Select an Invocie #!'
      }
      if ( transporter === "none" ) {
         newErrors.transporter = 'Select a Transporter #!'
      }
      if ( modeOfTransport === "none" ) {
         newErrors.modeOfTransport = 'Select a Transporter #!'
      }
      if ( freightCharges <= 0 ) {
         newErrors.freightCharges = 'Enter Freight Charges!'
      }
      if ( freightType === "none" ) {
         newErrors.freightType = 'Select a Freight Type #!'
      }
      if ( deliveryType === "none" ) {
         newErrors.deliveryType = 'Select a Delivery Type #!'
      }
      return newErrors;
   }

   const handleFreightPercent = (freightCharges) => {
      let fp = ((freightCharges*100)/invoiceValue).toFixed(2);
      setFreightPercent(fp);
   }

   // 5.2 Submit The Form
   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();
      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
         NotificationManager.error(`Please fill in all mandatory fields !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      } 
      else {
         logger("All validations passed and Sales Invoice ID ===", salesInvoiceId)
         setExecuting(true);
         dispatch(
            updateDispatchDetails({
               _id: deliveryNote._id,
               invoiceValue,
               transporter,
               modeOfTransport,
               freightCharges,
               freightType,
               deliveryType,
               docketNumber,
               docketDate
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
            listPage = "dispatchdetailslist"
         />
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error || errorUpdate }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col>
                     <h3>Dispatch Details Entry</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Enter Dispatch Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='salesInvoiceNumber'>
                                 <Form.Label>Invoice #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    readOnly
                                    type='text'
                                    name='salesInvoiceNumber'
                                    value={salesInvoiceNumber}
                                    onChange={(e) => setSalesInvoiceNumber(e.target.value)}
                                 />
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='invoiceDate'>
                              <Form.Label>Invoice Date<span className="mandatory">*</span></Form.Label>
                              <DatePicker
                                 readOnly
                                 className="form-control"
                                 value={invoiceDate}
                                 onChange={(date) => setInvoiceDate(date)} 
                                 maxDate={new Date()}
                              />
                              <p className="validation-error">{errors.invoiceDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='invoiceValue'>
                              <Form.Label>Invoice Value<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 readOnly
                                 className="numberInputStyle"
                                 type='number'
                                 name='invoiceValue'
                                 value={invoiceValue}
                                 onChange={(e) => setInvoiceValue(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId={'transporter'}>
                                 <Form.Label>Select Transporter<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name={'transporter'}
                                    placeholder='Select Transporter'
                                    value={transporter}
                                    onChange={(e) => setTransporter(e.target.value)}
                                 >
                                    <option value="none">Select Transporter</option>
                                    <option value="Avinash Cargo Pvt Ltd">Avinash Cargo Pvt Ltd</option>
                                    <option value="GATI">GATI</option>
                                    <option value="PAI Transporter">PAI Transporter</option>
                                    <option value="Maruti Courier">Maruti Courier</option>
                                    <option value="Self">Self</option>
                                 </Form.Control>
                                 <p className="validation-error">{errors.transporter}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId={'modeOfTransport'}>
                                 <Form.Label>Mode of Transport<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name={'modeOfTransport'}
                                    placeholder='Select Transporter'
                                    value={modeOfTransport}
                                    onChange={(e) => setModeOfTransport(e.target.value)}
                                 >
                                    <option value="none">Select</option>
                                    <option value="Road">Road</option>
                                    <option value="Air">Air</option>
                                    <option value="Others">Others</option>
                                 </Form.Control>
                                 <p className="validation-error">{errors.modeOfTransport}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='freightCharges'>
                              <Form.Label>Freight Charges (₹)<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 className="numberInputStyle"
                                 type='number'
                                 name='freightCharges'
                                 value={freightCharges}
                                 onChange={(e) => setFreightCharges(e.target.value)}
                                 onBlur={(e) => handleFreightPercent(e.target.value)}
                              />
                              <p className="validation-error">{errors.freightCharges}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId={'freightType'}>
                                 <Form.Label>Freight<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name={'freightType'}
                                    placeholder='Select Freight'
                                    value={freightType}
                                    onChange={(e) => setFreightType(e.target.value)}
                                 >
                                    <option value="none">Select</option>
                                    <option value="To Pay">To Pay</option>
                                    <option value="Prepaid">Prepaid</option>
                                 </Form.Control>
                                 <p className="validation-error">{errors.freightType}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId={'deliveryType'}>
                                 <Form.Label>Delivery Type<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name={'deliveryType'}
                                    placeholder='Select Transporter'
                                    value={deliveryType}
                                    onChange={(e) => setDeliveryType(e.target.value)}
                                 >
                                    <option value="none">Select</option>
                                    <option value="Door Delivery">Door Delivery</option>
                                    <option value="Godown">Godown</option>
                                 </Form.Control>
                                 <p className="validation-error">{errors.deliveryType}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='docketNumber'>
                              <Form.Label>Docket/LR #<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='docketNumber'
                                 value={docketNumber}
                                 onChange={(e) => setDocketNumber(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='docketDate'>
                              <Form.Label>Docket/LR Date<span className="mandatory"></span></Form.Label>
                              <DatePicker
                                 dateFormat="dd-MMM-yyyy" 
                                 className="form-control"
                                 selected={docketDate} 
                                 onChange={(date) => setDocketDate(date)} 
                                 maxDate={new Date()}
                              />
                              <p className="validation-error">{errors.docketDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='freightPercent'>
                              <Form.Label>Freight %<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='freightPercent'
                                 value={freightPercent}
                                 onChange={(e) => setFreightPercent(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of LAST row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button 
                                 type='submit'
                                 disabled={executing} 
                                 className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
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

export default DispatchDetailsEditScreen
