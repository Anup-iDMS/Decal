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


const InvoiceApprovalEditScreen = ({ match, history }) => {
   const drnId = match.params.id;

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
   }
   //4. Define All Form Variables and their state
   const [ drnNumber, setDRNNo ] = useState("");
   const [ dRNStatus, setDRNStatus ] = useState("");
   const [ drnDate, setDRNDate] = useState(new Date());
   const [ customer, setCustomer ] = useState("");
   const [ customerId, setCustomerId ] = useState("");
   const [ customerCode, setCustomerCode ] = useState("");
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
      //console.log("--------- useeffect drn drn drn drn ", drn)

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
      if (success) {
         history.push('/invoiceapprovallist')
		   dispatch({ type: SALES_INVOICE_CREATE_RESET })
         NotificationManager.success(`Sales Invocie # ${autoIncrementedSINo} has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         NotificationManager.error(`Error in creating Sales Invoice !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
         dispatch({ type: SALES_INVOICE_CREATE_RESET })
      }

   }, [history, success, drn, drnId]);

   let tableArray = [];
   /** variable for GST calculations - START */
   let nama = [];
   let hsnArray = [];
   let sellerStateCode = 27;
   let buyerStateCode = "";
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
         let noOfTableRows = 10-drnNos;
         for( let i = 0 ; i < noOfTableRows ; i++ ) {
            tableArray.push({newKey: i});
         }
         let n = 0;
         
         for (const sid of drn.drnDetails) {
            let kama = {
               hsncode: "",
               taxValue: 0,
               cgstrate: 0,
               cgstAmt: 0,
               sgstrate: 0,
               sgstAmt: 0,
               igstrate: 0,
               igstAmt: 0,
               totalTax: 0
            }
            if(sid.hsnDetails !== undefined){
               if(!hsnArray.includes(sid.hsnDetails.hsnCode)) {
                  hsnArray.push(sid.hsnDetails.hsnCode)
                  /** KAMA AND NAMA */
                  kama.hsncode = sid.hsnDetails.hsnCode;
                  kama.taxValue = sid.drnLineValue;
                  kama.cgstrate = (sid.cgstAmt/sid.drnLineValue)*100 //sid.hsnDetails.cgstRate;
                  kama.cgstAmt = sid.cgstAmt;
                  kama.sgstrate = (sid.sgstAmt/sid.drnLineValue)*100 //sid.hsnDetails.sgstRate;
                  kama.sgstAmt = sid.sgstAmt;
                  kama.igstrate = (sid.igstAmt/sid.drnLineValue)*100 //sid.hsnDetails.igstRate;
                  kama.igstAmt = sid.igstAmt;
                  kama.totalTax = parseFloat(sid.cgstAmt)+parseFloat(sid.sgstAmt)+parseFloat(sid.igstAmt);
                  nama.push(kama)
                  /** */

               } else {
                  let cama = nama[hsnArray.indexOf(sid.hsnDetails.hsnCode)]
                  cama.taxValue += sid.drnLineValue
                  cama.totalTax += parseFloat(sid.cgstAmt)+parseFloat(sid.sgstAmt)+parseFloat(sid.igstAmt)
                  nama[hsnArray.indexOf(sid.hsnDetails.hsnCode)] = cama
               }
               n++;
            }
         }
         
         if(buyerStateCode === sellerStateCode) {
            supplierAndBuyerStateCodeMatching = true;
         } 
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
      //console.log("-------------------- SET FORM DATA ------------- ")
      setDRNNo(drn.drnNumber);
      setDRNStatus(drn.drnStatus);
      setDRNDate((new Date(drn.drnDate)));
      setCustomer(drn.customer.custName);
      setCustomerId(drn.customer._id);
      setCustomerCode(drn.customer.custCode);
      setBillState(drn.billState);
      setBillPinCode(drn.billPinCode);
      setShipState(drn.shipState);
      setShipPinCode(drn.shipPinCode);
      setDRNTotalAmount(drn.drnTotalAmount);
      setDRNDetails(drn.drnDetails);
   }

   const handleApproval = () => {
      dispatch(
         createSalesInvoice({
            salesInvoiceNumber: autoIncrementedSINo,
            drnNumber: drn.drnNumber,
            drnId,
            drnDate,
            customer: drn.customer._id,
            paymentTerms: drn.paymentTerms,
            billState: drn.billState,
            billPinCode: drn.billPinCode,
            shipState: drn.shipState,
            shipPinCode: drn.shipPinCode,
            drnDetails: drn.drnDetails,
            supplierAddressIndex:drn.supplierAddressIndex,
            supplierAddress: drn.supplierAddress,
            customerBillingAddressIndex: drn.customerBillingAddressIndex,
            customerBillingAddress: drn.customerBillingAddress,
            customerShipingAddressIndex: drn.customerShipingAddressIndex,
            customerShipingAddress: drn.customerShipingAddress
         })
      )
   }

   const submitHandler = (e) => {
      e.preventDefault();
      
   }

   const handleReject = () => {
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
   // console.log("<<<<< Customer Detauls are ", drn.customer)
   // if(drn.customer !== undefined) {
   //    console.log(">>>>> Customer CODE are ", drn.customer.custCode)
   //    setCustomerCode(drn.customer.custCode);
   // }
      
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
                        <table style={{ width:"100%", tableLayout:"fixed"  }}>
                           <tbody>
                              <tr>
                                 <td colSpan="10" className="td-center-align" style={{border:"1px solid black"}}>
                                    <Image src={logo} style={{width:"25%"}} fluid />
                                 </td>
                              </tr>
                              <tr style={{border:"1px solid black"}}>
                                 <td 
                                    style={{backgroundColor:"lightgray", textAlign:"center"}} 
                                    colSpan="10"
                                 >
                                    <h3 style={{color:"black"}} >Tax Invoice</h3>
                                 </td>
                              </tr>
                              <tr style={{border:"1px solid black"}}>
                                 <td colSpan="5">
                                    <tr><p style={{color:"black", fontWeight:"bold" }}>DECAL TECH PRIVATE LIMITED</p></tr>
                                    <tr>
                                       <p>{drn.supplierAddress!==undefined?
                                          drn.supplierAddress[0].addressLine1:"Unit No. G1/A, Shree Rajlaxmi Hi-Tech Park"
                                       }</p>
                                    </tr>
                                    <tr>
                                       <p>{drn.supplierAddress!==undefined?
                                          drn.supplierAddress[0].addressLine2:"Mumbai - Nashik Highway, Sonale, Bhiwandi"
                                       }</p>
                                    </tr>
                                    <tr><p><p>{drn.supplierAddress!==undefined?
                                       drn.supplierAddress[0].addressLine3:"Thane - 421302"
                                    }</p>   State: Maharashtra | Code 27 GSTIN: 27AAGCD4662E1ZP</p></tr>
                                 </td>
                                 <td colSpan="5">
                                    <tr><p style={{ color:"black", fontWeight:"bold" }}>Invoice Details</p></tr>
                                    <tr><p>Invoice No.: {autoIncrementedSINo}</p></tr>
                                    <tr><p>Invoice Date: {format(new Date(), 'dd-MMM-yyyy')}</p></tr>
                                    <tr><p>Invoice Amount (₹):  
                                       {drn!==undefined?
                                          <NumberFormat
                                             thousandsGroupStyle="lakh"
                                             value = {drn.drnTotalAmount!==undefined?(Number(drn.drnTotalAmount)+Number(drn.drnTotalTaxAmount)).toFixed(2):"0.00"}
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
                                 <td colSpan="5" style={{backgroundColor:"lightgray"}} >
                                    <h6 style={{color:"black"}}>Details of Reciever (Bill To)</h6>
                                 </td>
                                 <td colSpan="5" style={{backgroundColor:"lightgray"}}>
                                    <h6 style={{color:"black"}}>Details of Consignee (Ship To)</h6>
                                 </td>
                              </tr>
                              <tr>
                                 <td colSpan="5">
                                    <tr>
                                       <p>
                                          <b>
                                             {drn!==undefined && drn.customer !== undefined?
                                                drn.customer.custName:""
                                             }
                                          </b>
                                       </p>
                                    </tr>
                                    <tr>
                                       <p>
                                          <b>
                                             {drn!==undefined && drn.customerBillingAddress !== undefined?
                                                drn.customerBillingAddress[0].addressLine1+" "+
                                                drn.customerBillingAddress[0].addressLine2:""
                                             }
                                          </b>
                                       </p>
                                    </tr>
                                    <tr>
                                       <p>
                                          <b>
                                             {drn!==undefined && drn.customerBillingAddress !== undefined?
                                                drn.customerBillingAddress[0].city+" "+
                                                drn.customerBillingAddress[0].pinCode+ " "+
                                                drn.customerBillingAddress[0].state:""
                                             }
                                          </b>
                                       </p>
                                    </tr>
                                    <tr>
                                       <p>State Code: {
                                          (drn!==undefined && drn.customer !== undefined && drn.customer.custGST !== undefined) ?
                                             drn.customer.custGST.substring(0,2):""
                                          } 
                                          <span style={{marginLeft:"15px"}}>
                                             {drn!==undefined && drn.customer !== undefined? 
                                                drn.customer.custGST:""
                                             }
                                          </span>
                                       </p>
                                    </tr>
                                 </td>
                                 <td colSpan="5">
                                    <tr>
                                       <p>
                                          <b>
                                             {drn!==undefined && drn.customer !== undefined?
                                                drn.customer.custName:""
                                             }
                                          </b>
                                       </p>
                                    </tr>
                                    <tr>
                                       <p>
                                          <b>
                                             {drn!==undefined && drn.customerShipingAddress !== undefined?
                                                drn.customerShipingAddress[0].addressLine1+" "+
                                                drn.customerShipingAddress[0].addressLine2:""
                                             }
                                          </b>
                                       </p>
                                    </tr>
                                    <tr>
                                       <p>
                                          <b>
                                             {drn!==undefined && drn.customerShipingAddress !== undefined?
                                                drn.customerShipingAddress[0].city+" "+
                                                drn.customerShipingAddress[0].pinCode+ " "+
                                                drn.customerShipingAddress[0].state:""
                                             }
                                          </b>
                                       </p>
                                    </tr>
                                    <tr>
                                       <p>State Code: {
                                          (drn!==undefined && drn.customer !== undefined && drn.customer.custGST !== undefined) ?
                                             drn.customer.custGST.substring(0,2):""
                                          } 
                                          <span style={{marginLeft:"15px"}}>
                                             {drn!==undefined && drn.customer !== undefined? 
                                                drn.customer.custGST:""
                                             }
                                          </span>
                                       </p>
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
                                 <td className="right-align" colSpan="2">
                                    <p>
                                       {drn!==undefined?
                                          <NumberFormat
                                             thousandsGroupStyle="lakh"
                                             value = {
                                                drn.drnTotalCGSTAmount!==undefined?
                                                   drn.drnTotalCGSTAmount.toFixed(2):"0.00"
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
                                 <td className="right-align" colSpan="7"><p>Output SGST (₹)</p></td>
                                 <td className="right-align" colSpan="2">
                                    <p>
                                       {drn!==undefined?
                                       <NumberFormat
                                          thousandsGroupStyle="lakh"
                                          value = {
                                             drn.drnTotalSGSTAmount!==undefined?
                                             drn.drnTotalSGSTAmount.toFixed(2):"0.00"
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
                                 <td className="right-align" colSpan="7"><p>Output IGST (₹)</p></td>
                                 <td className="right-align" colSpan="2">
                                    <p>{drn!==undefined?
                                       <NumberFormat
                                          thousandsGroupStyle="lakh"
                                          value = {supplierAndBuyerStateCodeMatching?"0.00":Number(drn.drnTotalIGSTAmount).toFixed(2)}
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
                                          value = {(
                                                   Number(drn.drnTotalAmount)+
                                                   Number(drn.drnTotalCGSTAmount)+
                                                   Number(drn.drnTotalSGSTAmount)+
                                                   Number(drn.drnTotalIGSTAmount)).toFixed(2)
                                                }
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
                                    <p>{toWords.convert(drn.drnTotalAmount!==undefined?(drn.drnTotalAmount+drn.drnTotalTaxAmount).toFixed(2):0)}</p>
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
                                    <table style={{padding:"0px", width:"100%", tableLayout:"fixed", borderRight:"0px solid blue" ,marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tbody>
                                          <tr >
                                             <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} colSpan="2">CGST</td>
                                          </tr>
                                          <tr >
                                             <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} ><p>Rate (%)</p></td>
                                             <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}}><p>Amount (₹)</p></td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                                 <td 
                                    colSpan="2" 
                                    className="center-align-gray-background" 
                                    style={{backgroundColor:"lightgray"}}
                                 >
                                    <table style={{padding:"0px", width:"100%", tableLayout:"fixed" , borderRight:"0px solid blue" ,marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tbody>
                                          <tr >
                                             <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} colSpan="2">
                                             SGST</td>
                                          </tr>
                                          <tr >
                                             <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} ><p>Rate (%)</p></td>
                                             <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}}><p>Amount (₹)</p></td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                                 <td 
                                 colSpan="2" 
                                 className="center-align-gray-background" 
                                 style={{backgroundColor:"lightgray"}}
                                 >
                                    
                                    <table style={{padding:"0px", width:"100%", tableLayout:"fixed" , borderRight:"0px solid blue" ,marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tbody>
                                          <tr >
                                             <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} colSpan="2">
                                             IGST</td>
                                          </tr>
                                          <tr >
                                             <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}} ><p>Rate (%)</p></td>
                                             <td className="center-align-gray-background" style={{backgroundColor:"lightgray", borderRight:"0px solid blue"}}><p>Amount (₹)</p></td>
                                          </tr>
                                       </tbody>
                                    </table>
                                    
                                 </td>
                                 <td colSpan="1" className="center-align-gray-background" style={{backgroundColor:"lightgray"}}>Total Tax Amount (₹)</td>
                              </tr>
                              {nama.map((hd, index) =>
                                 <tr key={index}>
                                    <td colSpan="1" className="center-align"><p></p></td>
                                    <td colSpan="1" className="center-align"><p>{hd.hsncode}</p></td>
                                    <td colSpan="1" className="center-align">
                                       <p>
                                          {drn!==undefined?
                                          <NumberFormat
                                             thousandsGroupStyle="lakh"
                                             value = {hd.taxValue}
                                             decimalSeparator="."
                                             displayType="text"
                                             type="text"
                                             thousandSeparator={true}
                                             allowNegative={true} 
                                          />:"0.00"}
                                       </p>
                                    </td>
                                    <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}>
                                       <React.Fragment>
                                          <table style={{marginLeft:"-9px", width:"100%", tableLayout:"fixed" , marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                             <tbody>
                                                <tr >
                                                   <td className="center-align" style={{borderRight:"0px solid black"}} ><p>{!supplierAndBuyerStateCodeMatching?"-":hd.cgstrate}</p></td>
                                                   <td className="center-align" style={{borderRight:"0px solid black"}}><p>{!supplierAndBuyerStateCodeMatching?0.00:
                                                      (hd.cgstAmt)}</p></td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </React.Fragment>
                                    </td>
                                    <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}>
                                       <React.Fragment>
                                          <table style={{width:"100%", tableLayout:"fixed" , marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                             <tbody>
                                                <tr >
                                                   <td className="center-align" style={{borderRight:"0px solid black"}} >
                                                      <p>{!supplierAndBuyerStateCodeMatching?"-":hd.sgstrate}</p>
                                                   </td>
                                                   <td className="center-align" style={{borderRight:"0px solid black"}}>
                                                      <p>{ !supplierAndBuyerStateCodeMatching?0.00:
                                                         (hd.sgstAmt) }</p>
                                                   </td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </React.Fragment>
                                    </td>
                                    <td 
                                       colSpan="2" 
                                       className="center-align" 
                                       style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}
                                    >
                                       <table style={{marginLeft:"-9px", width:"100%", tableLayout:"fixed" , marginTop:"-9px", marginBottom:"8px", marginRight:"220px"}}>
                                          <tbody>
                                             <tr >
                                                <td className="center-align" style={{borderRight:"0px solid black"}} >
                                                   <p>{supplierAndBuyerStateCodeMatching?"-":hd.igstrate}</p>
                                                </td>
                                                <td className="center-align" style={{borderRight:"0px solid black"}}>
                                                   <p>
                                                      <NumberFormat
                                                         thousandsGroupStyle="lakh"
                                                         value = {(hd.totalTax).toFixed(2)}
                                                         decimalSeparator="."
                                                         displayType="text"
                                                         type="text"
                                                         thousandSeparator={true}
                                                         allowNegative={true} 
                                                      />
                                                   </p>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                    <td colSpan="1" className="center-align">
                                       <p> 
                                          <NumberFormat
                                             thousandsGroupStyle="lakh"
                                             value = {
                                                (hd.totalTax).toFixed(2)
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
                                 <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}>
                                    <table style={{marginLeft:"-9px", width:"100%", tableLayout:"fixed" , marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tbody>
                                          <tr >
                                             <td className="center-align" style={{borderRight:"0px solid black"}} >
                                                <p>-</p>
                                             </td>
                                             <td className="center-align" style={{borderRight:"0px solid black"}}>
                                                <p>{drn.drnTotalCGSTAmount!==undefined?drn.drnTotalCGSTAmount:0}</p>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                                 <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}>
                                    <table style={{marginLeft:"-9px", width:"100%", tableLayout:"fixed" , marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tbody>
                                          <tr >
                                             <td className="center-align" style={{borderRight:"0px solid black"}} >
                                                <p>-</p>
                                             </td>
                                             <td className="center-align" style={{borderRight:"0px solid black"}}>
                                                <p>{drn.drnTotalSGSTAmount!==undefined?drn.drnTotalSGSTAmount:0}</p>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                                 <td colSpan="2" className="center-align" style={{borderTop:"1px solid black", borderBottom:"1px solid black"}}>
                                    <table style={{width:"100%", tableLayout:"fixed" , marginLeft:"-9px", marginTop:"-9px", marginBottom:"-9px", marginRight:"210px"}}>
                                       <tbody>
                                          <tr >
                                             <td className="center-align" style={{borderRight:"0px solid black"}} >
                                                <p>-</p>
                                             </td>
                                             <td className="center-align" style={{borderRight:"0px solid black"}}>
                                                <p>
                                                   <NumberFormat
                                                      thousandsGroupStyle="lakh"
                                                      value = {(drn.drnTotalIGSTAmount!==undefined?drn.drnTotalIGSTAmount:0).toFixed(2)}
                                                      decimalSeparator="."
                                                      displayType="text"
                                                      type="text"
                                                      thousandSeparator={true}
                                                      allowNegative={true} 
                                                   />
                                                </p>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                                 <td colSpan="1" className="center-align">
                                    <p>
                                       <NumberFormat
                                          thousandsGroupStyle="lakh"
                                          value = {Number(drn.drnTotalTaxAmount!==undefined?drn.drnTotalTaxAmount:0).toFixed(2)}
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
                                    <p>{toWords.convert(drn.drnTotalTaxAmount!==undefined?drn.drnTotalTaxAmount:0)}</p>
                                 </td>
                              </tr>
                              <tr>
                                 <td colSpan="3" className="center-align" style={{backgroundColor:"lightgray"}}><h6 style={{color:"black"}}>Bank Details</h6></td>
                                 <td colSpan="4" className="center-align" style={{backgroundColor:"lightgray"}}><h6 style={{color:"black"}}>Declaration</h6></td>
                                 <td colSpan="3" className="center-align" style={{backgroundColor:"lightgray"}}><h6 style={{color:"black"}}>Authorised Signature & Stamp</h6></td>
                              </tr>
                              <tr>
                                 <td colSpan="3" className="center-align">
                                    <p>Beneficiary: Decal Tech Private Limited</p>
                                    <p>Bank Name: State Bank of India</p>
                                    <p>Account No.: 38127978882</p>
                                    <p>IFS Code: SBIN0000489</p>
                                 </td>
                                 <td colSpan="4">
                                    <p className="center-align">We declare that this invoice shows the actual price
                                    of the goods described and that all particulars are
                                    true and correct.</p>
                                    <p className="center-align">Payment Terms: {drn.paymentTerms === undefined?"Within 30 Days":drn.paymentTerms}</p>
                                 </td>
                                 <td colSpan="3" className="center-align">
                                       <Image src={sign} style={{width:"50%", height:"50%", textAlign:"center"}} fluid />
                                 </td>
                              </tr>
                           </tbody>
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
