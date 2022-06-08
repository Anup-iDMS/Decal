//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { format } from 'date-fns'
import { Card } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NotificationManager } from 'react-notifications';

//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';
//import DRN Redux "action(s)"
import { createCreditNote, getAllMasterDataForCreditNote } from '../../actions/sales/creditNoteActions';

//import Redux "constantc(s)"
import { CREDIT_NOTE_CREATE_RESET } from '../../constants/sales/creditNoteConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import { listAllSalesInvoicesForCustomer } from '../../actions/sales/salesInvoiceActions';
import Loader from '../../components/app/Loader';
import Message from '../../components/app/Message';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';

const CreditNoteCreateScreen1 = ({ history, location }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   //2. Get the master data required for DRN generation
   
   const creditNoteCreate = useSelector((state) => state.creditNoteCreate)

   const { success, creditNote, error: errorCreate } = creditNoteCreate

   const masterDataForCreditNote = useSelector((state) => state.masterDataForCreditNote)

   const { loading: loadingMasterData, error } = masterDataForCreditNote;

   //check to get Customer specific Sales Invoices
   const asil = useSelector((state) => state.allSalesInvoiceListForCustomer)
   const { loading: loadingSalesInvoice, salesInvoices } = asil;

   //9. Trigger useEffect hook to get all the form details
   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
       } else {
         dispatch(getAllMasterDataForCreditNote())
       }
		if (success) {
         history.push('/creditnotelist')
		   dispatch({ type: CREDIT_NOTE_CREATE_RESET })
         NotificationManager.success(`Credit Note # ${creditNote.creditNoteNumber} has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: CREDIT_NOTE_CREATE_RESET })
         NotificationManager.error(`Error in creating Credit Note !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      
		// eslint-disable-next-line
	}, [history, success])

   //Customer specific JCs
   let customerSalesInvoices = [];
   let customers = [];
   let options = [];
   let salesInvoiceOptions = [];
   let autoIncrementedCreditNo = "";

   //4. Define All Form Variables and their state
   const [ creditNoteNumber, setCreditNoteNumber ] = useState(autoIncrementedCreditNo);
   const [ creditNoteDate, setCreditNoteDate] = useState(new Date());
   const [ customer, setCustomer ] = useState("");
   const [ customerId, setCustomerId ] = useState("");
   const [ billState, setBillState ] = useState("");
   const [ billPinCode, setBillPinCode ] = useState("");
   const [ shipState, setShipState ] = useState("");
   const [ shipPinCode, setShipPinCode ] = useState("");
   const [ salesInvoiceId, setSalesInvoiceId ] = useState("");
   const [ salesInvoiceNumber, setSalesInvoiceNumber ] = useState("");
   const [ salesInvoiceDate, setSalesInvoiceDate ] = useState("");
   const [ salesInvoiceAmount, setSalesInvoiceAmount ] = useState(0);
   const [ creditNoteAmount, setCreditNoteAmount ] = useState(0);
   const [ creditNoteReason, setCreditNoteReason ] = useState("");
   //empty object array to store 
   const [ salesInvoiceDetails, setSalesInvoiceDetails ] = useState([{}]);
   //addresses
   const [ supplierAddress, setSupplierAddress ] = useState([{}]);
   const [ customerBillingAddress, setCustomerBillingAddress ] = useState([{}]);
   const [ customerShipingAddress, setCustomerShipingAddress ] = useState([{}]);
   //tax numbers
   const [ creditNoteTotalAmount, setCreditNoteTotalAmount ] = useState(0);
   const [ creditNoteTotalCGSTAmount, setCreditNoteTotalCGSTAmount ] = useState(0);
   const [ creditNoteTotalSGSTAmount, setCreditNoteTotalSGSTAmount ] = useState(0);
   const [ creditNoteTotalIGSTAmount, setCreditNoteTotalIGSTAmount ] = useState(0);
   const [ creditNoteTotalUGSTAmount, setCreditNoteTotalUGSTAmount ] = useState(0);
   const [ creditNoteTotalTaxAmount, setCreditNoteTotalTaxAmount ] = useState(0);
   const [ creditNoteTotalAmountWithTax, setCreditNoteTotalAmountWithTax ] = useState(0);

   /** set customerBilling address */
   const [ customerBillingAddressLine1, setCustomerBillingAddressLine1 ] = useState("");
   const [ customerBillingAddressLine2, setCustomerBillingAddressLine2 ] = useState("");
   const [ customerBillingAddressLine3, setCustomerBillingAddressLine3 ] = useState("");
   const [ billingAddressState, setBillingAddressState ] = useState("");
   const [ billingAddressCity, setBillingAddressCity] = useState("");
   const [ billingAddressDistrict, setBillingAddressDistrict ] = useState("");
   const [ billingAddressPinCode, setBillingAddressPinCode ] = useState("");

   /** set customerShiping address */
   const [ customerShipingAddressLine1, setCustomerShipingAddressLine1 ] = useState("");
   const [ customerShipingAddressLine2, setCustomerShipingAddressLine2 ] = useState("");
   const [ customerShipingAddressLine3, setCustomerShipingAddressLine3 ] = useState("");
   const [ shipingAddressState, setShipingAddressState ] = useState("");
   const [ shipingAddressCity, setShipingAddressCity] = useState("");
   const [ shipingAddressDistrict, setShipingAddressDistrict ] = useState("");
   const [ shipingAddressPinCode, setShipingAddressPinCode ] = useState("");

   
   const [ creditNoteDetails, setCreditNoteDetails ] = useState([{
      id: uuidv4(),
      creditNoteLineNumber: '',
      salesInvoiceLineNumber: '',
      batchId: '',
      batchDate:'',
      jcNo: '',
      jcDescription: '',
      dispatchQty: 0,
      invoicedQty: 0,
      returnedQty: 0,
      salesInvoiceUnitRate: 0,
      salesInvoiceLineValue: 0,
      creditLineValue: 0,
      igstAmt: 0,
      igstPercent: 0,
      cgstAmt: 0,
      cgstPercent: 0,
      sgstAmt: 0,
      sgstPercent: 0,
      ugstAmt: 0,
      ugstPercent: 0,
      creditLineReason: ''
   }]);

   // 4.1 Validation Errors
   const [ errors, setErrors, salesOrders ] = useState({});

   //3. Set Master Data on The Screen
   if(masterDataForCreditNote !== undefined) {
      customers = masterDataForCreditNote.customers
      //logger("customers are ", masterDataForCreditNote)
      autoIncrementedCreditNo = masterDataForCreditNote.autoIncrementedCreditNo
      if(customers !== undefined) {
         customers.map(customer => {
            let dropDownEle = { label: customer.custName, value: customer._id };
            return options.push(dropDownEle);
         });
      }
      //setDRNNo(autoIncrementedCreditNo);
   }

   if(asil !== undefined) {
      //
      customerSalesInvoices = asil.salesInvoices;
      if(customerSalesInvoices !== undefined) {
         customerSalesInvoices.map(si => {
            let dropDownEle = { label: si.salesInvoiceNumber, value: si._id };
            return salesInvoiceOptions.push(dropDownEle);
         });
      }
      
      //setOpenSOCount(customerOpenSalesOrders.length)
   }

   //5. Different Form Variable State handlers
   const handleCustomerName = (e) => {
      if(e.value.trim() === "") {
         //setCustomer("")
         setSalesInvoiceDetails([{}]);
         setCreditNoteDetails([{}]);
      } else {
         setSalesInvoiceId("")
         setCustomer(e.value);
         let srs = [...customers];
         let naam = srs.filter(cust=>{
            return cust._id.trim() === e.value.trim();
         })
         //dispatch(getCustomerJCs(naam[0]._id))
         setBillState((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillState);
         setBillPinCode((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillPinCode);
         setShipState((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipState);
         setShipPinCode((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipPinCode);

         setCustomerBillingAddressLine1((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillAddressLine1);
         setCustomerBillingAddressLine2((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillAddressLine2);
         setCustomerBillingAddressLine3((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillAddressLine3);
         
         setCustomerShipingAddressLine1((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipAddressLine1);
         setCustomerShipingAddressLine2((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipAddressLine2);
         setCustomerShipingAddressLine3((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipAddressLine3);

         resetErrorMessage("customer")
         
         //logger("Seleced Customer Details are ", naam[0])
         dispatch(listAllSalesInvoicesForCustomer(naam[0]._id))
         //setOpenSOCount(customerSalesInvoices!==undefined?customerSalesInvoices.length:0)
         setSalesInvoiceDetails([{}]);
         setCreditNoteDetails([{}]);
      }
   }

   const handleSalesInvoice = (e) => {
      if(e.value.trim() === "") {
         setSalesInvoiceId("")
         setSalesInvoiceDetails([{}]);
         setCreditNoteDetails([{}]);
      } else {
         setSalesInvoiceId(e.value);
         let srs = [...customerSalesInvoices];
         let naam = srs.filter(si=>{
            return si._id.trim() === e.value.trim();
         })
         //dispatch(getCustomerJCs(naam[0]._id))
         setSalesInvoiceDate((naam === undefined || naam[0] === undefined)? "":format(new Date(naam[0].salesInvoiceDate), 'dd-MMM-yyyy'));

         //setSalesInvoiceDate((naam === undefined || naam[0] === undefined)? "":new Date(naam[0].salesInvoiceDate));
         setSalesInvoiceAmount((naam === undefined || naam[0] === undefined)? "":naam[0].salesInvoiceTotalAmount);
         setSupplierAddress((naam === undefined || naam[0] === undefined)? "":naam[0].supplierAddress[0]);
         setCustomerBillingAddress((naam === undefined || naam[0] === undefined)? "":naam[0].customerBillingAddress[0]);
         setCustomerShipingAddress((naam === undefined || naam[0] === undefined)? "":naam[0].customerShipingAddress[0]);
         
         setCreditNoteTotalAmount((naam === undefined || naam[0] === undefined)? 0:naam[0].salesInvoiceTotalAmount);

         setCreditNoteTotalCGSTAmount((naam === undefined || naam[0] === undefined)? 0:naam[0].salesInvoiceTotalCGSTAmount);
         setCreditNoteTotalSGSTAmount((naam === undefined || naam[0] === undefined)? 0:naam[0].salesInvoiceTotalSGSTAmount);
         setCreditNoteTotalIGSTAmount((naam === undefined || naam[0] === undefined)? 0:naam[0].salesInvoiceTotalIGSTAmount);
         setCreditNoteTotalUGSTAmount((naam === undefined || naam[0] === undefined)? 0:naam[0].salesInvoiceTotalUGSTAmount);
         setCreditNoteTotalTaxAmount((naam === undefined || naam[0] === undefined)? 0:naam[0].salesInvoiceTotalTaxAmount);
         setCreditNoteTotalAmountWithTax((naam === undefined || naam[0] === undefined)? 0:naam[0].salesInvoiceTotalAmountWithTax);

         resetErrorMessage("salesInvoiceId")
         //setOpenSOCount(customerSalesInvoices!==undefined?customerSalesInvoices.length:0)
         setSalesInvoiceDetails(naam[0].salesInvoiceDetails);
         if(naam[0].salesInvoiceDetails !== undefined) {
            let creditNoteDetails = []
            let counter = 1;
            let creditAmt = 0;
            for (const sid of naam[0].salesInvoiceDetails) {
               let srs = {};
               srs.id = uuidv4();
               srs.creditNoteLineNumber = counter;
               srs.salesInvoiceLineNumber = sid.salesInvoiceLineNumber;
               srs.batchId = sid.batchId;
               srs.batchDate = sid.batchDate;
               srs.jcNo = sid.jcNo._id;
               srs.jcDescription = sid.jcNo.jcDescription;
               srs.dispatchQty = sid.dispatchQty;
               srs.invoicedQty = sid.invoicedQty;
               srs.returnedQty = sid.invoicedQty;//0;
               srs.salesInvoiceUnitRate = sid.salesInvoiceUnitRate;
               srs.salesInvoiceLineValue = sid.salesInvoiceLineValue;
               creditAmt += sid.salesInvoiceLineValue;
               srs.creditLineValue = sid.salesInvoiceLineValue;
               srs.igstAmt = sid.igstAmt;
               srs.igstPercent = (100*sid.igstAmt)/sid.salesInvoiceLineValue;
               srs.cgstAmt = sid.cgstAmt;
               srs.cgstPercent = (100*sid.cgstAmt)/sid.salesInvoiceLineValue;
               srs.sgstAmt = sid.sgstAmt;
               srs.sgstPercent = (100*sid.sgstAmt)/sid.salesInvoiceLineValue;
               srs.ugstAmt = sid.ugstAmt;
               srs.ugstPercent = (100*sid.ugstAmt)/sid.salesInvoiceLineValue;
               srs.creditLineReason = '';
               
               creditNoteDetails.push(srs);
               counter++;
               //console.log("-------------priniting sales invocie line details ------ ", sid)
            }
            //console.log("Credit INvocie Details ", creditNoteDetails);
            setCreditNoteDetails(creditNoteDetails);
            setCreditNoteAmount(creditAmt)
         }
      }
   }

   // 3. Define all handler functions to change the state of FORM variables
   const resetErrorMessage = (name) => {
   if ( !!errors[name] ) setErrors({
      ...errors,
      [name]: null
      })
   }

   //6. Form Validation
   const findFormErrors = () => {
      const newErrors = {};
      
      if ( customer.trim().length === 0 ) {
         newErrors.customer = 'Select a Customer!'
      }
      if ( salesInvoiceId.trim().length === 0 ) {
         newErrors.salesInvoiceId = 'Select a Sales Invoice !'
      }
      if ( creditNoteAmount <= 0 ) {
         newErrors.creditNoteAmount = 'Enter Credit Amount !'
      }
      if ( creditNoteReason.trim().length === 0 ) {
         newErrors.creditNoteReason = 'Enter Credit Note Reason !'
      }
      return newErrors;
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
         //console.log("------------- before submit and creditNoteDetails ==== ", creditNoteDetails)
         dispatch(
            createCreditNote({
               creditNoteNumber: autoIncrementedCreditNo,
               creditNoteDate,
               salesInvoiceNumber: salesInvoiceId,
               customer,
               billState,
               billPinCode,
               shipState,
               shipPinCode,
               creditNoteAmount,
               creditNoteReason,
               supplierAddress,
               customerBillingAddress,
               customerShipingAddress,
               creditNoteTotalAmount,
               creditNoteTotalCGSTAmount,
               creditNoteTotalSGSTAmount,
               creditNoteTotalIGSTAmount,
               creditNoteTotalUGSTAmount,
               creditNoteTotalTaxAmount,
               creditNoteTotalAmountWithTax,
               creditNoteDetails
            })
         )
       }
   }

   const handleChangeInput = (id, event) => {
      const newInputFields = creditNoteDetails.map(i => {
         if(id === i.id) {
            i[event.target.name] = event.target.value
            
            if(event.target.name === "returnedQty") {
               i.creditLineValue = (parseFloat(event.target.value === ""?"0":event.target.value) * parseFloat(i.salesInvoiceUnitRate)).toFixed(2);
               //console .log("!@#$%^&*() Line Order Qty = ", event.target.value)
               //resetErrorMessage("orderedQty")
            }
         }
         
         return i;
      })
      let creditAmt = 0;
      const newInputFields1 = newInputFields.map(i => {
         creditAmt += parseFloat(i.creditLineValue === null?"0":i.creditLineValue)
      })
      setCreditNoteAmount(creditAmt);

      setCreditNoteTotalAmount(creditAmt);

      setCreditNoteDetails(newInputFields);
   }

   const handleRemoveFields = id => {
      //console.log("1. Before Removing the item IGST is >>>>>>>>> ", creditNoteTotalIGSTAmount)
      const values  = [...creditNoteDetails];
      values.splice(values.findIndex(value => value.id === id), 1);
      setCreditNoteDetails(values);

      let creditAmt = 0;
      let cgstTempAmt = 0;
      let sgstTempAmt = 0;
      let igstTempAmt = 0;
      let ugstTempAmt = 0;
      let totalTaxTempAmt = 0;
      const newInputFields = values.map(i => {
         creditAmt += parseFloat(i.creditLineValue === null?"0":i.creditLineValue)
         cgstTempAmt += parseFloat(i.cgstAmt)
         sgstTempAmt += parseFloat(i.sgstAmt)
         igstTempAmt += parseFloat(i.igstAmt)
         ugstTempAmt += parseFloat(i.ugstAmt)
         ugstTempAmt += parseFloat(i.ugstAmt)

         totalTaxTempAmt += parseFloat(i.cgstAmt) + parseFloat(i.sgstAmt) + parseFloat(i.igstAmt) + parseFloat(i.ugstAmt)
      })
      //console.log("2. AFTER Removing the item IGST is >>>>>>>>> ", igstTempAmt)
      //console.log("3. AFTER Removing the item totalTaxTempAmt+creditAmt is >>>>>>>>> ", (totalTaxTempAmt+creditAmt))
      //console.log("4. AFTER Removing the item creditAmt is >>>>>>>>> ", (creditAmt))
      setCreditNoteTotalCGSTAmount(cgstTempAmt)
      setCreditNoteTotalSGSTAmount(sgstTempAmt)
      setCreditNoteTotalIGSTAmount(igstTempAmt)
      setCreditNoteTotalUGSTAmount(ugstTempAmt)
      setCreditNoteTotalTaxAmount(totalTaxTempAmt)
      setCreditNoteAmount(creditAmt);
      setCreditNoteTotalAmountWithTax(totalTaxTempAmt+creditAmt);
      
      setCreditNoteTotalAmount(creditAmt);
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
         {loadingMasterData ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col>
                     <h3>Credit Note Entry</h3>
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
                                    value={autoIncrementedCreditNo}
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
                                    selected={creditNoteDate} 
                                    onChange={(date) => setCreditNoteDate(date)} 
                                 />
                                 <p className="validation-error">{errors.creditNoteDate}</p>
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
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='salesInvoiceId'>
                                 <Form.Label>Select Invoice<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={salesInvoiceOptions}
                                    onChange={(e) => handleSalesInvoice(e)}
                                 />
                                 <p className="validation-error">{errors.salesInvoiceId}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId={'salesInvoiceDate'}>
                                 <Form.Label>Invoice Date</Form.Label>
                                 <DatePicker
                                    readOnly
                                    className="form-control"
                                    value={salesInvoiceDate}
                                    onChange={(date) => setSalesInvoiceDate(date)} 
                                    maxDate={new Date()}
                                 />
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='salesInvoiceAmount'>
                                 <Form.Label>Invoice Amount<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='salesInvoiceAmount'
                                    readOnly
                                    value={Number(salesInvoiceAmount).toFixed(2)}
                                    onChange={(e) => setSalesInvoiceAmount(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row style={{ display: (salesInvoiceId.trim().length === 0 ? 'none' : '') }}>
                           <Col lg={4} md={12} xs={12}>
                              <Card>
                                 <Card.Header style={{ fontWeight:"bold" }}>Supplier Address</Card.Header>
                                 <Card.Body>
                                    <Card.Text style={{ fontSize:"11px" }}>
                                       {supplierAddress===undefined?"Unit No. G1/A, Shree Rajlaxmi Hi-Tech Park":supplierAddress.addressLine1}<br />
                                       {supplierAddress===undefined?"Mumbai - Nashik Highway, Sonale, Bhiwandi":supplierAddress.addressLine2}<br />
                                       {supplierAddress===undefined?"Thane - 421302":supplierAddress.addressLine3}<br />
                                    </Card.Text>
                                 </Card.Body>
                              </Card>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Card>
                                 <Card.Header style={{ fontWeight:"bold" }}>Billing Address</Card.Header>
                                 <Card.Body>
                                    <Card.Text style={{ fontSize:"11px" }}>
                                       {customerBillingAddress===undefined?customerBillingAddressLine1:customerBillingAddress.addressLine1}<br />
                                       {customerBillingAddress===undefined?customerBillingAddressLine2:customerBillingAddress.addressLine2}<br />
                                       {customerBillingAddress===undefined?customerBillingAddressLine3:customerBillingAddress.addressLine3}<br />
                                    </Card.Text>
                                 </Card.Body>
                              </Card>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Card>
                                 <Card.Header style={{ fontWeight:"bold" }}>Shipping Address</Card.Header>
                                 <Card.Body>
                                    {/*<Card.Title>Special title treatment</Card.Title>*/}
                                    <Card.Text style={{ fontSize:"11px" }}>
                                       {customerShipingAddress===undefined?customerShipingAddressLine1:customerShipingAddress.addressLine1}<br />
                                       {customerShipingAddress===undefined?customerShipingAddressLine2:customerShipingAddress.addressLine2}<br />
                                       {customerShipingAddress===undefined?customerShipingAddressLine3:customerShipingAddress.addressLine3}<br />
                                    </Card.Text>
                                 </Card.Body>
                              </Card>
                           </Col>
                        </Row>
                        <br />
                        <Row style={{ display: (salesInvoiceId.trim().length === 0 ? 'none' : '') }}>
                           <Col>
                              <h5>Invoice Details</h5>
                           </Col>
                        </Row>
                        <Row style={{ display: (salesInvoiceId.trim().length === 0 ? 'none' : '') }}>
                           <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                              <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" }}>
                                 <thead>
                                    <tr>
                                       <th className="col-2" style={{ ...tableStyle, color:"black" }}>#</th>
                                       <th className="col-8" style={{ ...tableStyle, color:"black" }}>JC Description</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Batch Date</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Invoiced Qty</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Unit Rate</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Line Value</th>
                                       <th className="col-5" style={{ ...tableStyle, color:"black" }}>Returned Qty</th>
                                       <th className="col-3" style={{ ...tableStyle, color:"black" }}></th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                 </tbody>
                              </table>
                           </Col>
                        </Row>
                        {creditNoteDetails.map((sid, index) => (
                           <React.Fragment key={index}>
                              {index > -1?(
                                 <React.Fragment>
                                    <Row style={{ display: (salesInvoiceId.trim().length === 0 ? 'none' : '') }}>
                                       <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                          <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed", marginTop:index===0?"0px":"-22px" }}>
                                             <tbody>
                                                <tr>
                                                   <td  className="col-2" style={tableStyle} colSpan={1}>
                                                      <b>{index+1}</b>
                                                   </td>
                                                   <td  className="col-8" style={tableStyle} colSpan={1}>
                                                      <b>{sid.jcDescription}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{format(new Date(sid.batchDate!==''&& sid.batchDate!==undefined?sid.batchDate:null), 'dd-MMM-yyyy')}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{sid.invoicedQty}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{sid.salesInvoiceUnitRate}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <b>{sid.salesInvoiceLineValue}</b>
                                                   </td>
                                                   <td  className="col-5" style={tableStyle} colSpan={1}>
                                                      <Form.Group controlId='returnedQty'>
                                                         <Form.Control
                                                            type='Number'
                                                            placeholder=''
                                                            value={sid.returnedQty}
                                                            name="returnedQty"
                                                            onChange={event => handleChangeInput(sid.id, event)}
                                                         ></Form.Control>
                                                         <p className="validation-error">{errors.returnedQty}</p>
                                                      </Form.Group>
                                                   </td>
                                                   <td style={tableStyle} className="col-3">
                                                      <Button
                                                         variant="danger" 
                                                         className="btn-sm"
                                                         style={{marginTop:"10px"}}
                                                         disabled={creditNoteDetails.length === 1} 
                                                         onClick={() => handleRemoveFields(sid.id)}
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
                        <Row>
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

export default CreditNoteCreateScreen1
