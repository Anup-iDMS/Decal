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
import sign from './../../assets/decaltech-removebg-preview.png'

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';

import { Image } from 'react-bootstrap';
import './../css/printpidr.css';
import PrinterWrapper from './../../components/app/PrinterWrapper';
import { getPDIRDetails } from '../../actions/qa/pdirActions';
import { Tbody } from 'react-super-responsive-table';
//aphrodite
import { StyleSheet, css } from "aphrodite";

const PDIRPrintScreen = ({ history, location, match }) => {

   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo, error: errorUser, loading: loadingUser } = userLogin

   const pdirId = match.params.id;

   const pdirDetails = useSelector((state) => state.pdirDetails)
   const { loading, pdir, error } = pdirDetails;

   console.log("pdir---------------> ", pdir)

   const [ invoiceLineDetails, setInvoiceLineDetails ] = useState([{}]);
   const [ customerCode, setCustomerCode ] = useState("");
   
   useEffect(() => {
      if (pdir._id !== pdirId) {
         dispatch(getPDIRDetails(pdirId))
         setInvoiceLineDetails(pdir.invoiceLineDetails);
      } else {
         setCustomerCode(pdir.customer.custCode);
         console.log("<<------------- pdir.customer.custCode---------------> ", pdir.customer.custCode)
      }
   }, [pdirId, pdir, history]); //


   /** styling start */
   let tableStyle = {
      border: "1px solid black",
      width: "100%",
      height: "100%",
      fontFamily:"Arial"
   }
   /** styling end */

   const styles = StyleSheet.create({
      gajanan: {
        "@media print": {
          clear: "both",
          pageBreakAfter: "always"
        }
      }
    });

   return (
      <React.Fragment>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <PrinterWrapper>
                  {pdir.invoiceLineDetails!==undefined?pdir.invoiceLineDetails.map((sid, index) => (
                     <div 
                        className={css(styles.gajanan)} 
                        style={{
                           border:"4px solid purple", 
                           marginTop:"5%", 
                           marginLeft:"5%", 
                           marginRight:"5%",
                        }}>
                        <div style={{border:"0px solid red", width:"98%",  margin:"auto", marginBottom:"20px" }}>
                           <div style={{textAlign:"right", marginTop:"10px", marginRight:"10px", fontFamily:"Arial"}}>
                              <Image src={logo} style={{width:"20%"}} fluid />
                           </div>
                           <hr></hr>
                           {/*<div style={{textAlign:"right", marginRight:"10px", fontFamily:"Arial", display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'none' : 'block'):"")}}>
                              <p>QMS | QC | F0006 | REV 0 | Date: 01-01-2021</p>
                           </div>*/}
                           <div style={{textAlign:"center", marginRight:"10px", fontFamily:"Arial"}}>
                              <h5>PRE-DISPATCH INSPECTION REPORT</h5>
                           </div>
                           <hr></hr>
                           <div style={{ display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'none' : 'block'):"") }}>
                              <div>
                                 <table style={{width:"100%", tableLayout:"fixed"}}>
                                    <tr>
                                       <td colspan="12" style={{...tableStyle, textAlign:"left", fontWeight:"bold"}}>
                                          <span>CUSTOMER: {pdir.customer!==undefined?pdir.customer.custName:""}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                          <span>PDIR Date: {pdir.pdirDate!==undefined?format(new Date(pdir.pdirDate), 'dd-MMM-yyyy'):""}</span>
                                       </td>
                                       <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                          <span>Invoice No.: {pdir.salesInvoiceNumber!==undefined?pdir.salesInvoiceNumber.salesInvoiceNumber:""}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                          <span>Part Name: {sid.jcDescription}</span>
                                       </td>
                                       <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                          <span>Invoice Date: {(pdir.salesInvoiceNumber!==undefined)?format(new Date(pdir.salesInvoiceNumber.salesInvoiceDate), 'dd-MMM-yyyy'):""}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                          <span>Batch Date: {sid.batchDate!==undefined?format(new Date(sid.batchDate), 'dd-MMM-yyyy'):""}</span>
                                       </td>
                                       <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                          <span>Invoice Quantity: {sid.invoicedQty} NOS</span>
                                       </td>
                                    </tr>
                                 </table>
                              </div>
                              <br />
                              <div>
                                 <table style={{width:"100%", tableLayout:"fixed"}}>
                                    <tbody>
                                       <tr>
                                          <td className="col-1 tableFont" style={{...tableStyle, fontWeight:"bold"}}>#</td>
                                          <td className="col-8 tableFont" style={{...tableStyle, fontWeight:"bold"}}>Inspection Parameter</td>
                                          <td className="col-4 tableFont" style={{...tableStyle, fontWeight:"bold"}}>Method</td>
                                          <td className="col-4 tableFont" style={{...tableStyle, fontWeight:"bold"}}>STD Requirement</td>
                                          <td className="col-4 tableFont" style={{...tableStyle, fontWeight:"bold"}}>Observations</td>
                                       </tr>
                                       {(sid.pdirDetails!==undefined)?sid.pdirDetails.map((ppid, index1) => (
                                          <tr>
                                             <td className="col-1 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{index1+1}</td>
                                             <td className="col-8 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{ppid['inspectionParameter']}</td>
                                             <td className="col-4 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{ppid['inspectionMethod']}</td>
                                             <td className="col-4 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{ppid['inspectionStandard']}</td>
                                             <td className="col-4 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{ppid['inspectionObservations']}</td>
                                          </tr>
                                       )):null}
                                    </tbody>
                                 </table>
                              </div>
                              <br></br>
                              <div>
                                 <table style={{width:"100%", tableLayout:"fixed"}}>
                                    <tbody>
                                       <tr>
                                          <td colspan="6" className="tableFont" style={{...tableStyle, fontWeight:"normal"}}>Disposition: (Approve/Send with Deviation)</td>
                                          <td colspan="2" className="tableFont" style={{ ...tableStyle, fontWeight:"normal", backgroundColor:"rgb(146,208,80)" }}>{(sid.lineDisposition !==undefined?sid.lineDisposition:"").toUpperCase()}</td>
                                          <td colspan="4" className="tableFont"  style={{...tableStyle, fontWeight:"normal"}}>Approved By: {pdir.approvedBy}</td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                           <div style={{ display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'block' : 'none'):"") }}>
                              <div>
                                 <h6>Job Details</h6>
                                 <table style={{width:"100%", tableLayout:"fixed"}}>
                                    <tbody>
                                       <tr>
                                          <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                             <span>Supplier Name: Decal Tech Private Limited</span>
                                          </td>
                                          <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                             <span>Product: Self-Adhesive Battery Label (T)</span>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                             <span>Part Number: {sid.partNumber}</span>
                                          </td>
                                          <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                             <span>Part Description: {sid.jcDescription}</span>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                             <span>Tax Invoice No.: {pdir.salesInvoiceNumber!==undefined?pdir.salesInvoiceNumber.salesInvoiceNumber:""}</span>
                                          </td>
                                          <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                             <span>Tax Invoice Date: {(pdir.salesInvoiceNumber!==undefined)?format(new Date(pdir.salesInvoiceNumber.salesInvoiceDate), 'dd-MMM-yyyy'):""}</span>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                             <span>Batch Date: {sid.batchDate!==undefined?format(new Date(sid.batchDate), 'dd-MMM-yyyy'):""}</span>
                                          </td>
                                          <td colspan="6" style={{...tableStyle, textAlign:"left" }}>
                                             <span>Batch Quantity: {sid.invoicedQty} NOS</span>
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </div>
                              <br></br>
                              <div>
                                 <h6>Inspection Report</h6>
                                 <table style={{width:"100%", tableLayout:"fixed"}}>
                                    <tbody>
                                       <tr>
                                          <td className="col-1 tableFont" style={{...tableStyle, fontWeight:"bold"}}>#</td>
                                          <td className="col-6 tableFont" style={{...tableStyle, fontWeight:"bold"}}>Inspection Parameter</td>
                                          <td className="col-5 tableFont" style={{...tableStyle, fontWeight:"bold"}}>Specification</td>
                                          <td className="col-5 tableFont" style={{...tableStyle, fontWeight:"bold"}}>DTPL Observations</td>
                                          <td className="col-5 tableFont" style={{...tableStyle, fontWeight:"bold"}}>TGY Remarks</td>
                                       </tr>
                                       {(sid.pdirDetails!==undefined)?sid.pdirDetails.map((ppid, index1) => (
                                          <tr>
                                             <td className="col-1 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{index1+1}</td>
                                             <td className="col-6 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{ppid['inspectionParameter']}</td>
                                             <td className="col-5 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{ppid['inspectionStandard']}</td>
                                             <td className="col-5 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{ppid['inspectionObservations']}</td>
                                             <td className="col-5 tableFont" style={{...tableStyle, fontWeight:"normal"}}>{ppid['customerFeedback']}</td>
                                          </tr>
                                       )):null}
                                    </tbody>
                                 </table>      
                              </div>
                              <br />
                              <div class="grid-container">
                                 <div style={{ border:"1px solid black", borderRadius:"5px" }}>
                                    <h6 style={{ textAlign:"center", marginTop:"10px" }}>Remarks by Decal Tech</h6>
                                    <div class="grid-container">
                                          <div style={{ border:"0px solid green", borderRadius:"5px", marginLeft:"10px", marginTop:"10px" }}>
                                             <Row>
                                                <Col lg={4}  md={6} xs={6}>
                                                   <p>Accepted</p>
                                                </Col>
                                                <Col lg={4}  md={6} xs={6}>
                                                   <input type="checkbox" checked={sid.lineDisposition==="Accepted" || sid.lineDisposition==="Approved"} disabled id="accepted" name="accepted" value="" />
                                                </Col>
                                             </Row>
                                             <Row>
                                                <Col lg={4}  md={6} xs={6}>
                                                   <p>Rejected</p>
                                                </Col>
                                                <Col lg={4}  md={6} xs={6}>
                                                   <input type="checkbox" checked={sid.lineDisposition==="Rejected" } disabled id="rejected" name="rejected" value="" />
                                                </Col>
                                             </Row>
                                          </div>
                                          <div style={{ border:"0px solid green", marginBottom:"10px", marginTop:"-5px" }}>
                                             <Row>
                                                <Col lg={12}  md={12} xs={12}>
                                                   <Image src={sign} style={{ textAlign:"center", marginLeft:"100px" }} fluid />
                                                </Col>
                                             </Row>
                                          </div>
                                    </div>
                                 </div>
                                 <div style={{ border:"1px solid black", borderRadius:"5px" }} >
                                    <h6 style={{ textAlign:"center", marginTop:"10px" }}>Remarks by TGY</h6>
                                    <div style={{ border:"0px solid green", borderRadius:"5px", marginLeft:"10px", marginTop:"10px" }}>
                                       <Row>
                                          <Col lg={4}>
                                             <p>Accepted</p>
                                          </Col>
                                       </Row>
                                       <Row>
                                          <Col lg={4}>
                                             <p>Rejected</p>
                                          </Col>
                                       </Row>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )):null}
               </PrinterWrapper>
            </React.Fragment>
         )}
      </React.Fragment>
   )
}

export default PDIRPrintScreen
