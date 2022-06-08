import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSalesInvoiceDetails } from '../../actions/sales/salesInvoiceActions';

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

const SalesInvoiceEditScreen = ({ match, history }) => {
   
   const salesInvoiceId = match.params.id;

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const salesInvoiceData = useSelector((state) => state.salesInvoiceDetails)

   const { loading, salesInvoice, error } = salesInvoiceData;
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
      if (salesInvoice._id !== salesInvoiceId) {
         dispatch(getSalesInvoiceDetails(salesInvoiceId))
      } else {
         if(salesInvoice.supplierAddress !== undefined && salesInvoice.supplierAddress.length > 0) {
            setSupplierAddressLine1(salesInvoice.supplierAddress[0].addressLine1);
            setSupplierAddressLine2(salesInvoice.supplierAddress[0].addressLine2);
            setSupplierAddressLine3(salesInvoice.supplierAddress[0].addressLine3);
            setState(salesInvoice.supplierAddress[0].state);
            setCity(salesInvoice.supplierAddress[0].city);
            setDistrict(salesInvoice.supplierAddress[0].district);
            setPinCode(salesInvoice.supplierAddress[0].pinCode);
         }

         if(salesInvoice.customerBillingAddress !== undefined && salesInvoice.customerBillingAddress.length > 0) {
            setCustomerBillingAddressLine1(salesInvoice.customerBillingAddress[0].addressLine1);
            setCustomerBillingAddressLine2(salesInvoice.customerBillingAddress[0].addressLine2);
            setCustomerBillingAddressLine3(salesInvoice.customerBillingAddress[0].addressLine3);
            setBillingAddressState(salesInvoice.customerBillingAddress[0].state);
            setBillingAddressCity(salesInvoice.customerBillingAddress[0].city);
            setBillingAddressDistrict(salesInvoice.customerBillingAddress[0].district);
            setBillingAddressPinCode(salesInvoice.customerBillingAddress[0].pinCode);
         } else {
            if(salesInvoice!==undefined && salesInvoice.customer 
               && salesInvoice.customer.custBillingAddress !== undefined) {
                  setCustomerBillingAddressLine1(salesInvoice.customer.custBillingAddress[0].custBillAddressLine1);
                  setCustomerBillingAddressLine2(salesInvoice.customer.custBillingAddress[0].custBillAddressLine2);
                  setCustomerBillingAddressLine3(salesInvoice.customer.custBillingAddress[0].custBillAddressLine3);
                  setBillingAddressState(salesInvoice.billState);
                  setBillingAddressCity(salesInvoice.customer.custBillingAddress[0].custBillCity);
                  setBillingAddressDistrict(salesInvoice.customer.custBillingAddress[0].custBillDistrict);
                  setBillingAddressPinCode(salesInvoice.customer.custBillingAddress[0].custBillPinCode);
            }
         }

         if(salesInvoice.customerShipingAddress !== undefined && salesInvoice.customerShipingAddress.length > 0) {
            setCustomerShipingAddressLine1(salesInvoice.customerShipingAddress[0].addressLine1);
            setCustomerShipingAddressLine2(salesInvoice.customerShipingAddress[0].addressLine2);
            setCustomerShipingAddressLine3(salesInvoice.customerShipingAddress[0].addressLine3);
            setShipingAddressState(salesInvoice.customerShipingAddress[0].state);
            setShipingAddressCity(salesInvoice.customerShipingAddress[0].city);
            setShipingAddressDistrict(salesInvoice.customerShipingAddress[0].district);
            setShipingAddressPinCode(salesInvoice.customerShipingAddress[0].pinCode);
         } else {
            if(salesInvoice!==undefined && salesInvoice.customer 
               && salesInvoice.customer.custShipingAddress !== undefined) {
                  setCustomerShipingAddressLine1(salesInvoice.customer.custShipingAddress[0].custShipAddressLine1);
                  setCustomerShipingAddressLine2(salesInvoice.customer.custShipingAddress[0].custShipAddressLine2);
                  setCustomerShipingAddressLine3(salesInvoice.customer.custShipingAddress[0].custShipAddressLine3);
                  setShipingAddressState(salesInvoice.billState);
                  setShipingAddressCity(salesInvoice.customer.custShipingAddress[0].custShipCity);
                  setShipingAddressDistrict(salesInvoice.customer.custShipingAddress[0].custShipDistrict);
                  setShipingAddressPinCode(salesInvoice.customer.custShipingAddress[0].custShipPinCode);
            }
         }
      }
   }, [history, salesInvoice]);

   /** variable for GST calculations - START */
   let tableArray = [];
   let nama = [];
   let hsnArray = [];
   let sellerStateCode = 27;
   let buyerStateCode = "";
   let supplierAndBuyerStateCodeMatching = false;
   /** variable for GST calculations - END */

   
   const fontFamily = {
      fontFamily: "Arial"
   }

   if(!loading) {
      if(salesInvoice!==undefined) {
         if(salesInvoice.customer !== undefined) {
            buyerStateCode = parseInt(salesInvoice.customer.custGST.substring(0,2))
         }
      } 
      if(salesInvoice.salesInvoiceDetails !== undefined) {
         let salesInvoiceNos = salesInvoice.salesInvoiceDetails.length;
         let rowsOnInvoicePrint = 12;
         if(salesInvoiceNos > 8) {
            rowsOnInvoicePrint = 10;
         }
         let noOfTableRows = rowsOnInvoicePrint-salesInvoiceNos;
         for( let i = 0 ; i < noOfTableRows ; i++ ) {
            tableArray.push({newKey: i});
         }
         //gst = salesInvoice.salesInvoiceDetails[0].hsnDetails.gstRate
         
         //check what all HSN are present in the SI Details
         let n = 0;
         for (const sid of salesInvoice.salesInvoiceDetails) {
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
                  kama.taxValue = sid.salesInvoiceLineValue;
                  kama.cgstrate = (sid.cgstAmt/sid.salesInvoiceLineValue)*100 //sid.hsnDetails.cgstRate;
                  kama.cgstAmt = sid.cgstAmt;
                  kama.sgstrate = (sid.sgstAmt/sid.salesInvoiceLineValue)*100 //sid.hsnDetails.sgstRate;
                  kama.sgstAmt = sid.sgstAmt;
                  kama.igstrate = (sid.igstAmt/sid.salesInvoiceLineValue)*100 //sid.hsnDetails.igstRate;
                  kama.igstAmt = sid.igstAmt;
                  kama.totalTax = parseFloat(sid.cgstAmt)+parseFloat(sid.sgstAmt)+parseFloat(sid.igstAmt);
                  nama.push(kama)
                  /** */

               } else {
                  let cama = nama[hsnArray.indexOf(sid.hsnDetails.hsnCode)]
                  cama.igstAmt += sid.igstAmt;
                  cama.cgstAmt += sid.cgstAmt;
                  cama.sgstAmt += sid.sgstAmt;
                  cama.taxValue += sid.salesInvoiceLineValue
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
      // fontFamily:"Arial",
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
                           <div style={{textAlign:"right", fontFamily:"Arial"}}>
                              <Image src={logo} style={{width:"25%"}} fluid />
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, backgroundColor: "lightgray"}}>
                           <div style={{ textAlign:"center", fontFamily:"Arial" }}>
                              <b><span style={{ fontFamily:"Arial", color:"black", fontSize:"25px", fontWeight:"bold" }} >TAX INVOICE</span></b>
                           </div>                        
                        </td>
                     </tr>
                     <tr>
                        <td colSpan="6" style={{...tableStyle}}>
                           <div style={{ marginLeft: "10px", fontFamily:"Arial", textAlign:"left" }}>
                              <span style={{fontWeight:"bold", fontFamily:"Arial"}}>DECAL TECH PRIVATE LIMITED</span>
                              <br />
                              {supplierAddressLine1}<br/>
                              {supplierAddressLine2}<br/>
                              {supplierAddressLine3}<br /> 
                              State: {state} | Code 27&nbsp;&nbsp;&nbsp;GSTIN: 27AAGCD4662E1ZP	
                           </div>
                        </td>
                        <td colSpan="6" style={{...tableStyle}}>
                           <div style={{ textAlign:"left", marginBottom:"5px", marginLeft:"10px", fontFamily:"Arial" }}>
                                 <span style={{fontWeight:"bold", fontFamily:"Arial"}}>INVOICE DETAILS</span>
                                 <br />
                                 Invoice #: <span style={{ fontFamily:"Arial" }}>{salesInvoice.salesInvoiceNumber}</span>
                                 <br />
                                 Invoice Date: <span style={{ fontFamily:"Arial" }}>{salesInvoice.salesInvoiceDate !== undefined?format(new Date(salesInvoice.salesInvoiceDate), 'dd-MMM-yyyy'):null }</span>
                                 <br />
                                 Invoice Amount: (₹) <span style={{ fontFamily:"Arial" }}>
                                 <NumberFormat
                                       thousandsGroupStyle="lakh"
                                       value = {Number(salesInvoice.salesInvoiceTotalAmountWithTax).toFixed(2)}
                                       decimalSeparator="."
                                       displayType="text"
                                       type="text"
                                       thousandSeparator={true}
                                       allowNegative={true} 
                                    /></span>
                                 <br />
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
                           <div style={{ textAlign:"left", marginLeft:"10px", fontFamily:"Arial" }}>
                              Details of Reciever (Bill To)
                           </div>
                        </td>
                        <td colSpan="6" style={{ ...tableStyle, backgroundColor: "lightgray"}}>
                           <div style={{ textAlign:"left", marginLeft:"10px", fontFamily:"Arial" }}>
                              Details of Consignee (Ship To)
                           </div>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan="6" style={{...tableStyle}}>
                           <div  style={{ textAlign:"left", marginBottom:"5px", marginLeft:"10px", marginTop:"5px" }}>
                              <b><span style={{ fontFamily:"Arial", fontWeight:"bold" }}>{salesInvoice!==undefined && salesInvoice.customer !== undefined?salesInvoice.customer.custName:""}</span></b>
                              <br />
                              <span style={{ fontFamily:"Arial" }}>
                                 {
                                    customerBillingAddressLine1+" "+
                                    customerBillingAddressLine2+" "+
                                    customerBillingAddressLine3
                                 } 
                              </span>
                              &nbsp;
                              <br />
                              <span style={{ fontFamily:"Arial" }}>State Code:</span>
                              <span style={{ fontFamily:"Arial" }}>{buyerStateCode<10?"0"+buyerStateCode:buyerStateCode}</span>
                              <span style={{ fontFamily:"Arial" }}> Place of Supply: {billingAddressState}</span><br></br>
                              <span style={{ fontFamily:"Arial" }}>GSTIN/UIN: </span>
                              <span style={{ fontFamily:"Arial" }}>{salesInvoice!==undefined && salesInvoice.customer !== undefined? salesInvoice.customer.custGST:""}</span><br></br>
                              <span style={{ fontFamily:"Arial" }}>{salesInvoice!==undefined && salesInvoice.customer !== undefined? "Contact: "+salesInvoice.customer.custContactPersonName+" (Cell: "+salesInvoice.customer.custContactPersonNumber+")":""}</span>
                           </div>
                        </td>
                        <td colSpan="6" style={{...tableStyle}}>
                           <div  style={{ textAlign:"left", marginBottom:"5px", marginLeft:"10px", marginTop:"5px" }}>
                              <b><span style={{ fontFamily:"Arial", fontWeight:"bold" }}>{salesInvoice!==undefined && salesInvoice.customer !== undefined?salesInvoice.customer.custName:""}</span></b>
                              <br />
                              <span style={{ fontFamily:"Arial" }}>
                                 {
                                    customerShipingAddressLine1+" "+
                                    customerShipingAddressLine2+" "+
                                    customerShipingAddressLine3
                                 }  
                              </span>
                              &nbsp;
                              <br />
                              <span style={{ fontFamily:"Arial" }}>State Code:</span>
                              <span style={{ fontFamily:"Arial" }}>{buyerStateCode<10?"0"+buyerStateCode:buyerStateCode}</span>
                              <span style={{ fontFamily:"Arial" }}> Place of Supply: {shipingAddressState}</span><br></br>
                              <span style={{ fontFamily:"Arial" }}>GSTIN/UIN: </span>
                              <span style={{ fontFamily:"Arial" }}>{salesInvoice!==undefined && salesInvoice.customer !== undefined? salesInvoice.customer.custGST:""}</span><br></br>
                              <span style={{ fontFamily:"Arial" }}>{salesInvoice!==undefined && salesInvoice.customer !== undefined? "Contact: "+salesInvoice.customer.custContactPersonName+" (Cell: "+salesInvoice.customer.custContactPersonNumber+")":""}</span>
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
                        <td className="col-3" style={{ ...tableStyle, textAlign:"center", fontFamily:"Arial" }}>
                           <span style={{ fontFamily:"Arial" }}>#</span>
                        </td>
                        <td colSpan={4} style={{...tableStyle}}>
                        <span style={{ marginLeft:"10px", fontFamily:"Arial" }}>Description of Goods/Services</span>
                        </td>

                        <td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Arial" }}>
                           <span style={{ fontFamily:"Arial" }}>HSN / SAC</span>
                        </td>

                        <td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Arial" }}>
                           <span style={{ fontFamily:"Arial" }}>Batch Date</span>
                        </td>

                        <td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Arial" }}>
                           <span style={{ fontFamily:"Arial" }}>Qty</span>
                        </td>

                        <td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Arial" }}>
                           <span >Unit</span>
                        </td>

                        <td colSpan={1} style={{ ...tableStyle, textAlign:"center", fontFamily:"Arial" }}>
                           <span style={{ fontFamily:"Arial" }}>Rate (₹)</span>
                        </td>

                        <td colSpan={2} style={{ ...tableStyle, textAlign:"center", fontFamily:"Arial" }}>
                           <span style={{ fontFamily:"Arial" }}>Amount (₹)</span>
                        </td>
                     </tr>
                     {salesInvoice!==undefined && salesInvoice.salesInvoiceDetails !==undefined?(
                        salesInvoice.salesInvoiceDetails.map((drd, index) => 
                           <tr key={index} style={{ backgroundColor:"white" }}>
                              <td className="col-3" className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Arial" }}>{index+1}</span>
                              </td>
                              <td colSpan={4} style={{...tableStyle, textAlign:"left"}}>
                                 <span style={{ fontFamily:"Arial", textAlign:"left" }}>{drd.jcNo.jcDescription}</span><br></br>
                                 <span style={{ fontFamily:"Arial" }}>
                                    <span style={{fontWeight:"bold", textAlign:"left", fontSize:"12px", fontFamily:"Arial"}}>Item Code:</span> 
                                       <span style={{ fontSize:"12px", fontFamily:"Arial" }}>{drd.jcNo.customerPartNumber}</span>
                                    </span>&nbsp;&nbsp;
                                    <span style={{fontWeight:"bold"}}> | </span> 
                                    &nbsp;&nbsp;
                                 <span style={{ fontFamily:"Arial" }}>
                                    <span style={{fontWeight:"bold", fontSize:"12px", fontFamily:"Arial"}}>PO#:</span> 
                                    <span style={{ fontSize:"12px", fontFamily:"Arial" }}>{drd.soNo.poNumber}</span>
                                 </span>
                              </td>
                              <td colSpan={1} style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Arial" }}>{drd.jcNo.hsn}</span>
                              </td>
                              <td colSpan={1} style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Arial" }}>{drd.batchDate !== undefined?format(new Date(drd.batchDate), 'dd-MMM-yy'):null}</span>
                              </td>
                              <td colSpan={1} className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Arial" }}>{drd.dispatchQty}</span>
                              </td>
                              <td colSpan={1} className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Arial" }}>{drd.jcNo.unit}</span>
                              </td>
                              <td colSpan={1} className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Arial" }}>{drd.salesInvoiceUnitRate}</span>
                              </td>
                              <td colSpan={2} className="center-align" style={{...tableStyle}}>
                                 <span style={{ fontFamily:"Arial" }}>
                                    <NumberFormat
                                       thousandsGroupStyle="lakh"
                                       value = {Number(drd.salesInvoiceLineValue).toFixed(2)}
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
                                 <td colSpan={4} style={{...tableStyle}}></td>
                                 <td colSpan={1} style={{...tableStyle}}></td>
                                 <td colSpan={1} style={{...tableStyle}}></td>
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
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Arial" }}>
                                 <span style={{ fontFamily:"Arial" }}>Total Amount (₹)</span>
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Arial"}}>
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {
                                       salesInvoice.salesInvoiceTotalAmount!==undefined?
                                          salesInvoice.salesInvoiceTotalAmount.toFixed(2):"0.00"
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
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Arial" }}>
                              Output CGST (₹)
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Arial" }}>{salesInvoice!==undefined?
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {
                                       salesInvoice.salesInvoiceTotalCGSTAmount!==undefined?
                                       salesInvoice.salesInvoiceTotalCGSTAmount.toFixed(2):"0.00"
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
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Arial" }}>
                              Output SGST (₹)
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Arial" }}>{salesInvoice!==undefined?
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {
                                       salesInvoice.salesInvoiceTotalSGSTAmount!==undefined?
                                       salesInvoice.salesInvoiceTotalSGSTAmount.toFixed(2):"0.00"
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
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Arial" }}>
                                 Output IGST (₹)
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Arial" }}>
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {supplierAndBuyerStateCodeMatching?"0.00":Number(salesInvoice.salesInvoiceTotalIGSTAmount).toFixed(2)}
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
                           <div style={{ float:"right", marginRight:"5px", fontFamily:"Arial", fontSize:"15px", fontWeight:"bold"  }}>
                              Total Invoice Amount (₹)
                           </div>
                        </td>
                        <td colSpan={2} style={{...tableStyle, textAlign:"right"}}>
                           <div>
                              <span style={{ fontFamily:"Arial",  fontSize:"15px", fontWeight:"bold" }}>
                              {salesInvoice!==undefined?
                                 <NumberFormat
                                    thousandsGroupStyle="lakh"
                                    value = {(
                                             Number(salesInvoice.salesInvoiceTotalAmount)+
                                             Number(salesInvoice.salesInvoiceTotalCGSTAmount)+
                                             Number(salesInvoice.salesInvoiceTotalSGSTAmount)+
                                             Number(salesInvoice.salesInvoiceTotalIGSTAmount)).toFixed(2)
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
                        <td colSpan={4} style={{...tableStyle}}>
                           <div style={{ textAlign:"center", fontFamily:"Arial" }}>
                              Total Invoice Amount (₹) (in words): 
                           </div>
                        </td>
                        <td colSpan={7} style={{...tableStyle}}>
                           <span style={{ float:"right", marginRight:"5px", fontFamily:"Arial"  }}>
                              {toWords.convert(salesInvoice.salesInvoiceTotalAmount!==undefined?(salesInvoice.salesInvoiceTotalAmount+salesInvoice.salesInvoiceTotalAmount*0.18).toFixed(2):0)}
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
                        <td colSpan={1} rowspan="2" className="center-align" style={{ ...tableStyle, fontFamily:"Arial"  }}>
                           HSN/SAC CODE
                        </td>
                        <td colSpan={2} rowspan="2" className="center-align" style={{ ...tableStyle, fontFamily:"Arial"  }}>
                           Taxable Value (₹)
                        </td>
                        <td colSpan={2} className="center-align" style={{ ...tableStyle, fontFamily:"Arial"  }}>CGST</td>
                        <td colSpan={2} className="center-align" style={{ ...tableStyle, fontFamily:"Arial"  }}>SGST</td>
                        <td colSpan={2} className="center-align" style={{ ...tableStyle, fontFamily:"Arial"  }}>IGST</td>
                        <td colSpan={2} rowspan="2" className="center-align" style={{ ...tableStyle, fontFamily:"Arial"  }}>Total Tax Amount (₹)</td>
                     </tr>

                     <tr style={{ backgroundColor: "lightgray" }}>
                        <td className="center-align" style={{ ...tableStyle, width:"90px", fontFamily:"Arial"  }}>Rate</td>
                        <td className="center-align" style={{ ...tableStyle, fontFamily:"Arial"  }} >Amount (₹)</td>
                        <td className="center-align" style={{ ...tableStyle, width:"90px", fontFamily:"Arial"  }}>Rate</td>
                        <td className="center-align" style={{ ...tableStyle, fontFamily:"Arial"  }} >Amount (₹)</td>
                        <td className="center-align" style={{ ...tableStyle, width:"90px", fontFamily:"Arial"  }}>Rate</td>
                        <td className="center-align" style={{ ...tableStyle, width:"100px", fontFamily:"Arial"  }}>Amount (₹)</td>
                     </tr>
                     {nama.map((hd, index) =>                      
                        <tr key={index}>
                           <td style={{...tableStyle}}></td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Arial"  }}>{hd.hsncode}</span>
                           </td>
                           <td colSpan={2} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Arial"  }}>
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
                              <span style={{ fontFamily:"Arial" }}>
                                 {!supplierAndBuyerStateCodeMatching?"-":hd.cgstrate}
                              </span>
                           </td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Arial" }}>
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
                              <span style={{ fontFamily:"Arial" }}>
                                 {!supplierAndBuyerStateCodeMatching?"-":hd.sgstrate}
                              </span>
                           </td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Arial" }}>
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
                              <span style={{ fontFamily:"Arial" }}>
                                 {supplierAndBuyerStateCodeMatching?"-":hd.igstrate}
                              </span>
                           </td>
                           <td colSpan={1} className="center-align" style={{...tableStyle}}>
                              <span style={{ fontFamily:"Arial" }}>
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
                                 <span style={{ fontFamily:"Arial" }}>
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
                           <span style={{ float:"right", marginRight:"5px", fontFamily:"Arial" }}>Total</span>
                        </td>
                        <td colSpan={2} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Arial" }}>
                              <NumberFormat
                                 thousandsGroupStyle="lakh"
                                 value = {
                                    salesInvoice.salesInvoiceTotalAmount!==undefined?
                                       salesInvoice.salesInvoiceTotalAmount.toFixed(2):"0.00"
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
                           <span style={{ fontFamily:"Arial" }}>-</span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Arial" }}>
                              {salesInvoice.salesInvoiceTotalCGSTAmount!==undefined?
                                ( salesInvoice.salesInvoiceTotalCGSTAmount).toFixed(2):0}
                           </span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Arial" }}>-</span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Arial" }}>
                              {salesInvoice.salesInvoiceTotalSGSTAmount!==undefined?
                                 (salesInvoice.salesInvoiceTotalSGSTAmount).toFixed(2):0}
                           </span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Arial" }}>-</span>
                        </td>
                        <td colSpan={1} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Arial" }}>
                              <NumberFormat
                                 thousandsGroupStyle="lakh"
                                 value = {(salesInvoice.salesInvoiceTotalIGSTAmount!==undefined?
                                    salesInvoice.salesInvoiceTotalIGSTAmount:0).toFixed(2)}
                                 decimalSeparator="."
                                 displayType="text"
                                 type="text"
                                 thousandSeparator={true}
                                 allowNegative={true} 
                              />
                           </span>
                        </td>
                        <td colSpan={2} className="center-align" style={{...tableStyle}}>
                           <span style={{ fontFamily:"Arial" }}>
                              <NumberFormat
                                 thousandsGroupStyle="lakh"
                                 value = {Number(salesInvoice.salesInvoiceTotalTaxAmount!==undefined?salesInvoice.salesInvoiceTotalTaxAmount:0).toFixed(2)}
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
                        <td colSpan={4} style={{...tableStyle}}>
                           <div className="center-align" style={{ fontFamily:"Arial" }}>
                              Total Tax Amount (₹) (in words): 
                           </div>
                        </td>
                        <td colSpan={7} style={{...tableStyle}}>
                           <span style={{ marginLeft: "5px", fontFamily:"Arial" }}>
                              {toWords.convert(salesInvoice.salesInvoiceTotalTaxAmount!==undefined?salesInvoice.salesInvoiceTotalTaxAmount:0)}
                           </span>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"5px", fontFamily:"Arial" }}></td>
                     </tr>
                     
                     <tr>
                        <td colSpan={12} style={{ ...tableStyle, height:"10px" }}></td>
                     </tr>

                     <tr style={{ backgroundColor: "lightgray" }}>
                        <td colSpan="4" style={{...tableStyle}}>
                           <div style={{ marginLeft: "10px", fontFamily:"Arial" }}>
                              Bank Details
                           </div>
                        </td>
                        <td colSpan="4" className="center-align" style={{ ...tableStyle, fontFamily:"Arial" }}>
                           Declaration
                        </td>
                        <td colSpan="4" className="center-align" style={{ ...tableStyle, fontFamily:"Arial" }}>
                           Authorised Signature & Stamp
                        </td>
                     </tr>

                     <tr>
                        <td colSpan="4" style={{...tableStyle}}>
                           <div style={{ marginLeft: "10px", fontFamily:"Arial" }}>
                           Beneficiary: Decal Tech Private Limited <br />
                           Bank Name: State Bank of India <br />                    
                           Account No.: 38127978882 <br />
                           IFS Code: SBIN0000489
                           </div>
                        </td>

                        <td colSpan="4" className="center-align" style={{...tableStyle}}>
                           <div style={{ fontFamily:"Arial" }}>
                              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                           </div>
                           <br />
                           <div style={{ backgroundColor: "lightgray", color: "black", fontFamily:"Arial" }}>
                                 Payment Terms: {salesInvoice.paymentTerms === undefined?"Within 30 Days":salesInvoice.paymentTerms}
                           </div>
                        </td>

                        <td colSpan={4} style={{...tableStyle}}>
                           <div style={{textAlign:"center", fontFamily:"Arial"}}>
                              <Image src={sign} style={{width:"25%"}} fluid />
                           </div>
                        </td>
                     </tr> 

                     <tr style={{ borderBottom:"hidden", borderLeft:"hidden", borderRight:"hidden" }}>
                        <td colSpan="4" style={{ ...tableStyle,  borderBottom:"hidden", borderLeft:"hidden", borderRight:"hidden" }}>
                           <div style={{ marginLeft: "0px" }}>
                              <span style={{ fontFamily:"Arial",  float: "left" }}>www.decaltech.in</span>
                           </div>
                        </td>
                        <td colSpan="4" className="center-align" style={{ ...tableStyle,  borderBottom:"hidden", borderLeft:"hidden", borderRight:"hidden" }}>
                           <span style={{ fontFamily:"Arial" }}>sales@decaltech.in</span> 
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

export default SalesInvoiceEditScreen
