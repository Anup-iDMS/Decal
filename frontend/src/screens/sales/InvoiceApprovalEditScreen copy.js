//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
// import Select from 'react-select'
import { format } from 'date-fns'
import NumberFormat from 'react-number-format';

import './../css/screen.css';

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
import { getDRNDetails, updateDRN } from '../../actions/production/drnActions';

import logo from './../../assets/DTPL_Logo.jpg'
import sign from './../../assets/Invoice_sign_SD.png'

import { Image } from 'react-bootstrap';
import { ToWords } from 'to-words';
import { DRN_UPDATE_RESET } from '../../constants/production/drnConstants';
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application';
import { createSalesInvoice, getAllMasterDataForSalesInvoice } from '../../actions/sales/salesInvoiceActions';
import { SALES_INVOICE_CREATE_RESET } from '../../constants/sales/salesInvoiceConstants';
import StepperComponent from './../../components/app/StepperComponent';
import { logger } from './../../util/ConsoleHelper';

const InvoiceApprovalEditScreen = ({ match, history }) => {
   const drnId = match.params.id;
   console .log("1. DRNApprovalEditScreen ---> DRN ID is ==== ", drnId)

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const drnData = useSelector((state) => state.drnDetails)

   const { loading, drn, error } = drnData;

   const masterDataForSalesInvoice = useSelector((state) => state.masterDataForSalesInvoice)

   const { loading: loadingMasterData } = masterDataForSalesInvoice;

   let autoIncrementedSINo = "";
   //post updated JC record
   const drnUpdate = useSelector((state) => state.drnUpdate);
   const { success: successUpdate, error: errorUpdate } = drnUpdate

   const salesInvoiceCreate = useSelector((state) => state.salesInvoiceCreate)

   const { success, salesInvoice, error: errorCreate } = salesInvoiceCreate


   if(masterDataForSalesInvoice !== undefined) {
      autoIncrementedSINo = masterDataForSalesInvoice.autoIncrementedSINo
      logger("1. On Invoice Approval Screena nd INvoice No. is ", autoIncrementedSINo)
   }
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

   const [ dispObj, setDispObj ] = useState({name:'', value:0});

   //empty object array to store 
   const [drnDetails, setDRNDetails] = useState([{}]);
   const [deletedDRNDetails, setDeletedDRNDetails] = useState([{}]);

   // 4.1 Validation Errors
   const [ errors, setErrors, drns ] = useState({});

   useEffect(() => {
      if (drn._id !== drnId) {
         dispatch(getDRNDetails(drnId))
         dispatch(getAllMasterDataForSalesInvoice())
      } else {
         //format(new Date(value), 'dd-MMM-yyyy')
         setFormData();
      }
      if(successUpdate) {
         history.push('/invoiceapprovallist');
         dispatch({ type: DRN_UPDATE_RESET })
         NotificationManager.success(`DRN # ${drn.drnNumber} has been successfully Rejected !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: DRN_UPDATE_RESET })
         NotificationManager.error(`Error in updating DRN # ${drn.drnNumber} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      logger(">>>>>>>>---- USE EFFECT Triggerd <<<<<---------")
      if (success) {
         history.push('/invoiceapprovallist')
		   dispatch({ type: SALES_INVOICE_CREATE_RESET })
         NotificationManager.success(`Sales Invocie # ${autoIncrementedSINo} has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         NotificationManager.error(`Error in creating Sales Invoice !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
         dispatch({ type: SALES_INVOICE_CREATE_RESET })
      }

   }, [history, success]);

   let tableArray = [];
   /** variable for GST calculations - START */
   let hsnArray = [];
   let hsnDetailsArray = [];
   let hsnDetailsArray1 = [];

   let sellerStateCode = 27;
   let buyerStateCode = "";
   let gst = 0.00;
   let igst = 0.00;
   let cgst = 0.00;
   let sgst = 0.00;

   let outputIGST = 0.00;
   let outputCGST = 0.00;
   let outputSGST = 0.00;

   let totalTaxableCGSTValue = 0;
   let totalTaxableSGSTValue = 0;
   let totalTaxableIGSTValue = 0;

   let totalInvoiceAmountWithGST = 0;
   let totalTax = 0;

   let supplierAndBuyerStateCodeMatching = false;
   /** variable for GST calculations - END */

   
   if(!loading) {
      
      if(drn!==undefined) {
         if(drn.customer !== undefined) {
            if(drn.customer.custGST !== undefined) {
               buyerStateCode = parseInt(drn.customer.custGST.substring(0,2))
            }
         }
      } 

      if(drn.drnDetails !== undefined) {
         let drnNos = drn.drnDetails.length;
         let noOfTableRows = 12-drnNos;
         console .log("2. DRNApprovalEditScreen ---> DRN details are ", drn.drnDetails[0].batchDate)
         for( let i = 0 ; i < noOfTableRows ; i++ ) {
            tableArray.push({newKey: i});
         }
         console .log("2. DRNApprovalEditScreen ---> tableArray ", tableArray)
         let n = 0;
         for (const sid of drn.drnDetails) {
            let srs = {}
            if(sid.hsnDetails !== undefined){
               if(!hsnArray.includes(sid.hsnDetails.hsnCode)) {
                  hsnArray.push(sid.hsnDetails.hsnCode)
                  hsnDetailsArray.push(sid.hsnDetails)
                  srs[(sid.hsnDetails.hsnCode).toString()] = sid.drnLineValue
                  hsnDetailsArray1.push(srs)
               } else {
                  //logger("N value is ", n)
                  logger("hsnDetailsArray is else ", hsnArray.indexOf(sid.hsnDetails.hsnCode))
                  //logger("hsnDetailsArray is else ", hsnDetailsArray1)
                  logger("hsnDetailsArray1[sid.hsnDetails.hsnCode] is else ", hsnDetailsArray1[hsnArray.indexOf(sid.hsnDetails.hsnCode)][sid.hsnDetails.hsnCode])
                  //logger("Already Added Amount is ", Number(hsnDetailsArray[n][sid.hsnDetails.hsnCode]))
                  logger("With same code and amout is ", sid.drnLineValue)
                  let amt = hsnDetailsArray1[hsnArray.indexOf(sid.hsnDetails.hsnCode)][sid.hsnDetails.hsnCode]+sid.drnLineValue
                  logger("With same code and DOUBLE amout is ", amt)
                  hsnDetailsArray1.splice(hsnArray.indexOf(sid.hsnDetails.hsnCode), 1);
                  //hsnDetailsArray1[sid.hsnDetails.hsnCode] = amt
                  srs[(sid.hsnDetails.hsnCode).toString()] = amt
                  hsnDetailsArray1.push(srs)
               }
               n++;
            }
         }
         logger("HSN Code Arrays ", hsnArray)
         logger("HSN Code Details Arrays ", hsnDetailsArray)
         logger("HSN Code Amoutn Array ", hsnDetailsArray1)
         
         if(buyerStateCode === sellerStateCode) {
            supplierAndBuyerStateCodeMatching = true;
            hsnDetailsArray.map((h, index) => {
               logger("1. HSN Code is ", h.hsnCode)
               logger("1. HSN Code cgstRate is ", h.cgstRate)
               logger("1. HSN Code sgstRate is ", h.sgstRate)
               logger("1. HSN Code igstRate is ", h.igstRate)
               logger("1. HSN Code Amount ", hsnDetailsArray1[index][h.hsnCode])
               outputCGST += (Number(hsnDetailsArray1[index][h.hsnCode]) * (h.cgstRate/100))
               outputSGST += (Number(hsnDetailsArray1[index][h.hsnCode]) * (h.sgstRate/100))
            })
            // cgst = salesInvoice.drnDetails[0].hsnDetails.cgstRate
            // sgst = salesInvoice.drnDetails[0].hsnDetails.sgstRate
            // outputCGST = (((drn.drnTotalAmount)*cgst)/100).toFixed(2)
            // outputSGST = (((drn.drnTotalAmount)*sgst)/100).toFixed(2)
         } else {
            // igst = salesInvoice.drnDetails[0].hsnDetails.igstRate
            hsnDetailsArray.map((h, index) => {
               logger("2. HSN Code is ", h.hsnCode)
               logger("2. HSN Code cgstRate is ", h.cgstRate)
               logger("2. HSN Code sgstRate is ", h.sgstRate)
               logger("2. HSN Code igstRate is ", h.igstRate)
               logger("2. HSN Code Amount ", hsnDetailsArray1[index][h.hsnCode])
               outputIGST += (Number(hsnDetailsArray1[index][h.hsnCode]) * (h.igstRate/100))
            })
            // outputIGST = (((drn.drnTotalAmount)*igst)/100).toFixed(2)
         }
         totalInvoiceAmountWithGST = (drn.drnTotalAmount+
                                       (drn.drnTotalAmount)*gst/100).toFixed(2);
         
         totalTax = ((Number(outputCGST) + Number(outputSGST) + Number(outputIGST))).toFixed(2)
      }
      
   }
	   
   const toWords = new ToWords({
      localeCode: 'en-IN',
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
      }
   });

   

   const setFormData = () => {
      setDRNNo(drn.drnNumber);
      setDRNStatus(drn.drnStatus);
      setDRNDate((new Date(drn.drnDate)));
      setCustomer(drn.customer.custName);
      setCustomerId(drn.customer._id);
      setBillState(drn.billState);
      setBillPinCode(drn.billPinCode);
      setShipState(drn.shipState);
      setShipPinCode(drn.shipPinCode);
      setDRNTotalAmount(drn.drnTotalAmount);
      setDRNDetails(drn.drnDetails);
   }

   const handleApproval = () => {
      logger("--- Inside Approve ----- ", drn.drnDetails)
      dispatch(
         createSalesInvoice({
            salesInvoiceNumber: autoIncrementedSINo,
            drnNumber: drn.drnNumber,
            drnId,
            drnDate,
            customer: drn.customer._id,
            billState: drn.billState,
            billPinCode: drn.billPinCode,
            shipState: drn.shipState,
            shipPinCode: drn.shipPinCode,
            drnDetails: drn.drnDetails 
         })
      )
   }

   const submitHandler = (e) => {
      e.preventDefault();
      
   }

   const handleReject = () => {
      logger("--- before rejecting DRN details are ----- ", drnDetails)
      dispatch(
         updateDRN({
            _id: drnId,
            drnNumber,
            drnStatus: "R",
            drnDate: drn.drnDate,
            customerId,
            billState,
            billPinCode,
            shipState,
            shipPinCode,
            drnDetails: drn.drnDetails,
            deletedDRNDetails
         })
      )
   }
   
   return (
      <FormContainer>
         <Breadcrumb
            listPage = "invoiceapprovallist"
         />
         <br></br>
         <StepperComponent activeStep= {3} />
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col lg={6} md={12} sm={12}>
                     <h4>Proforma Invoice Details</h4>
                  </Col>
                  <Col lg={6} md={12} sm={12} style={{textAlign:"right"}}>
                     <h4>DRN # {drn !==undefined? drn.drnNumber:""}</h4>
                  </Col>
               </Row>
               <br></br>
               <Row>
                  <Col lg={12} md={12} sm={12}>
                     <div className="taxinvoicetable">
                        <table>
                           <tr>
                              <td colspan="10" className="td-center-align" style={{border:"1px solid black"}}>
                                 <Image src={logo} style={{width:"25%"}} fluid />
                              </td>
                           </tr>
                           <tr style={{border:"1px solid black"}}>
                              <td 
                                 style={{backgroundColor:"lightgray", textAlign:"center"}} 
                                 colspan="10"
                              >
                                 <h3 style={{color:"black"}} >Tax Invoice</h3>
                              </td>
                           </tr>
                           <tr style={{border:"1px solid black"}}>
                              <td colspan="5">
                                 <tr><h6 style={{color:"black"}}>DECAL TECH PRIVATE LIMITED</h6></tr>
                                 <tr><p>Unit No. G1/A, Shree Rajlaxmi Hi-Tech Park</p></tr>
                                 <tr><p>Mumbai - Nashik Highway, Sonale, Bhiwandi</p></tr>
                                 <tr><p>Thane - 421302   State: Maharashtra | Code 27</p></tr>
                                 <tr><p>GSTIN: 27AAGCD4662E1ZP</p></tr>
                              </td>
                              <td colspan="5">
                                 <tr><h6 style={{color:"black"}}>Invoice Details</h6></tr>
                                 <tr><p>Invoice No.: {autoIncrementedSINo}</p></tr>
                                 <tr><p>Invoice Date: {format(new Date(), 'dd-MMM-yyyy')}</p></tr>
                                 <tr><p>Invoice Amount (₹):  
                                    {drn!==undefined?
                                       <NumberFormat
                                          thousandsGroupStyle="lakh"
                                          value = {drn.drnTotalAmount!==undefined?drn.drnTotalAmount.toFixed(2):"0.00"}
                                          decimalSeparator="."
                                          displayType="text"
                                          type="text"
                                          thousandSeparator={true}
                                          allowNegative={true} 
                                       />:"0.00"}</p></tr>
                                 <tr><p>Reverse Charge Applicable: No</p></tr>
                              </td>
                           </tr>
                           <tr>
                              <td colspan="5" style={{backgroundColor:"lightgray"}} >
                                 <h6 style={{color:"black"}}>Details of Reciever (Bill To)</h6>
                              </td>
                              <td colspan="5" style={{backgroundColor:"lightgray"}}>
                                 <h6 style={{color:"black"}}>Details of Consignee (Ship To)</h6>
                              </td>
                           </tr>
                           <tr>
                              <td colspan="5">
                                 <tr>
                                    <p><b>{drn!==undefined && drn.customer !== undefined?drn.customer.custName:""}</b></p>
                                 </tr>
                                 <tr>
                                    <p><b>{drn!==undefined && drn.customer && drn.customer.custBillingAddress !== undefined?drn.customer.custBillingAddress[0].custBillAddressLine1+" "+drn.customer.custBillingAddress[0].custBillAddressLine2:""}</b></p>
                                 </tr>
                                 <tr>
                                    <p><b>{drn!==undefined && drn.customer && drn.customer.custBillingAddress !== undefined?drn.customer.custBillingAddress[0].custBillCity+" "+drn.customer.custBillingAddress[0].custBillPinCode+ " "+drn.customer.custBillingAddress[0].custBillState:""}</b></p>
                                 </tr>
                                 <tr>
                                    <p>State Code: {(drn!==undefined && drn.customer !== undefined && drn.customer.custGST !== undefined) ?drn.customer.custGST.substring(0,2):""} <span style={{marginLeft:"15px", backgroundColor:"lightgray"}}>{drn!==undefined && drn.customer !== undefined? drn.customer.custGST:""}</span></p>
                                 </tr>
                              </td>
                              <td colspan="5">
                                 <tr>
                                    <p><b>{drn!==undefined && drn.customer !== undefined?drn.customer.custName:""}</b></p>
                                 </tr>
                                 <tr>
                                    <p><b>{drn!==undefined && drn.customer && drn.customer.custShipingAddress !== undefined?drn.customer.custShipingAddress[0].custShipAddressLine1+" "+drn.customer.custShipingAddress[0].custShipAddressLine2:""}</b></p>
                                 </tr>
                                 <tr>
                                    <p><b>{drn!==undefined && drn.customer && drn.customer.custShipingAddress !== undefined?drn.customer.custShipingAddress[0].custShipCity+" "+drn.customer.custShipingAddress[0].custShipPinCode+ " "+drn.customer.custShipingAddress[0].custShipState:""}</b></p>
                                 </tr>
                                 <tr>
                                    <p>State Code: {drn!==undefined && drn.customer !== undefined?drn.customer.custGST.substring(0,2):""} <span style={{marginLeft:"15px", backgroundColor:"lightgray"}}>{drn!==undefined && drn.customer !== undefined? drn.customer.custGST:""}</span></p>
                                 </tr>
                              </td>
                           </tr>
                           <tr id="invoiceheading">
                              <td style={{backgroundColor:"lightgray"}}><p>#</p></td>
                              <td colSpan="3" style={{backgroundColor:"lightgray"}}><p>Description of Goods/Services</p></td>
                              <td style={{backgroundColor:"lightgray"}} ><p>Batch</p></td>
                              <td style={{backgroundColor:"lightgray"}}><p>HSN/SAC</p></td>
                              <td style={{backgroundColor:"lightgray"}}><p>Quantity</p></td>
                              <td style={{backgroundColor:"lightgray"}}><p>Unit</p></td>
                              <td style={{backgroundColor:"lightgray"}} ><p>Rate (₹)</p></td>
                              <td style={{backgroundColor:"lightgray"}}><p>Amount (₹)</p></td>
                           </tr>
                           {drn!==undefined && drn.drnDetails !==undefined?(
                              drn.drnDetails.map((drd, index) => 
                                 <tr key={index}>
                                    <td className="center-align"><p>{drd.drnLineNumber}</p></td>
                                    <td colSpan="3">
                                       <p>{drd.jcNo.jcDescription}</p><br></br>
                                       <p>PO#: {drd.soNo.poNumber}</p><br></br>
                                       <p>CPIN: {drd.jcNo.customerPartNumber}</p>
                                    </td>
                                    <td><p>{format(new Date(drd.batchDate), 'dd-MMM-yyyy')}</p></td>
                                    <td><p>{drd.jcNo.hsn}</p></td>
                                    <td className="center-align"><p>{drd.dispatchQty}</p></td>
                                    <td className="center-align"><p>{drd.jcNo.unit}</p></td>
                                    <td className="center-align"><p>{drd.drnUnitRate}</p></td>
                                    <td className="center-align"><p>{drd.drnLineValue}</p></td>
                                 </tr>
                              )
                           ):(null)}
                           {tableArray.length > 0 ?(
                              tableArray.map((t, index) => 
                                 <tr key={index}>
                                    <td><p></p></td>
                                    <td colSpan="3"><p></p></td>
                                    <td><p></p></td>
                                    <td><p></p></td>
                                    <td><p></p></td>
                                    <td><p></p></td>
                                    <td><p></p></td>
                                    <td><p></p></td>
                                 </tr>
                              )
                           ):(null)}
                           <tr>
                              <td className="right-align" colSpan="1"><p></p></td>
                              <td className="right-align" colSpan="7">
                                 <p>Total Amount (₹)</p>
                              </td>
                              <td className="right-align container" colSpan="2">
                                 <p>
                                    {drn!==undefined?
                                       <NumberFormat
                                          thousandsGroupStyle="lakh"
                                          value = {
                                             drn.drnTotalAmount!==undefined?
                                                drn.drnTotalAmount.toFixed(2):"0.00"
                                          }
                                          decimalSeparator="."
                                          displayType="text"
                                          type="text"
                                          thousandSeparator={true}
                                          allowNegative={true} 
                                       />:"0.00"}
                                 </p>
                              </td>
                           </tr>
                           <tr>
                              <td className="right-align" colSpan="1"><p></p></td>
                              <td className="right-align" colSpan="7"><p>Output CGST (₹)</p></td>
                              <td className="right-align" colSpan="2"><p>{outputCGST}</p></td>
                           </tr>
                           <tr>
                              <td className="right-align" colSpan="1"><p></p></td>
                              <td className="right-align" colSpan="7"><p>Output SGST (₹)</p></td>
                              <td className="right-align" colSpan="2"><p>{outputSGST}</p></td>
                           </tr>
                           <tr>
                              <td className="right-align" colSpan="1"><p></p></td>
                              <td className="right-align" colSpan="7"><p>Output IGST (₹)</p></td>
                              <td className="right-align" colSpan="2">
                                 <p>{drn!==undefined?
                                    <NumberFormat
                                       thousandsGroupStyle="lakh"
                                       value = {supplierAndBuyerStateCodeMatching?"0.00":outputIGST}
                                       decimalSeparator="."
                                       displayType="text"
                                       type="text"
                                       thousandSeparator={true}
                                       allowNegative={true} 
                                    />:""}
                                 </p>
                              </td>
                           </tr>
                           <tr>
                              <td className="right-align" colSpan="1"><p></p></td>
                              <td className="right-align" colSpan="7"><p>Total Invoice Amount (₹)</p></td>
                              <td className="right-align" colSpan="2">
                                 <p>
                                 {drn!==undefined?
                                    <NumberFormat
                                       thousandsGroupStyle="lakh"
                                       value = {Number(totalInvoiceAmountWithGST)+Number(outputCGST)+Number(outputSGST)+Number(outputIGST)}
                                       decimalSeparator="."
                                       displayType="text"
                                       type="text"
                                       thousandSeparator={true}
                                       allowNegative={true} 
                                    />:""}
                                 </p></td>
                           </tr>
                           <tr>
                              <td className="right-align" colSpan="1"><p></p></td>
                              <td className="right-align" colSpan="4"><p>Total Tax Amount (₹) (in words):</p></td>
                              <td className="right-align" colSpan="5">
                                 <p>{toWords.convert(drn.drnTotalAmount!==undefined?(drn.drnTotalAmount+drn.drnTotalAmount*0.18).toFixed(2):0)}</p>
                              </td>
                           </tr>
                           <tr>
                              <td colSpan="10"></td>
                           </tr>
                           <tr>
                              <td 
                                 colSpan="1"  
                                 className="center-align-gray-background" 
                                 style={{backgroundColor:"lightgray"}}>
                              </td>
                              <td 
                                 colSpan="1" 
                                 className="center-align-gray-background" 
                                 style={{backgroundColor:"lightgray"}}
                              >
                                 HSN/SAC CODE
                              </td>
                              <td 
                                 colSpan="1"  
                                 className="center-align-gray-background" 
                                 style={{backgroundColor:"lightgray"}}
                              >
                                 Taxable Value (₹)
                              </td>
                              <td 
                                 colSpan="2" 
                                 className="center-align-gray-background" 
                                 style={{backgroundColor:"lightgray"}}
                              >
                                 <tr>
                                    <table style={{padding:"0px", borderRight:"0px solid blue" ,marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tr >
                                          <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} colSpan="2">CGST</td>
                                       </tr>
                                       <tr >
                                          <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} ><p>Rate (%)</p></td>
                                          <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}}><p>Amount (₹)</p></td>
                                       </tr>
                                    </table>
                                 </tr>
                              </td>
                              <td 
                                 colSpan="2" 
                                 className="center-align-gray-background" 
                                 style={{backgroundColor:"lightgray"}}
                              >
                                 <tr>
                                    <table style={{padding:"0px", borderRight:"0px solid blue" ,marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tr >
                                          <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} colSpan="2">
                                          SGST</td>
                                       </tr>
                                       <tr >
                                          <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} ><p>Rate (%)</p></td>
                                          <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}}><p>Amount (₹)</p></td>
                                       </tr>
                                    </table>
                                 </tr>
                              </td>
                              <td 
                              colSpan="2" 
                              className="center-align-gray-background" 
                              style={{backgroundColor:"lightgray"}}
                              >
                                 <tr>
                                    <table style={{padding:"0px", borderRight:"0px solid blue" ,marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tr >
                                          <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} colSpan="2">
                                          IGST</td>
                                       </tr>
                                       <tr >
                                          <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} ><p>Rate (%)</p></td>
                                          <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}}><p>Amount (₹)</p></td>
                                       </tr>
                                    </table>
                                 </tr>
                              </td>
                              <td colSpan="1" className="center-align-gray-background" style={{backgroundColor:"lightgray"}}>Total Tax Amount (₹)</td>
                           </tr>
                           {hsnDetailsArray.map((hd, index) =>
                              <tr>
                                 <td colSpan="1" className="center-align"><p></p></td>
                                 <td colSpan="1" className="center-align"><p>{hd.hsnCode}</p></td>
                                 <td colSpan="1" className="center-align">
                                    <p>
                                       {drn!==undefined?
                                       <NumberFormat
                                          thousandsGroupStyle="lakh"
                                          value = {hsnDetailsArray1[index][hd.hsnCode]}
                                          decimalSeparator="."
                                          displayType="text"
                                          type="text"
                                          thousandSeparator={true}
                                          allowNegative={true} 
                                       />:"0.00"}
                                    </p>
                                 </td>
                                 <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}><p>
                                    <tr>
                                       <table style={{marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                          <tr >
                                             <td className="center-align" style={{borderRight:"0px solid black"}} ><p>{!supplierAndBuyerStateCodeMatching?"-":hd.cgstRate}</p></td>
                                             <td className="center-align" style={{borderRight:"0px solid black"}}><p>{!supplierAndBuyerStateCodeMatching?0.00:
                                                (hd.cgstRate/100)*(Number(hsnDetailsArray1[index][hd.hsnCode]))}</p></td>
                                          </tr>
                                       </table>
                                    </tr>
                                 </p></td>
                                 <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}><p>
                                    <tr>
                                       <table style={{marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                          <tr >
                                             <td className="center-align" style={{borderRight:"0px solid black"}} >
                                                <p>{!supplierAndBuyerStateCodeMatching?"-":hd.sgstRate}</p>
                                             </td>
                                             <td className="center-align" style={{borderRight:"0px solid black"}}>
                                                <p>{ !supplierAndBuyerStateCodeMatching?0.00:
                                                   (hd.sgstRate/100)*(Number(hsnDetailsArray1[index][hd.hsnCode])) }</p>
                                             </td>
                                          </tr>
                                       </table>
                                    </tr>
                                 </p></td>
                                 <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}><p>
                                    <tr>
                                       <table style={{marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                          <tr >
                                             <td className="center-align" style={{borderRight:"0px solid black"}} >
                                                <p>{supplierAndBuyerStateCodeMatching?"-":hd.igstRate}</p>
                                             </td>
                                             <td className="center-align" style={{borderRight:"0px solid black"}}>
                                                <p>
                                                   <NumberFormat
                                                      thousandsGroupStyle="lakh"
                                                      value = {(outputIGST).toFixed(2)}
                                                      decimalSeparator="."
                                                      displayType="text"
                                                      type="text"
                                                      thousandSeparator={true}
                                                      allowNegative={true} 
                                                   />
                                                </p>
                                             </td>
                                          </tr>
                                       </table>
                                    </tr>
                                 </p></td>
                                 <td colSpan="1" className="center-align">
                                    <p> 
                                       <NumberFormat
                                          thousandsGroupStyle="lakh"
                                          value = {
                                             ((hd.sgstRate/100)*(Number(hsnDetailsArray1[index][hd.hsnCode]))+
                                             (hd.cgstRate/100)*(Number(hsnDetailsArray1[index][hd.hsnCode]))+
                                             outputIGST).toFixed(2)
                                          }
                                          decimalSeparator="."
                                          displayType="text"
                                          type="text"
                                          thousandSeparator={true}
                                          allowNegative={true} 
                                       />
                                    </p>
                                 </td>
                              </tr>
                           )}
                           <tr>
                              <td colSpan="1" className="center-align"><p></p></td>
                              <td colSpan="1" className="right-align"><p>Total</p></td>
                              <td colSpan="1" className="center-align">
                                 <p>{drn!==undefined?
                                    <NumberFormat
                                       thousandsGroupStyle="lakh"
                                       value = {
                                          drn.drnTotalAmount!==undefined?
                                             drn.drnTotalAmount.toFixed(2):"0.00"
                                       }
                                       decimalSeparator="."
                                       displayType="text"
                                       type="text"
                                       thousandSeparator={true}
                                       allowNegative={true} 
                                    />:"0.00"}</p>
                              </td>
                              <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}><p>
                                 <tr>
                                    <table style={{marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tr >
                                          <td className="center-align" style={{borderRight:"0px solid black"}} >
                                             <p>-</p>
                                          </td>
                                          <td className="center-align" style={{borderRight:"0px solid black"}}>
                                             <p>{outputCGST}</p>
                                          </td>
                                       </tr>
                                    </table>
                                 </tr>
                              </p></td>
                              <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}><p>
                                 <tr>
                                    <table style={{marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tr >
                                          <td className="center-align" style={{borderRight:"0px solid black"}} >
                                             <p>-</p>
                                          </td>
                                          <td className="center-align" style={{borderRight:"0px solid black"}}>
                                             <p>{outputSGST}</p>
                                          </td>
                                       </tr>
                                    </table>
                                 </tr>
                              </p></td>
                              <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}><p>
                                 <tr>
                                    <table style={{marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tr >
                                          <td className="center-align" style={{borderRight:"0px solid black"}} >
                                             <p>-</p>
                                          </td>
                                          <td className="center-align" style={{borderRight:"0px solid black"}}>
                                             <p>
                                                <NumberFormat
                                                   thousandsGroupStyle="lakh"
                                                   value = {(outputIGST).toFixed(2)}
                                                   decimalSeparator="."
                                                   displayType="text"
                                                   type="text"
                                                   thousandSeparator={true}
                                                   allowNegative={true} 
                                                />
                                             </p>
                                          </td>
                                       </tr>
                                    </table>
                                 </tr>
                              </p></td>
                              <td colSpan="1" className="center-align">
                                 <p>
                                    <NumberFormat
                                       thousandsGroupStyle="lakh"
                                       value = {Number(totalTax).toFixed(2)}
                                       decimalSeparator="."
                                       displayType="text"
                                       type="text"
                                       thousandSeparator={true}
                                       allowNegative={true} 
                                    />
                                 </p>
                              </td>
                           </tr>
                           {/*<tr>
                              <td className="right-align" colSpan="1"><p></p></td>
                              <td className="right-align" colSpan="7"><p>Total Invoice Amount (₹)</p></td>
                              <td className="right-align" colSpan="2"><p>
                                 {drn!==undefined?
                                    <NumberFormat
                                       thousandsGroupStyle="lakh"
                                       value = {drn.drnTotalAmount!==undefined?(drn.drnTotalAmount+(drn.drnTotalAmount*0.18)).toFixed(2):"0.00"}
                                       decimalSeparator="."
                                       displayType="text"
                                       type="text"
                                       thousandSeparator={true}
                                       allowNegative={true} 
                                    />:"0.00"}
                              </p></td>
                                 </tr>*/}
                           <tr>
                              <td className="right-align" colSpan="1"><p></p></td>
                              <td className="right-align" colSpan="4"><p>Total Tax Amount (₹) (in words):</p></td>
                              <td className="right-align" colSpan="5">
                                 <p>{toWords.convert(totalTax)}</p>
                              </td>
                           </tr>
                           <tr>
                              <td colSpan="3" className="center-align" style={{backgroundColor:"lightgray"}}><h6 style={{color:"black"}}>Bank Details</h6></td>
                              <td colSpan="4" className="center-align" style={{backgroundColor:"lightgray"}}><h6 style={{color:"black"}}>Declaration</h6></td>
                              <td colSpan="3" className="center-align" style={{backgroundColor:"lightgray"}}><h6 style={{color:"black"}}>Authorised Signature & Stamp</h6></td>
                           </tr>
                           <tr>
                              <td colspan="3" className="center-align">
                                 <tr><p>Beneficiary: Decal Tech Private Limited</p></tr>
                                 <tr><p>Bank Name: State Bank of India</p></tr>
                                 <tr><p>Account No.: 38127978882</p></tr>
                                 <tr><p>IFS Code: SBIN0000489</p></tr>
                              </td>
                              <td colspan="4">
                                 <tr><p className="center-align">We declare that this invoice shows the actual price
                                 of the goods described and that all particulars are
                                 true and correct.</p></tr>
                                 <tr></tr>
                                 <tr><p className="center-align">Payment Terms: Within 30 Days</p></tr>
                              </td>
                              <td colspan="3" className="center-align">
                                 <tr className="center-align">
                                    <Image src={sign} style={{width:"50%", height:"50%", textAlign:"center"}} fluid />
                                 </tr>
                              </td>
                           </tr>
                        </table>
                     </div>
                  </Col>
               </Row>
               {/* START of LAST row in the form */}
               <Row>
               <Col lg={12} md={12} xs={12} style={{textAlign:"end"}}>
                  <Button 
                     type='button' 
                     onClick={handleReject}
                     className=' mx-2 my-3 btn-md button-class' style={{background:"red"}} >
                     <i className="fab fa-r-project"></i> Reject Tax Invoice
                  </Button>
                  {/*<Button 
                     disabled={drn.drnStatus !== "O"}
                     type='button' 
                     onClick={handleApproval}
                     className=' mx-2 my-3 btn-md button-class' style={{background:"green"}} >
                     <i className="fas fa-thumbs-up"></i> Send For Approval
                  </Button>*/}
                  <Button 
                     type='button'
                     onClick={handleApproval} 
                     className=' mx-2  my-3 btn-md button-class' style={{background:"green"}}  >
                     <i className="fas fa-save"></i> Generate Tax Invoice
                  </Button>
               </Col>
            </Row>
            </React.Fragment>
         )
      }
      <br></br>
      </FormContainer>
   )
}

export default InvoiceApprovalEditScreen
