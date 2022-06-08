//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
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
//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';

import { 
   updateDeliveryNote, 
   getDeliveryNoteDetails 
} from './../../actions/production/deliveryNoteActions';
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application';
import { DELIVERY_NOTE_CREATE_RESET, DELIVERY_NOTE_UPDATE_RESET } from '../../constants/production/deliveryNoteConstants';

const DeliveryNoteEditScreen = ({ history, location, match }) => {
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
   const [ stateOfSupply, setStateOfSupply ] = useState("");
   const [ invoiceDate, setInvoiceDate ] = useState();
   const [ totalBoxes, setTotalBoxes ] = useState(0);
   const [ totalBoxWeight, setTotalBoxWeight ] = useState(0);
   const [ deliveryDetails, setDeliveryDetails ] = useState([
      { 
         id: uuidv4(), 
         descriptionOfGoods:'', 
         quantity: 0, 
         batchDate: null,
         poNumber: '',
         boxNumber: ''
      },
   ]);
   //const [ salesInvoiceDetails, setSalesInvoiceDetails ] = useState([]);
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});
   //disable button on click
   const [executing, setExecuting] = useState(false);

   //post updated ASN record
   const deliveryNoteUpdate = useSelector((state) => state.deliveryNoteUpdate);
   const { success: successUpdate, error: errorUpdate } = deliveryNoteUpdate

   // 3. Define all handler functions to change the state of FORM variables
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }
   useEffect(() => {
      //logger(">>>>>>>>---- USE EFFECT Triggerd <<<<<---------")
      if (deliveryNote._id !== deliveryNoteId) {
         //console .log("2. Edit Sales Order Screen and Inside useEffect. Before getting SO Details ==== ")
         dispatch(getDeliveryNoteDetails(deliveryNoteId))
      } else {
         //format(new Date(value), 'dd-MMM-yyyy')
         setFormData();
      }
      if(successUpdate) {
         history.push('/deliverynotelist');
         dispatch({ type: DELIVERY_NOTE_UPDATE_RESET })
         NotificationManager.success(`ASN has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: DELIVERY_NOTE_UPDATE_RESET })
         NotificationManager.error(`Error in updating ASN !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [deliveryNoteId, deliveryNote, history]);

   const setFormData = () => {
      setCustomerId(deliveryNote.customer._id)
      setCustomer(deliveryNote.customer.custName)
      setSalesInvoiceId(deliveryNote.salesInvoiceNumber._id)
      setSalesInvoiceNumber(deliveryNote.salesInvoiceNumber.salesInvoiceNumber)
      setStateOfSupply(deliveryNote.salesInvoiceNumber.shipState)
      setInvoiceDate(deliveryNote.salesInvoiceNumber.salesInvoiceDate)
      setTotalBoxes(deliveryNote.totalBoxes)
      setTotalBoxWeight(deliveryNote.totalBoxWeight)
      let newDeliveryDetails = [...deliveryNote.deliveryDetails]
      let newDeliveryDetails1 = newDeliveryDetails.map(sod => {
         sod.id = uuidv4(); 
         sod.descriptionOfGoods = sod.descriptionOfGoods; 
         sod.quantity = sod.quantity; 
         sod.batchDate = sod.batchDate;
         sod.poNumber = sod.poNumber;
         sod.boxNumber = sod.boxNumber;

         return sod;
      })
      //logger("--------> before setting data <----------- ", newSODetails1)
      setDeliveryDetails(newDeliveryDetails1);
      //setDeliveryDetails(deliveryNote.deliveryDetails)
   }

   // 4. Validate the "FORM" before submit
   const findFormErrors = () => {
      const newErrors = {};
      if ( salesInvoiceId.trim().length === 0 ) {
         newErrors.salesInvoiceId = 'Select an Invocie #!'
      }
      if ( totalBoxes <= 0 ) {
         newErrors.totalBoxes = 'Enter a Total Number of Boxes!'
      }
      if ( totalBoxWeight  <= 0 ) {
         newErrors.totalBoxWeight = 'Enter a Total Box Weight!'
      }
      return newErrors;
   }

   const handleInputChange = (id, event) => {
      const newInputFields = deliveryDetails.map(i => {
         if(id === i.id) {
            //logger("Matched ID is  ", i)
            i.id = id;
            i.descriptionOfGoods = i.descriptionOfGoods;
            i.quantity = i.quantity;
            i.batchDate = i.batchDate;
            i.poNumber = i.poNumber;
            i.boxNumber = event.target.value;
            return i;
         } else {
            return i;
         }
      })
      //logger("New newInputFields are ", newInputFields)
      setDeliveryDetails(newInputFields)
   }

   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();
      //logger("1. Inside submitHandler ==== ")
      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
         NotificationManager.error(`Please fill in all mandatory fields !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      } 
      else {
         setExecuting(true);
         dispatch(
            updateDeliveryNote({
               _id: deliveryNoteId,
               salesInvoiceNumber: salesInvoiceId,
               customer: customerId,
               totalBoxes,
               totalBoxWeight,
               deliveryDetails
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
            listPage = "deliverynotelist"
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
                     <h3>ASN Edit</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Edit ASN Details !!!" >
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
                              <Form.Group controlId='customer'>
                                 <Form.Label>Customer<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    readOnly
                                    type='text'
                                    name='customer'
                                    value={customer}
                                    onChange={(e) => setCustomer(e.target.value)}
                                 />
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='stateOfSupply'>
                              <Form.Label>State of Supply<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='stateOfSupply'
                                 value={stateOfSupply}
                                 onChange={(e) => setStateOfSupply(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='batchDate'>
                              <Form.Label>Ref Invoice Date<span className="mandatory">*</span></Form.Label>
                              <DatePicker
                                 readOnly
                                 className="form-control"
                                 value={invoiceDate}
                                 onChange={(date) => setInvoiceDate(date)} 
                                 maxDate={new Date()}
                              />
                              <p className="validation-error">{errors.batchDate}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <div className="taxinvoicetable" style={{margin:"10px"}}>
                              <table style={{width:"100%", tableLayout:"fixed"}}>
                                 <thead>
                                 <tr>
                                    <th style={{ border:"1px solid black", width:"5%" }}>#</th>
                                    <th style={{ border:"1px solid black", width:"35%" }}>Description of Goods</th>
                                    <th style={{ border:"1px solid black", width:"10%" }}>Quantity</th>
                                    <th style={{ border:"1px solid black", width:"10%" }}>Batch Date</th>
                                    <th style={{ border:"1px solid black", width:"20%" }}>PO Reference</th>
                                    <th style={{ border:"1px solid black", width:"20%" }}>Box No.</th>
                                 </tr>
                                 </thead>
                                 <tbody>
                                 {deliveryDetails.length>0 ? (
                                    deliveryDetails.map((dd, index) => (
                                       <tr key={index}>
                                          <td>{index+1}</td>
                                          <td>{dd.descriptionOfGoods}</td>
                                          <td>{dd.quantity!==0?dd.quantity:""}</td>
                                          <td>{dd.batchDate!==null?(format(new Date(dd.batchDate), 'dd-MMM-yyyy')):""}</td>
                                          <td>{dd.poNumber}</td>
                                          <td>
                                             <Form.Control
                                                required
                                                type='text'
                                                name='boxNumber'
                                                value={dd.boxNumber}
                                                onChange={(e) => handleInputChange(dd.id, e)}
                                             />
                                          </td>
                                       </tr>
                                    ))
                                 ):(null)}
                                 </tbody>
                                 {/*<tfoot>
                                 <tr>
                                    <td>Sum</td>
                                    <td>$180</td>
                                 </tr>
                                 </tfoot>*/}
                              </table>
                           </div>
                        </Row>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='totalBoxes'>
                                 <Form.Label>Total No. of Boxes<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    required
                                    type='number'
                                    name='totalBoxes'
                                    value={totalBoxes}
                                    onChange={(e) => setTotalBoxes(e.target.value)}
                                 />
                                 <p className="validation-error">{errors.totalBoxes}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='totalBoxWeight'>
                                 <Form.Label>Total Gross weight(kg)<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    required
                                    type='number'
                                    name='totalBoxWeight'
                                    value={totalBoxWeight}
                                    onChange={(e) => setTotalBoxWeight(e.target.value)}
                                 />
                                 <p className="validation-error">{errors.totalBoxWeight}</p>
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

export default DeliveryNoteEditScreen
