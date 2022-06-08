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
import { getCustomerJCs } from './../../actions/masters/jcMasterActions';

const CreditNoteCreateScreen = ({ history, location }) => {
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

   //check to get Customer specific JCs
   const allCustomerJCList = useSelector((state) => state.allCustomerJCList)

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

   /** GST Calculation */
   let sellerStateCode = 27;
   let buyerStateCode = "";
  

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
   //GST Details
   const [ gstRate, setGSTRate ] = useState(0);
   const [ igstRate, setIGSTRate ] = useState(0);
   const [ cgstRate, setCGSTRate ] = useState(0);
   const [ sgstRate, setSGSTRate ] = useState(0);
   const [ ugstRate, setUGSTRate ] = useState(0);
   const [ supplierAndBuyerStateCodeMatching, setSupplierAndBuyerStateCodeMatching ] = useState(false);
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

   //JC Details
   const [ jcId, setjcId ] = useState("");
   const [ jcNo, setjcNo ] = useState("");
   const [ jcDescription, setJCDescription ] = useState("");
   const [ cpin, setcpin ] = useState("");
   const [ unitRate, setUnitRate ] = useState(0);
   const [ selectedJCNo, setSelectedJCNo ] = useState([{}]);
   const [ selectedJCDescription, setSelectedJCDescription ] = useState([{}]);

   //Credit Note Details
   const [ returnedQty, setReturnedQty ] = useState(0);
   const [ returnedValue, setReturnedValue ] = useState(0);
   const [ debitNoteRef, setDebitNoteRef ] = useState("");
   const [ taxInvoiceRef, setTaxInvoiceRef ] = useState("");

   const [ creditNoteDetails, setCreditNoteDetails ] = useState([{
      id: uuidv4(),
      creditNoteLineNumber: '',
      jcId: '',
      jcNo: '',
      jcDescription: '',
      returnedQty: 0,
      unitRate: 0,
      creditLineValue: 0,
      debitNoteRef: '',
      taxInvoiceRef: '',
      gstRate: 0,
      igstRate: 0,
      cgstRate: 0,
      sgstRate: 0,
      ugstRate: 0,
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
   //disable button on click
   const [executing, setExecuting] = useState(false);

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

   //Customer specific JCs
   let customerSpecificJCs = [];

   if(allCustomerJCList !== undefined) {
      customerSpecificJCs = allCustomerJCList.customerJCs;
      //logger("*********** Nadi naale na jao sham paiya padooooooooooooo >>>>>>>>>>> ", customerSpecificJCs);
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
      setjcId("");
      setcpin("");
      setUnitRate(0);
      //setLineValue(0);
      setSelectedJCNo([{}]);
      setSelectedJCDescription([{}]);
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
         console.log("naam[0].custGST >>>>>>>>>> ", naam[0].custGST)
         buyerStateCode = parseInt(naam[0].custGST.substring(0,2))
         if(buyerStateCode === sellerStateCode) {
            setSupplierAndBuyerStateCodeMatching(true);
         } 

         //dispatch(getCustomerJCs(naam[0]._id))
         setBillState((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillState);
         setBillPinCode((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillPinCode);
         setShipState((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipState);
         setShipPinCode((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipPinCode);

         let suppAdd = {};
         let suppAddTemp = [];
         suppAdd.addressLine1 = "Unit No. G1/A, Shree Rajlaxmi Hi-Tech Park";
         suppAdd.addressLine2 = "Mumbai - Nashik Highway, Sonale, Bhiwandi";
         suppAdd.addressLine3 = "Thane - 421302";
         suppAddTemp.push(suppAdd)
         setSupplierAddress(suppAddTemp);

         let custBillAdd = {}
         let custBillAddArray = []
         custBillAdd.addressLine1 = (naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillAddressLine1
         custBillAdd.addressLine2 = (naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillAddressLine2
         custBillAdd.addressLine3 = (naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillAddressLine3
         custBillAddArray.push(custBillAdd)
         setCustomerBillingAddress(custBillAddArray);

         let custShipAdd = {}
         let custShipAddArray = []
         custShipAdd.addressLine1 = (naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipAddressLine1
         custShipAdd.addressLine2 = (naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipAddressLine2
         custShipAdd.addressLine3 = (naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipAddressLine3
         custShipAddArray.push(custShipAdd)
         setCustomerShipingAddress(custShipAddArray);

         setCustomerBillingAddressLine1((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillAddressLine1);
         setCustomerBillingAddressLine2((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillAddressLine2);
         setCustomerBillingAddressLine3((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillAddressLine3);
         
         setCustomerShipingAddressLine1((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipAddressLine1);
         setCustomerShipingAddressLine2((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipAddressLine2);
         setCustomerShipingAddressLine3((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipAddressLine3);

         resetErrorMessage("customer")
         
         console.log("Seleced Customer Details are ", naam[0])
         dispatch(getCustomerJCs(naam[0]._id))
         //dispatch(listAllSalesInvoicesForCustomer(naam[0]._id))
         //setOpenSOCount(customerSalesInvoices!==undefined?customerSalesInvoices.length:0)
         setSalesInvoiceDetails([{}]);
         setCreditNoteDetails([{}]);
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

   const handleReset = (e) => {
      e.currentTarget.blur()
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
         setExecuting(true);
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

   const handleReturnedValue = (value) => {
      console.log(">>>>>>>>>>>>>> handleReturnedValue value <<<<<<<<<< ", value)
      console.log(">>>>>>>>>>>>>> handleReturnedValue unitRate <<<<<<<<<< ", unitRate)
      setReturnedValue(parseFloat(value)*unitRate)
   }

   const handleCreditNoteDetails = (event) => {
      event.currentTarget.blur();
      console.log(">>>>>>>>>> supplierAndBuyerStateCodeMatching >>>>>>>>> ", supplierAndBuyerStateCodeMatching)
      let creditLineAmt = parseFloat(returnedQty)*parseFloat(unitRate);
      let gstAmount = 0;
      let igstAmount = 0;
      let cgstAmount = 0;
      let sgstAmount = 0;
      let ugstAmount = 0;
      gstAmount = creditLineAmt*(gstRate/100)
      if(supplierAndBuyerStateCodeMatching) {
         cgstAmount = creditLineAmt*(cgstRate/100)
         sgstAmount = creditLineAmt*(sgstRate/100)
      } else {
         igstAmount = creditLineAmt*(igstRate/100)
      }
      let srs = { 
         id: uuidv4(),  
         lineNumber: '1', 
         jcId: jcId,
         jcNo: jcNo,
         jcDescription: jcDescription,
         cpin: cpin,
         unitRate: unitRate,
         returnedQty: parseFloat(returnedQty),
         creditLineValue: creditLineAmt,
         debitNoteRef: debitNoteRef,
         taxInvoiceRef: taxInvoiceRef,
         gstRate: gstRate,
         igstRate: igstRate,
         cgstRate: cgstRate,
         sgstRate: sgstRate,
         ugstRate: ugstRate,
         gstAmt: gstAmount,
         igstAmt: igstAmount,
         cgstAmt: cgstAmount,
         sgstAmt: sgstAmount,
         ugstAmt: ugstAmount,
         creditLineReason: ''
      }

      setCreditNoteDetails([...creditNoteDetails, srs]);

      setjcId("");
      setjcNo("");
      setJCDescription("");
      setcpin("");
      setDebitNoteRef("");
      setTaxInvoiceRef("");
      setUnitRate(0);
      setReturnedQty(0);
      setReturnedValue(0);
      setGSTRate(0);
      setIGSTRate(0);
      setCGSTRate(0);
      setSGSTRate(0);
      setUGSTRate(0);
      setSelectedJCDescription([{}]);
      setSelectedJCNo([{}]);

      //const values  = [...srs];
      handleTaxFields([...creditNoteDetails, srs])
   }

   const handleJCSelection = (event) => {
      if(event.label != undefined) {
         let srs = [...customerSpecificJCs];
         let naam = srs.filter(pc=>{
            //return pc._id.trim() === event.target.value.trim();
            return pc._id.trim() === event.value;
         })
         if(naam !== undefined && naam[0] !== undefined && naam[0].jcCustomerDetails[0] !== undefined) {
            console.log("******* selected JC is *************")
            console.log(naam[0])
            let dropDownJCDescEle = { label: naam[0].jcDescription, value: event.value };
            let dropDownJCNoEle = { label: naam[0].jcno, value: event.value };
            setSelectedJCDescription(dropDownJCDescEle);
            setSelectedJCNo(dropDownJCNoEle);
            setjcId(event.value);
            setJCDescription(naam[0].jcDescription)
            setcpin(naam[0].customerPartNumber);
            setGSTRate(naam[0].hsnDetails.gstRate)
            setIGSTRate(naam[0].hsnDetails.igstRate)
            setCGSTRate(naam[0].hsnDetails.cgstRate)
            setSGSTRate(naam[0].hsnDetails.sgstRate)
            setUGSTRate(naam[0].hsnDetails.ugstRate)
            setjcNo(naam[0].jcno);
            for (const cust of naam[0].jcCustomerDetails) {
               if(cust.customerId === customer) {
                 // i.cpin= cust.customerPartNumber;
                 setUnitRate(cust.customerPrice);
               }
            }
            
            resetErrorMessage("jcNo")
         } else {
            setjcId("");
            setcpin("");
            setUnitRate(0);
         }
      }
   }

   const handleRemoveFields = id => {
      //console.log("1. Before Removing the item IGST is >>>>>>>>> ", creditNoteTotalIGSTAmount)
      const values  = [...creditNoteDetails];
      values.splice(values.findIndex(value => value.id === id), 1);
      setCreditNoteDetails(values);
      handleTaxFields(values)
      
   }

   const handleTaxFields = (values) => {
      let creditAmt = 0;
      let cgstTempAmt = 0;
      let sgstTempAmt = 0;
      let igstTempAmt = 0;
      let ugstTempAmt = 0;
      let totalTaxTempAmt = 0;
      const newInputFields = values.map(i => {
         console.log("remove field and Input field is >>>>>>>>>>> ", i)
         if(i.id) {
            creditAmt += parseFloat(i.creditLineValue === null?"0":i.creditLineValue)
            cgstTempAmt += parseFloat(i.cgstAmt)
            sgstTempAmt += i.sgstAmt
            igstTempAmt += i.igstAmt
            ugstTempAmt += i.ugstAmt
            ugstTempAmt += i.ugstAmt
   
            totalTaxTempAmt += parseFloat(i.cgstAmt) + parseFloat(i.sgstAmt) + parseFloat(i.igstAmt) + parseFloat(i.ugstAmt)
         }
      })
      console.log("2. AFTER Removing the item IGST is >>>>>>>>> ", igstTempAmt)
      console.log("3. AFTER Removing the item totalTaxTempAmt+creditAmt is >>>>>>>>> ", (totalTaxTempAmt+creditAmt))
      console.log("4. AFTER Removing the item creditAmt is >>>>>>>>> ", (creditAmt))
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
                        <Row className="my-2">
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
                        <div style={{border:"1px solid red", borderRadius:"7px"}} className="my-2">
                           <Row className="mx-1 my-2">
                              <Col>
                                 <h5>Customer JC Details</h5>
                              </Col>
                           </Row>
                           <Row className="my-2 mx-2">
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
                                 <Form.Group controlId='unitRate'>
                                    <Form.Label>Unit Rate(₹)<span className="mandatory">*</span></Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={Number(unitRate).toFixed(2)}
                                       name="unitRate"
                                       readOnly
                                    ></Form.Control>
                                    <p className="validation-error">{errors.unitRate}</p>
                                 </Form.Group>
                              </Col>
                              
                           </Row>
                           <Row className="my-2 mx-2">
                              <Col lg={3} md={12} xs={12}>
                                 <Form.Group controlId='returnedQty'>
                                    <Form.Label>Returned Qty<span className="mandatory">*</span></Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={returnedQty}
                                       name="returnedQty"
                                       onChange={(e) => setReturnedQty(e.target.value)}
                                       onBlur={(e) => handleReturnedValue(e.target.value)}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.returnedQty}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={3} md={12} xs={12}>
                                 <Form.Group controlId='returnedValue'>
                                    <Form.Label>Returned Value<span className="mandatory">*</span></Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={returnedValue}
                                       name="returnedValue"
                                       readOnly
                                       onChange={(e) => setReturnedValue(e.target.value)}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.returnedQty}</p>
                                 </Form.Group>
                              </Col> 
                              <Col lg={3} md={12} xs={12}>
                                 <Form.Group controlId='debitNoteRef'>
                                    <Form.Label>Debit Note Reference<span className="mandatory"></span></Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={debitNoteRef}
                                       name="debitNoteRef"
                                       onChange={(e) => setDebitNoteRef(e.target.value)}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.debitNoteRef}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={3} md={12} xs={12}>
                                 <Form.Group controlId='taxInvoiceRef'>
                                    <Form.Label>Tax Invoice Reference<span className="mandatory"></span></Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={taxInvoiceRef}
                                       name="taxInvoiceRef"
                                       onChange={(e) => setTaxInvoiceRef(e.target.value)}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.taxInvoiceRef}</p>
                                 </Form.Group>
                              </Col>
                           </Row>
                           <Row className="mx-2 my-0">
                              <Col lg={12} md={12} xs={12} style={{textAlign:"end", marginTop:"0px"}}>
                                 <Button 
                                    className='my-2 btn-sm ' 
                                    onClick={(event)=>handleCreditNoteDetails(event)}
                                    disabled = {returnedValue === 0}
                                 >
                                    (+) Add
                                 </Button>
                              </Col>
                           </Row>
                        </div>
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
                        {creditNoteDetails.map((cnd, index) => (
                           <React.Fragment key={index}>
                              {index > 0?(
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
                                                         disabled={creditNoteDetails.length === 1} 
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
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={(e)=>handleReset(e)}><i className="fas fa-undo"></i> Reset</Button>
                              <Button 
                                 type='submit'
                                 disabled={executing || creditNoteDetails.length === 1} 
                                 className=' my-3 btn-md button-class' 
                                 onClick={(e) => e.currentTarget.blur()}><i className="fas fa-save"></i> Save</Button>
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

export default CreditNoteCreateScreen
