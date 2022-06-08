import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCreditNoteDetails } from '../../actions/sales/creditNoteActions';

import logo from './../../assets/DTPL_Logo.jpg'
import sign from './../../assets/Invoice_sign_SD.png'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import './../css/printinvoice.css';
import { Image } from 'react-bootstrap';
import { format } from 'date-fns'
import NumberFormat from 'react-number-format';
import { ToWords } from 'to-words';
import Loader from './../../components/app/Loader';
import Message from './../../components/app/Message';
import PrinterWrapper from './../../components/app/PrinterWrapper';
import { logger } from './../../util/ConsoleHelper';

const CreditNotePrintScreen = ({ match, history }) => {
   const creditNoteId = match.params.id;

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const creditNoteDetails = useSelector((state) => state.creditNoteDetails)

   const { loading, creditNote, error } = creditNoteDetails;
   /** set supplier address */
   const [ supplierAddressLine1, setSupplierAddressLine1 ] = useState("Unit No. G1/A, Shree Rajlaxmi Hi-Tech Park");
   const [ supplierAddressLine2, setSupplierAddressLine2 ] = useState("Mumbai - Nashik Highway, Sonale, Bhiwandi");
   const [ supplierAddressLine3, setSupplierAddressLine3 ] = useState("Thane - 421302");
   const [ state, setState ] = useState("Maharashtra");
   const [ city, setCity] = useState("Thane");
   const [ district, setDistrict ] = useState("Thane");
   const [ pinCode, setPinCode ] = useState("421302");

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

   useEffect(() => {
      if (creditNote._id !== creditNoteId) {
         dispatch(getCreditNoteDetails(creditNoteId))
      } else {
         if(creditNote.supplierAddress !== undefined && creditNote.supplierAddress.length > 0) {
            setSupplierAddressLine1(creditNote.supplierAddress[0].addressLine1);
            setSupplierAddressLine2(creditNote.supplierAddress[0].addressLine2);
            setSupplierAddressLine3(creditNote.supplierAddress[0].addressLine3);
            setState(creditNote.supplierAddress[0].state);
            setCity(creditNote.supplierAddress[0].city);
            setDistrict(creditNote.supplierAddress[0].district);
            setPinCode(creditNote.supplierAddress[0].pinCode);
         }

         if(creditNote.customerBillingAddress !== undefined && creditNote.customerBillingAddress.length > 0) {
            setCustomerBillingAddressLine1(creditNote.customerBillingAddress[0].addressLine1);
            setCustomerBillingAddressLine2(creditNote.customerBillingAddress[0].addressLine2);
            setCustomerBillingAddressLine3(creditNote.customerBillingAddress[0].addressLine3);
            setBillingAddressState(creditNote.customerBillingAddress[0].state);
            setBillingAddressCity(creditNote.customerBillingAddress[0].city);
            setBillingAddressDistrict(creditNote.customerBillingAddress[0].district);
            setBillingAddressPinCode(creditNote.customerBillingAddress[0].pinCode);
         } else {
            if(creditNote!==undefined && creditNote.customer 
               && creditNote.customer.custBillingAddress !== undefined) {
                  setCustomerBillingAddressLine1(creditNote.customer.custBillingAddress[0].custBillAddressLine1);
                  setCustomerBillingAddressLine2(creditNote.customer.custBillingAddress[0].custBillAddressLine2);
                  setCustomerBillingAddressLine3(creditNote.customer.custBillingAddress[0].custBillAddressLine3);
                  setBillingAddressState(creditNote.billState);
                  setBillingAddressCity(creditNote.customer.custBillingAddress[0].custBillCity);
                  setBillingAddressDistrict(creditNote.customer.custBillingAddress[0].custBillDistrict);
                  setBillingAddressPinCode(creditNote.customer.custBillingAddress[0].custBillPinCode);
            }
         }

         if(creditNote.customerShipingAddress !== undefined && creditNote.customerShipingAddress.length > 0) {
            setCustomerShipingAddressLine1(creditNote.customerShipingAddress[0].addressLine1);
            setCustomerShipingAddressLine2(creditNote.customerShipingAddress[0].addressLine2);
            setCustomerShipingAddressLine3(creditNote.customerShipingAddress[0].addressLine3);
            setShipingAddressState(creditNote.customerShipingAddress[0].state);
            setShipingAddressCity(creditNote.customerShipingAddress[0].city);
            setShipingAddressDistrict(creditNote.customerShipingAddress[0].district);
            setShipingAddressPinCode(creditNote.customerShipingAddress[0].pinCode);
         } else {
            if(creditNote!==undefined && creditNote.customer 
               && creditNote.customer.custShipingAddress !== undefined) {
                  setCustomerShipingAddressLine1(creditNote.customer.custShipingAddress[0].custShipAddressLine1);
                  setCustomerShipingAddressLine2(creditNote.customer.custShipingAddress[0].custShipAddressLine2);
                  setCustomerShipingAddressLine3(creditNote.customer.custShipingAddress[0].custShipAddressLine3);
                  setShipingAddressState(creditNote.billState);
                  setShipingAddressCity(creditNote.customer.custShipingAddress[0].custShipCity);
                  setShipingAddressDistrict(creditNote.customer.custShipingAddress[0].custShipDistrict);
                  setShipingAddressPinCode(creditNote.customer.custShipingAddress[0].custShipPinCode);
            }
         }
      }
   }, [history, creditNote]);

   /** variable for GST calculations - START */
   let tableArray = [];
   let nama = [];
   let hsnArray = [];
   let sellerStateCode = 27;
   let buyerStateCode = "";
   let supplierAndBuyerStateCodeMatching = false;
   /** variable for GST calculations - END */

   
   const fontFamily = {
      fontFamily: "Poppins"
   }

   if(!loading) {
      if(creditNote!==undefined) {
         if(creditNote.customer !== undefined) {
            buyerStateCode = parseInt(creditNote.customer.custGST.substring(0,2))
         }
      } 
      if(creditNote.creditNoteDetails !== undefined) {
         let creditNoteNos = creditNote.creditNoteDetails.length;
         let rowsOnInvoicePrint = 6;
         if(creditNoteNos > 8) {
            rowsOnInvoicePrint = (creditNoteNos+1);
         }
         let noOfTableRows = rowsOnInvoicePrint-creditNoteNos;
         for( let i = 0 ; i < noOfTableRows ; i++ ) {
            tableArray.push({newKey: i});
         }
         //gst = creditNote.creditNoteDetails[0].hsnDetails.gstRate
         
         //check what all HSN are present in the SI Details
         let n = 0;
         for (const sid of creditNote.creditNoteDetails) {
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
            
            let srs = {}
            if(sid.hsnDetails !== undefined){
               if(!hsnArray.includes(sid.hsnDetails.hsnCode)) {
                  hsnArray.push(sid.hsnDetails.hsnCode)
                  /** KAMA AND NAMA */
                  kama.hsncode = sid.hsnDetails.hsnCode;
                  kama.taxValue = sid.creditNoteLineValue;
                  kama.cgstrate = sid.hsnDetails.cgstRate;
                  kama.cgstAmt = sid.cgstAmt;
                  kama.sgstrate = sid.hsnDetails.sgstRate;
                  kama.sgstAmt = sid.sgstAmt;
                  kama.igstrate = sid.hsnDetails.igstRate;
                  kama.igstAmt = sid.igstAmt;
                  kama.totalTax = parseFloat(sid.cgstAmt)+parseFloat(sid.sgstAmt)+parseFloat(sid.igstAmt);
                  nama.push(kama)
                  /** */

               } else {
                  let cama = nama[hsnArray.indexOf(sid.hsnDetails.hsnCode)]
                  cama.igstAmt += sid.igstAmt;
                  cama.cgstAmt += sid.cgstAmt;
                  cama.sgstAmt += sid.sgstAmt;
                  cama.taxValue += sid.creditNoteLineValue
                  cama.totalTax += parseFloat(sid.cgstAmt)+parseFloat(sid.sgstAmt)+parseFloat(sid.igstAmt)
                  nama[hsnArray.indexOf(sid.hsnDetails.hsnCode)] = cama
               }
               n++;
            }
         }
         if(buyerStateCode === sellerStateCode) {
            supplierAndBuyerStateCodeMatching = true;
         } 
         //console.log(" NAMA IS ", nama)
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


   /** styling start */
   let tableStyle = {
      border: "1px solid black",
      width: "100%",
      height: "100%",
      // fontFamily:"Poppins",
      padding: "5px",
      margin:"0"
   }
   /** styling end */

   return (
      <React.Fragment>
      {loading ? (
         <Loader />
      ) : error  ? (
         <Message variant='danger'>{ error }</Message>
      ) : (
         <React.Fragment>
            <PrinterWrapper>
               <div className="page">
                  <table style={{width:"100%", tableLayout:"fixed"}} className="invoiceTable">
                     <tr>
                        <td colSpan={12} style={{...tableStyle}}>
                           <div style={{textAlign:"right", fontFamily:"Poppins"}}>
                              <Image src={logo} style={{width:"25%"}} fluid />
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, backgroundColor: "lightgray"}}>
                           <div style={{ textAlign:"center", fontFamily:"Poppins" }}>
                              <b><span style={{ fontFamily:"Poppins", color:"black", fontSize:"25px", fontWeight:"bold" }} >REVISED INVOICE</span></b>
                           </div>
                           <div style={{ textAlign:"center", fontFamily:"Poppins" }}>
                              <b><span style={{ fontFamily:"Poppins", color:"black", fontSize:"20px", fontWeight:"bold" }} >CREDIT NOTE</span></b>
                           </div>                        
                        </td>
                     </tr>
                     <tr>
                        <td colSpan="6" style={{...tableStyle}}>
                           <div style={{ marginLeft: "10px", fontFamily:"Poppins", textAlign:"left" }}>
                              <span style={{fontWeight:"bold", fontFamily:"Poppins"}}>DECAL TECH PRIVATE LIMITED</span>
                              <br />
                              {supplierAddressLine1}<br/>
                              {supplierAddressLine2}<br/>
                              {supplierAddressLine3}<br /> 
                              State: {state} | Code 27&nbsp;&nbsp;&nbsp;GSTIN: 27AAGCD4662E1ZP	<br />
                              {/*Contact Person: <span style={{ fontFamily:"Poppins" }}>{"Payal Deo"}</span><br />
                                 Cell: <span style={{ fontFamily:"Poppins" }}>{"9920055976"}</span>*/}
                           </div>
                        </td>
                        <td colSpan="6" style={{...tableStyle}}>
                           <div style={{ textAlign:"left", marginBottom:"5px", marginLeft:"10px", fontFamily:"Poppins" }}>
                                 <span style={{fontWeight:"bold", fontFamily:"Poppins"}}>INVOICE DETAILS</span>
                                 <br />
                                 Credit Note #: <span style={{ fontFamily:"Poppins" }}>{creditNote.creditNoteNumber}</span>
                                 <br />
                                 Credit Note Date: <span style={{ fontFamily:"Poppins" }}>{creditNote.creditNoteDate !== undefined?format(new Date(creditNote.creditNoteDate), 'dd-MMM-yyyy'):null }</span>
                                 <br />
                                 Credit Note Amount: (₹) <span style={{ fontFamily:"Poppins" }}>
                                 <NumberFormat
                                       thousandsGroupStyle="lakh"
                                       value = {Number(creditNote.creditNoteTotalAmountWithTax).toFixed(2)}
                                       decimalSeparator="."
                                       displayType="text"
                                       type="text"
                                       thousandSeparator={true}
                                       allowNegative={true} 
                                 /></span>
                                 <br />
                                 {/*Buyer's Ref: <span style={{ fontFamily:"Poppins" }}>{creditNote.salesInvoiceNumber !== undefined?creditNote.salesInvoiceNumber.salesInvoiceNumber:"" }</span>
                                 <br />
                                 Buyer's Ref Date: <span style={{ fontFamily:"Poppins" }}>{creditNote.salesInvoiceNumber !== undefined?format(new Date(creditNote.salesInvoiceNumber.salesInvoiceDate), 'dd-MMM-yyyy'):null }</span>
                                 <br />*/}
                                 Reverse Charge Applicable: No 
                           </div>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"5px" }}></td>
                     </tr>
                     
                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"10px" }}></td>
                     </tr>

                     <tr>
                        <td colSpan="6" style={{ ...tableStyle, backgroundColor: "lightgray"}}>
                           <div style={{ textAlign:"left", marginLeft:"10px", fontFamily:"Poppins" }}>
                              Details of Reciever (Bill To)
                           </div>
                        </td>
                        <td colSpan="6" style={{ ...tableStyle, backgroundColor: "lightgray"}}>
                           <div style={{ textAlign:"left", marginLeft:"10px", fontFamily:"Poppins" }}>
                              Details of Consignee (Ship To)
                           </div>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan="6" style={{...tableStyle}}>
                           <div  style={{ textAlign:"left", marginBottom:"5px", marginLeft:"10px", marginTop:"5px" }}>
                              <b><span style={{ fontFamily:"Poppins", fontWeight:"bold" }}>{creditNote!==undefined && creditNote.customer !== undefined?creditNote.customer.custName:""}</span></b>
                              <br />
                              <span style={{ fontFamily:"Poppins" }}>
                                 {
                                    customerBillingAddressLine1+" "+
                                    customerBillingAddressLine2+" "+
                                    customerBillingAddressLine3
                                 } 
                              </span>
                              &nbsp;
                              <br />
                              <span style={{ fontFamily:"Poppins" }}>State Code:</span>
                              <span style={{ fontFamily:"Poppins" }}>{buyerStateCode<10?"0"+buyerStateCode:buyerStateCode}</span>
                              <span style={{ fontFamily:"Poppins" }}> Place of Supply: {billingAddressState}</span><br></br>
                              <span style={{ fontFamily:"Poppins" }}>GSTIN/UIN: </span>
                              <span style={{ fontFamily:"Poppins" }}>{creditNote!==undefined && creditNote.customer !== undefined? creditNote.customer.custGST:""}</span><br></br>
                              <span style={{ fontFamily:"Poppins" }}>{creditNote!==undefined && creditNote.customer !== undefined? "Contact: "+creditNote.customer.custContactPersonName+" (Cell: "+creditNote.customer.custContactPersonNumber+")":""}</span>
                           </div>
                        </td>
                        <td colSpan="6" style={{...tableStyle}}>
                           <div  style={{ textAlign:"left", marginBottom:"5px", marginLeft:"10px", marginTop:"5px" }}>
                              <b><span style={{ fontFamily:"Poppins", fontWeight:"bold" }}>{creditNote!==undefined && creditNote.customer !== undefined?creditNote.customer.custName:""}</span></b>
                              <br />
                              <span style={{ fontFamily:"Poppins" }}>
                                 {
                                    customerShipingAddressLine1+" "+
                                    customerShipingAddressLine2+" "+
                                    customerShipingAddressLine3
                                 }  
                              </span>
                              &nbsp;
                              <br />
                              <span style={{ fontFamily:"Poppins" }}>State Code:</span>
                              <span style={{ fontFamily:"Poppins" }}>{buyerStateCode<10?"0"+buyerStateCode:buyerStateCode}</span>
                              <span style={{ fontFamily:"Poppins" }}> Place of Supply: {shipingAddressState}</span><br></br>
                              <span style={{ fontFamily:"Poppins" }}>GSTIN/UIN: </span>
                              <span style={{ fontFamily:"Poppins" }}>{creditNote!==undefined && creditNote.customer !== undefined? creditNote.customer.custGST:""}</span><br></br>
                              <span style={{ fontFamily:"Poppins" }}>{creditNote!==undefined && creditNote.customer !== undefined? "Contact: "+creditNote.customer.custContactPersonName+" (Cell: "+creditNote.customer.custContactPersonNumber+")":""}</span>
                           </div>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"5px" }}></td>
                     </tr>
                     
                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"10px" }}></td>
                     </tr>

                     <tr>
                        <td className="col-3" style={{ ...tableStyle, textAlign:"center", fontFamily:"Poppins" }}>
                           <span style={{ fontFamily:"Poppins" }}>#</span>
                        </td>
                        <td colSpan={5} style={{...tableStyle}}>
                        <span style={{ marginLeft:"10px", fontFamily:"Poppins" }}>Description of Goods/Services</span>
                        </td>

                        <td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Poppins" }}>
                           <span style={{ fontFamily:"Poppins" }}>HSN / SAC</span>
                        </td>

                        {/*<td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Poppins" }}>
                           <span style={{ fontFamily:"Poppins" }}>Batch Date</span>
                        </td>*/}

                        <td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Poppins" }}>
                           <span style={{ fontFamily:"Poppins" }}>Qty</span>
                        </td>

                        <td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Poppins" }}>
                           <span >Unit</span>
                        </td>

                        <td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Poppins" }}>
                           <span style={{ fontFamily:"Poppins" }}>Rate (₹)</span>
                        </td>

                        <td colSpan={2} style={{ ...tableStyle, textAlign:"center", fontFamily:"Poppins" }}>
                           <span style={{ fontFamily:"Poppins" }}>Amount (₹)</span>
                        </td>
                     </tr>
                     {creditNote!==undefined && creditNote.creditNoteDetails !==undefined?(
                        creditNote.creditNoteDetails.map((cnd, index) => 
                           <tr key={index} style={{ backgroundColor:"white" }}>
                              <td className="col-3" className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Poppins" }}>{cnd.creditNoteLineNumber}</span>
                              </td>
                              <td colSpan={5} style={{...tableStyle, textAlign:"left"}}>
                                 <span style={{ fontFamily:"Poppins", textAlign:"left" }}>{cnd.jcDescription}</span><br></br>
                                 <span style={{ display: (cnd.debitNoteRef === "" ? 'none' : '') }}>
                                    <span style={{fontWeight:"bold", textAlign:"left", fontSize:"12px", fontFamily:"Poppins"}}>Debit Note Ref:</span> 
                                    <span style={{ fontSize:"12px", fontFamily:"Poppins" }}>{cnd.debitNoteRef}</span>
                                 </span>&nbsp;&nbsp;
                                 <span style={{ fontWeight:"bold", display: (cnd.taxInvoiceRef === "" ? 'none' : '') }}> | </span> 
                                 &nbsp;&nbsp;
                                 <span style={{ fontFamily:"Poppins" }}>
                                    <span style={{fontWeight:"bold", fontSize:"12px", fontFamily:"Poppins"}}>Invoice #:</span> 
                                    <span style={{ fontSize:"12px", fontFamily:"Poppins" }}>{cnd.taxInvoiceRef}</span>
                                 </span>
                              </td>
                              <td colSpan={1} style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Poppins" }}>{cnd.jcNo.hsn}</span>
                              </td>
                             { /*<td colSpan={1} style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Poppins" }}>{cnd.batchDate !== undefined?format(new Date(cnd.batchDate), 'dd-MMM-yy'):null}</span>
                              </td>*/}
                              <td colSpan={1} className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Poppins" }}>{cnd.returnedQty}</span>
                              </td>
                              <td colSpan={1} className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Poppins" }}>{cnd.jcNo.unit}</span>
                              </td>
                              <td colSpan={1} className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Poppins" }}>{cnd.unitRate}</span>
                              </td>
                              <td colSpan={2} className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Poppins" }}>
                                    <NumberFormat
                                       thousandsGroupStyle="lakh"
                                       value = {Number(cnd.creditLineValue).toFixed(2)}
                                       decimalSeparator="."
                                       displayType="text"
                                       type="text"
                                       thousandSeparator={true}
                                       allowNegative={true} 
                                    />
                                 </span>
                              </td>
                           </tr>
                        )
                     ):(null)}
                        {tableArray.length > 0 ?(
                           tableArray.map((t, index) => 
                              <tr key={index} style={{ backgroundColor:"white", height:"35px" }}>
                                 <td colSpan={1} style={{...tableStyle, color:"white"}}>{index}</td>
                                 <td colSpan={5} style={{...tableStyle}}></td>
                                 <td colSpan={1} style={{...tableStyle}}></td>
                                 {/*<td colSpan={1} style={{...tableStyle}}></td>*/}
                                 <td colSpan={1} style={{...tableStyle}}></td>
                                 <td colSpan={1} style={{...tableStyle}}></td>
                                 <td colSpan={1} style={{...tableStyle}}></td>
                                 <td colSpan={2} style={{...tableStyle}}></td>
                              </tr>
                           )
                        ):(null)}
                     <tr>
                        <td colSpan={12} style={{...tableStyle, height:"5px"}}></td>
                     </tr>
                     <tr>
                        <td colSpan={1} style={{...tableStyle}}></td>
                        <td colSpan={9} style={{...tableStyle}}>
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Poppins" }}>
                                 <span style={{ fontFamily:"Poppins" }}>Total Amount (₹)</span>
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Poppins"}}>
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {
                                       creditNote.creditNoteTotalAmount!==undefined?
                                          creditNote.creditNoteTotalAmount.toFixed(2):"0.00"
                                       }
                                    decimalSeparator="."
                                    displayType="text"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={true} 
                                 />
                              </span>
                           </div>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={1} style={{...tableStyle}}></td>
                        <td colSpan={9} style={{...tableStyle}}>
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Poppins" }}>
                              Output CGST (₹)
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Poppins" }}>{creditNote!==undefined?
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {
                                       creditNote.creditNoteTotalCGSTAmount!==undefined?
                                       creditNote.creditNoteTotalCGSTAmount.toFixed(2):"0.00"
                                    }
                                    decimalSeparator="."
                                    displayType="text"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={true} 
                                 />:"0.00"}</span>
                           </div>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={1} style={{...tableStyle}}></td>
                        <td colSpan={9} style={{...tableStyle}}>
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Poppins" }}>
                              Output SGST (₹)
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Poppins" }}>{creditNote!==undefined?
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {
                                       creditNote.creditNoteTotalSGSTAmount!==undefined?
                                       creditNote.creditNoteTotalSGSTAmount.toFixed(2):"0.00"
                                    }
                                    decimalSeparator="."
                                    displayType="text"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={true} 
                                 />:"0.00"}</span>
                           </div>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={1} style={{...tableStyle}}></td>
                        <td colSpan={9} style={{...tableStyle}}>
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Poppins" }}>
                                 Output IGST (₹)
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Poppins" }}>
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {supplierAndBuyerStateCodeMatching?"0.00":Number(creditNote.creditNoteTotalIGSTAmount).toFixed(2)}
                                    decimalSeparator="."
                                    displayType="text"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={true} 
                                 />
                              </span>
                           </div>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={1} style={{...tableStyle}}></td>
                        <td colSpan={9} style={{...tableStyle}}>
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Poppins", fontSize:"15px", fontWeight:"bold"  }}>
                              Total Invoice Amount (₹)
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Poppins",  fontSize:"15px", fontWeight:"bold" }}>
                              {creditNote!==undefined?
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {(
                                             Number(creditNote.creditNoteTotalAmount)+
                                             Number(creditNote.creditNoteTotalCGSTAmount)+
                                             Number(creditNote.creditNoteTotalSGSTAmount)+
                                             Number(creditNote.creditNoteTotalIGSTAmount)).toFixed(2)
                                          }
                                    decimalSeparator="."
                                    displayType="text"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={true} 
                                 />:""}
                              </span>
                           </div>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={1} style={{...tableStyle}}></td>
                        <td colSpan={5} style={{...tableStyle}}>
                           <div style={{ textAlign:"center", fontFamily:"Poppins" }}>
                              Total Invoice Amount (₹) (in words): 
                           </div>
                        </td>
                        <td colSpan={6} style={{...tableStyle}}>
                           <span style={{ float:"right", marginRight:"5px", fontFamily:"Poppins"  }}>
                              {toWords.convert(creditNote.creditNoteTotalAmount!==undefined?(creditNote.creditNoteTotalAmount+creditNote.creditNoteTotalAmount*0.18).toFixed(2):0)}
                           </span>
                        </td>
                     </tr>
                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"5px" }}></td>
                     </tr>
                     
                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"10px" }}></td>
                     </tr>

                     <tr style={{ backgroundColor: "lightgray"}}>
                        <td rowspan="2" style={{...tableStyle}}></td>
                        <td colSpan={1} rowspan="2" className="center-align" style={{ ...tableStyle, fontFamily:"Poppins"  }}>
                           HSN/SAC CODE
                        </td>
                        <td colSpan={2} rowspan="2" className="center-align" style={{ ...tableStyle, fontFamily:"Poppins"  }}>
                           Taxable Value (₹)
                        </td>
                        <td colSpan={2} className="center-align" style={{ ...tableStyle, fontFamily:"Poppins"  }}>CGST</td>
                        <td colSpan={2} className="center-align" style={{ ...tableStyle, fontFamily:"Poppins"  }}>SGST</td>
                        <td colSpan={2} className="center-align" style={{ ...tableStyle, fontFamily:"Poppins"  }}>IGST</td>
                        <td colSpan={2} rowspan="2" className="center-align" style={{ ...tableStyle, fontFamily:"Poppins"  }}>Total Tax Amount (₹)</td>
                     </tr>

                     <tr style={{ backgroundColor: "lightgray" }}>
                        <td className="center-align" style={{ ...tableStyle, width:"90px", fontFamily:"Poppins"  }}>Rate</td>
                        <td className="center-align" style={{ ...tableStyle, fontFamily:"Poppins"  }} >Amount (₹)</td>
                        <td className="center-align" style={{ ...tableStyle, width:"90px", fontFamily:"Poppins"  }}>Rate</td>
                        <td className="center-align" style={{ ...tableStyle, fontFamily:"Poppins"  }} >Amount (₹)</td>
                        <td className="center-align" style={{ ...tableStyle, width:"90px", fontFamily:"Poppins"  }}>Rate</td>
                        <td className="center-align" style={{ ...tableStyle, width:"100px", fontFamily:"Poppins"  }}>Amount (₹)</td>
                     </tr>
                     {nama.map((hd, index) =>                      
                        <tr key={index}>
                           <td style={{...tableStyle}}></td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Poppins"  }}>{hd.hsncode}</span>
                           </td>
                           <td colSpan={2} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Poppins"  }}>
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = { hd.taxValue }
                                    decimalSeparator="."
                                    displayType="text"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={true} 
                                 />
                              </span>
                           </td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Poppins" }}>
                                 {!supplierAndBuyerStateCodeMatching?"-":hd.cgstrate}
                              </span>
                           </td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Poppins" }}>
                                 {!supplierAndBuyerStateCodeMatching?0.00:(<NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = { (hd.cgstAmt).toFixed(2) }
                                    decimalSeparator="."
                                    displayType="text"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={true} 
                                 />)}
                              </span>
                           </td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Poppins" }}>
                                 {!supplierAndBuyerStateCodeMatching?"-":hd.sgstrate}
                              </span>
                           </td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Poppins" }}>
                                 {!supplierAndBuyerStateCodeMatching?0.00:(<NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = { (hd.sgstAmt).toFixed(2) }
                                    decimalSeparator="."
                                    displayType="text"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={true} 
                                 />)} 
                              </span>
                           </td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Poppins" }}>
                                 {supplierAndBuyerStateCodeMatching?"-":hd.igstrate}
                              </span>
                           </td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Poppins" }}>
                                 {supplierAndBuyerStateCodeMatching?0.00:(<NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = { (hd.igstAmt).toFixed(2) }
                                    decimalSeparator="."
                                    displayType="text"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={true} 
                                 />)} 
                              </span>
                           </td>
                           <td colSpan={2} className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Poppins" }}>
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
                                 </span>
                           </td>
                        </tr>
                     )}
                     <tr>
                        <td style={{...tableStyle}}></td>
                        <td colSpan={1} style={{...tableStyle}}>
                           <span style={{ float:"right", marginRight:"5px", fontFamily:"Poppins" }}>Total</span>
                        </td>
                        <td colSpan={2} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Poppins" }}>
                              <NumberFormat
                                 thousandsGroupStyle="lakh"
                                 value = {
                                    creditNote.creditNoteTotalAmount!==undefined?
                                       creditNote.creditNoteTotalAmount.toFixed(2):"0.00"
                                    }
                                 decimalSeparator="."
                                 displayType="text"
                                 type="text"
                                 thousandSeparator={true}
                                 allowNegative={true} 
                              />
                           </span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Poppins" }}>-</span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Poppins" }}>
                              {creditNote.creditNoteTotalCGSTAmount!==undefined?
                                ( creditNote.creditNoteTotalCGSTAmount).toFixed(2):0}
                           </span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Poppins" }}>-</span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Poppins" }}>
                              {creditNote.creditNoteTotalSGSTAmount!==undefined?
                                 (creditNote.creditNoteTotalSGSTAmount).toFixed(2):0}
                           </span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Poppins" }}>-</span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Poppins" }}>
                              <NumberFormat
                                 thousandsGroupStyle="lakh"
                                 value = {(creditNote.creditNoteTotalIGSTAmount!==undefined?
                                    creditNote.creditNoteTotalIGSTAmount:0).toFixed(2)}
                                 decimalSeparator="."
                                 displayType="text"
                                 type="text"
                                 thousandSeparator={true}
                                 allowNegative={true} 
                              />
                           </span>
                        </td>
                        <td colSpan={2} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Poppins" }}>
                              <NumberFormat
                                 thousandsGroupStyle="lakh"
                                 value = {Number(creditNote.creditNoteTotalTaxAmount!==undefined?creditNote.creditNoteTotalTaxAmount:0).toFixed(2)}
                                 decimalSeparator="."
                                 displayType="text"
                                 type="text"
                                 thousandSeparator={true}
                                 allowNegative={true} 
                              />
                           </span>
                        </td>
                     </tr>
                  

                     <tr>
                        <td colSpan={1} style={{...tableStyle}}></td>
                        <td colSpan={5} style={{...tableStyle}}>
                           <div className="center-align" style={{ fontFamily:"Poppins" }}>
                              Total Tax Amount (₹) (in words): 
                           </div>
                        </td>
                        <td colSpan={6} style={{...tableStyle}}>
                           <span style={{ marginLeft: "5px", fontFamily:"Poppins" }}>
                              {toWords.convert(creditNote.creditNoteTotalTaxAmount!==undefined?creditNote.creditNoteTotalTaxAmount:0)}
                           </span>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"5px", fontFamily:"Poppins" }}></td>
                     </tr>
                     
                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"10px" }}></td>
                     </tr>

                     <tr style={{ backgroundColor: "lightgray" }}>
                        <td colSpan="4" style={{...tableStyle}}>
                           <div style={{ marginLeft: "10px", fontFamily:"Poppins" }}>
                              {/*Bank Details*/}&nbsp;
                           </div>
                        </td>
                        <td colSpan="4" className="center-align" style={{ ...tableStyle, fontFamily:"Poppins" }}>
                           Declaration
                        </td>
                        <td colSpan="4" className="center-align" style={{ ...tableStyle, fontFamily:"Poppins" }}>
                           Authorised Signature & Stamp
                        </td>
                     </tr>

                     <tr>
                        <td colSpan="4" style={{...tableStyle}}>
                           <div style={{ marginLeft: "10px", fontFamily:"Poppins" }}>
                              {/*Beneficiary: {creditNote!==undefined && creditNote.customer 
                              !== undefined?creditNote.customer.custName:""} <br /> */}
                              &nbsp;
                           </div>
                        </td>

                        <td colSpan="4" className="center-align" style={{...tableStyle}}>
                           <div style={{ fontFamily:"Poppins" }}>
                              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                           </div>
                           <br />
                           {/*<div style={{ backgroundColor: "lightgray", color: "black", fontFamily:"Poppins" }}>
                                 Payment Terms: {creditNote.paymentTerms === undefined?"Within 30 Days":creditNote.paymentTerms}
                           </div>*/}
                        </td>

                        <td colSpan={4} style={{...tableStyle}}>
                           <div style={{textAlign:"center", fontFamily:"Poppins"}}>
                              <Image src={sign} style={{width:"25%"}} fluid />
                           </div>
                        </td>
                     </tr> 

                     <tr style={{ borderBottom:"hidden", borderLeft:"hidden", borderRight:"hidden" }}>
                        <td colSpan="4" style={{ ...tableStyle,  borderBottom:"hidden", borderLeft:"hidden", borderRight:"hidden" }}>
                           <div style={{ marginLeft: "0px" }}>
                              <span style={{ fontFamily:"Poppins",  float: "left" }}>www.decaltech.in</span>
                           </div>
                        </td>
                        <td colSpan="4" className="center-align" style={{ ...tableStyle,  borderBottom:"hidden", borderLeft:"hidden", borderRight:"hidden" }}>
                           <span style={{ fontFamily:"Poppins" }}>info@decaltech.in</span> 
                        </td>
                        <td colSpan="4" className="center-align" style={{ ...tableStyle,  borderBottom:"hidden", borderLeft:"hidden", borderRight:"hidden" }}>
                           <span  style={{ float: "right" }}>Page 1 of 1</span>
                        </td>
                     </tr>

                  </table>
               </div>
         </PrinterWrapper>
      </React.Fragment>

      )}
   </React.Fragment>
   )
}

export default CreditNotePrintScreen
