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
import logo from './../../assets/DTPL_Logo.jpg'

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';

import { getDeliveryNoteDetails } from '../../actions/production/deliveryNoteActions';
import { Image } from 'react-bootstrap';
import './../css/printinvoice.css';
import PrinterWrapper from './../../components/app/PrinterWrapper';

const ASNScreen = ({ history, location, match }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo, error: errorUser, loading: loadingUser } = userLogin

   const deliveryNoteId = match.params.id;

   const deliveryNoteDetails = useSelector((state) => state.deliveryNoteDetails)
   const { loading, deliveryNote, error } = deliveryNoteDetails;
   console.log("deliveryNote---------------> ", deliveryNote)
   useEffect(() => {
      if (deliveryNote._id !== deliveryNoteId) {
         dispatch(getDeliveryNoteDetails(deliveryNoteId))
      }
   }, [deliveryNoteId, deliveryNote, history]);

   let tableArray = [];
   if(!loading) {
      if(deliveryNote.deliveryDetails !== undefined) {
         let salesInvoiceNos = deliveryNote.deliveryDetails.length;
         let noOfTableRows = 12-salesInvoiceNos;
         for( let i = 0 ; i < noOfTableRows ; i++ ) {
            tableArray.push({newKey: i});
         }
      }
   }

   const handlePrint = () => {
      window.print()
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
      <React.Fragment>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <PrinterWrapper>
                  <div className="page">
                     <table style={{width:"100%", tableLayout:"fixed"}}>
                        <tr>
                           <td colspan="12" style={tableStyle}>
                              <div style={{textAlign:"center", fontFamily:"Arial"}}>
                                 <Image src={logo} style={{width:"25%"}} fluid />
                              </div>
                           </td>
                        </tr>
                        <tr>
                           <td colspan="12" style={{...tableStyle, backgroundColor: "lightgray"}}>
                              <div style={{ textAlign:"center", fontFamily:"Arial" }}>
                                 <b><span style={{ fontFamily:"Arial", color:"black", fontSize:"25px" }} ><b>ADVANCED SHIPMENT NOTICE</b></span></b>
                              </div>                        
                           </td>
                        </tr>
                        <tr>
                           <td colspan="6" style={tableStyle}>
                                 <span style={{ marginLeft:"10px" }} >Customer:</span>
                                 <span style={{ marginLeft:"5px"  }} >{deliveryNote.customer!==undefined?deliveryNote.customer.custName:""}</span>
                           </td>
                           <td colspan="6" style={tableStyle}>
                                 <span style={{ marginLeft:"10px" }} >Transporter:</span>
                                 <span style={{ marginLeft:"5px" }} >{deliveryNote.transporter}</span>
                           </td>
                        </tr>

                        <tr>
                           <td colspan="6" style={tableStyle}>
                              <span style={{ marginLeft:"10px" }} >ASN #:</span>
                              <span style={{ marginLeft:"5px" }} >{deliveryNote.deliveryNumber}</span>
                           </td>

                           <td colspan="6" style={tableStyle}>
                              <span style={{ marginLeft:"10px" }} >ASN Date:</span>
                              <span style={{ marginLeft:"5px" }} >{deliveryNote.dispatchDate!==undefined?format(new Date(deliveryNote.dispatchDate), 'dd-MMM-yyyy'):""}</span>
                           </td>
                           {/*<td colspan="12" style={tableStyle}>
                              <div style={{ textAlign:"center"}} >
                                 <div style={{ textAlign:"center"}}>
                                    <span style={{ textAlign:"center", fontSize:"18px" }}>ASN No.: {deliveryNote.deliveryNumber}</span>
                                    <span  style={{ marginLeft :"40px", fontSize:"18px"  }}>ASN Date:</span>
                                    <span  style={{ marginLeft :"5px", fontSize:"18px"  }}>{deliveryNote.dispatchDate!==undefined?format(new Date(deliveryNote.dispatchDate), 'dd-MMM-yyyy'):""}</span>
                                 </div>
                              </div>                        
                           </td>*/}
                        </tr>

                        <tr>
                           <td colspan="6" style={tableStyle}>
                              <span style={{ marginLeft:"10px" }} >State of Supply:</span>
                              <span style={{ marginLeft:"5px" }} >{deliveryNote.salesInvoiceNumber!==undefined?deliveryNote.salesInvoiceNumber.billState:""}</span>
                           </td>

                           <td colspan="6" style={tableStyle}>
                              <span style={{ marginLeft:"10px" }} >Docket/LR no.:</span>
                              <span style={{ marginLeft:"5px" }} >{deliveryNote.docketNumber}</span>
                           </td>
                        </tr>

                        <tr>
                           <td colspan="6" style={tableStyle} >
                              <span style={{ marginLeft:"10px" }} >Ref. Invoice No.:</span>
                              <span style={{ marginLeft:"5px" }} >{deliveryNote.salesInvoiceNumber!==undefined?deliveryNote.salesInvoiceNumber.salesInvoiceNumber:""}</span>
                           </td>
                           <td colspan="6" style={tableStyle}>
                              <span style={{ marginLeft:"10px" }} >Docket/LR Date:</span>
                              <span style={{ marginLeft:"5px" }} >{deliveryNote.docketDate!==undefined?format(new Date(deliveryNote.docketDate), 'dd-MMM-yyyy'):""}</span>
                           </td>
                        </tr>

                        <tr>
                           <td colspan="6" style={tableStyle}>
                              <span style={{ marginLeft:"10px" }} >Ref. Invoice Date:</span>
                              <span style={{ marginLeft:"5px" }} >{deliveryNote.salesInvoiceNumber!==undefined?format(new Date(deliveryNote.salesInvoiceNumber.salesInvoiceDate), 'dd-MMM-yyyy'):""}</span>
                           </td>
                           <td colspan="6" style={tableStyle}>
                              <span style={{ marginLeft:"10px" }} >Mode of Transport:</span>
                              <span style={{ marginLeft:"5px" }} >{deliveryNote.modeOfTransport}</span>
                           </td>
                        </tr>

                        <tr>
                           <td colspan="12" style={{ ...tableStyle, height:"5px" }} ></td>
                        </tr>

                        <tr>
                           <td colspan="12" style={{ ...tableStyle, height: "10px" }} ></td>
                        </tr>

                        <tr>
                           <td colspan="1" style={{ ...tableStyle, textAlign: "center" }}>
                              <span>SN</span>
                           </td>
                           <td colspan="5" style={tableStyle}>
                              <span style={{ marginLeft:"5px"}}>Description of Goods</span>
                           </td>
                           <td colspan="1" style={{ ...tableStyle, textAlign: "center" }}>
                              <span>Quantity</span>
                           </td>
                           <td colspan="2" style={{ ...tableStyle, textAlign: "center" }}>
                                 <span>Batch No</span>
                           </td>
                           <td colspan="2" style={{ ...tableStyle, textAlign: "center" }}>
                                 <span>PO Reference</span>
                           </td>
                           <td colspan="1" style={{ ...tableStyle, textAlign: "center" }}>
                                 <span>Box No</span>
                           </td>
                        </tr>
                        {deliveryNote!==undefined && deliveryNote.deliveryDetails !==undefined?(
                           deliveryNote.deliveryDetails.map((dnd, index) => 
                              <tr key={index} style={{ backgroundColor:"white" }}>
                                 <td colspan="1" style={{ ...tableStyle, textAlign: "center" }}>
                                    <span>{index+1}</span>
                                 </td>
                                 <td colspan="5" style={tableStyle}>
                                    <span style={{ marginLeft: "5px" }}>{dnd.descriptionOfGoods}</span>
                                 </td>
                                 <td colspan="1" style={{ ...tableStyle, textAlign: "center" }}>
                                    <span>{dnd.quantity}</span>
                                 </td>
                                 <td colspan="2" style={{ ...tableStyle, textAlign: "center" }}>
                                    <span>{dnd.batchDate!==undefined?format(new Date(dnd.batchDate), 'dd-MMM-yyyy'):null}</span>
                                 </td>
                                 <td colspan="2" style={{ ...tableStyle, textAlign: "center" }}>
                                    <span>{dnd.poNumber}</span>
                                 </td>
                                 <td colspan="1" style={{ ...tableStyle, textAlign: "center" }}>
                                    <span>{dnd.boxNumber}</span>
                                 </td>
                              </tr>
                           )
                        ):(null)}
                           {tableArray.length > 0 ?(
                              tableArray.map((t, index) => 
                                 <tr key={index} style={{ backgroundColor:"white"}}>
                                    <td colspan="1" style={{ ...tableStyle, color:"white", height:"35px" }}></td>
                                    <td colspan="5" style={tableStyle}></td>
                                    <td colspan="1" style={tableStyle}></td>
                                    <td colspan="2" style={tableStyle}></td>
                                    <td colspan="2" style={tableStyle}></td>
                                    <td colspan="1" style={tableStyle}></td>
                                 </tr>
                              )
                           ):(null)}
                     

                        <tr>
                           <td colspan="12" style={{ ...tableStyle, height:"5px" }}></td>
                        </tr>
                        <tr>
                           <td colspan="12" style={{ ...tableStyle, height:"10px" }}></td>
                        </tr>

                        <tr>
                           <td colspan="6" style={tableStyle}>
                                 <span style={{ marginLeft: "10px" }}>Total No. of Boxes:</span>
                                 <span style={{ marginLeft: "5px" }}>{deliveryNote.totalBoxes}</span>
                           </td>
                           <td colspan="6" rowspan="2" style={tableStyle} >
                              <div style={{ textAlign:"center" }}>
                                 <span id="note">
                                    Should you have any queries concerning the dispatches<br />
                                    please contact our Sales Representative.<br />
                                    E-mail: info@decaltech.in																		
                                 </span>
                              </div>                        
                           </td>
                        </tr>
                        <tr>
                           <td colspan="6" style={tableStyle}>
                                 <span style={{ marginLeft:"10px" }}>Total Gross weight of shipment:</span>
                                 <span style={{ marginLeft:"5px" }}>{deliveryNote.totalBoxWeight}</span>
                           </td>
                        </tr>

                     </table>
                  </div>
               </PrinterWrapper>
               {/* START of LAST row in the form */}
               
            </React.Fragment>
         )}
      </React.Fragment>
   )
}

export default ASNScreen
