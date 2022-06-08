import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

// React Notification
import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from '../../components/app/Breadcrumb';
import logo from './../../assets/DTPL_Logo.jpg'
import { Image } from 'react-bootstrap';

import Goback from './../../components/app/Goback';
import PrinterWrapper from './../../components/app/PrinterWrapper';
//aphrodite
import { StyleSheet, css } from "aphrodite";

import PPMReportChart from '../../components/charts/PPMReportChart';
import {Bar, Line } from 'react-chartjs-2';
import PPMDataDisplayComponent from './../../components/charts/PPMDataDisplayComponent';
import { getPPMDashboardData } from '../../actions/dashboard/dashboardActions';


const PPMLevelPrintReportScreen = ({ history, match }) => {

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const userDetails = useSelector((state) => state.userDetails)
   const { user } = userDetails

   const ppmDashboardData = useSelector((state) => state.ppmDashboardData)
	
   const { 
      loading, 
      actualPPMData,
      correctedPPMData,
      monthlyPPMSalesData,
      monthlyPPMCreditData,
      error 
   } = ppmDashboardData;

   const [ reportType, setReportType ] = useState("Corrected");

   useEffect(() => {
      if (!userInfo) {
          history.push('/')
      } else {
          if (!user || !user.name ) {
             dispatch(getPPMDashboardData())
         }
      }
      window.scrollTo(0, 0)
   }, [dispatch, history, userInfo, user])

   const handleReportType = (e) => {
      setReportType(e.target.value)
   }

   let months = [];
   let reportYear = "";
   /** System Generated Actual PPM Data */
   let actualDispatchedQty = [];
   let actualComplaintedQty = [];
   let actualTargetPPMLevel = [];
   let actualPPMLevel = [];
   /** Adjusted PPM Data */
   let adjustedDispatchedQty = [];
   let adjustedComplaintedQty = [];
   let adjustedTargetPPMLevel = [];
   let adjustedPPMLevel = [];

   if(monthlyPPMSalesData !== undefined && monthlyPPMCreditData !== undefined) {
      reportYear = actualPPMData.reportYear
      months = actualPPMData.months
      /** Actual PPM Details */
      actualDispatchedQty = actualPPMData.dispatchedQty
      actualTargetPPMLevel = actualPPMData.targetPPMLevel
      actualComplaintedQty = actualPPMData.complaintedQty//monthlyPPMCreditData['Credit']
      actualPPMLevel = actualPPMData.actualPPMLevel
      /** Adjusted PPM Details */
      adjustedDispatchedQty = correctedPPMData.dispatchedQty
      adjustedComplaintedQty = correctedPPMData.complaintedQty
      adjustedTargetPPMLevel = correctedPPMData.targetPPMLevel//monthlyPPMCreditData['Credit']
      adjustedPPMLevel = correctedPPMData.adjustedPPMLevel
   }

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
           pageBreakBefore: "always"
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
               <Row className="mx-4 my-4">
                  <Col lg={4} md={12} xs={12}>
                     <Form.Group controlId='active'>
                        <Form.Label>Select Report Type<span className="mandatory">*</span></Form.Label>
                        <Form.Control
                           as='select'
                           custom
                           name='reportType'
                           placeholder='Select'
                           value={reportType}
                           onChange={(e) => handleReportType(e)}
                        >
                           <option value="Actual">Actual</option>
                           <option value="Corrected">Corrected</option>
                           <option value="Both">Both</option>
                        </Form.Control>
                     </Form.Group>
                  </Col>
               </Row>
               <PrinterWrapper>
                  <div  
                     style={{
                        border:"1px solid purple", 
                        marginTop:"1%", 
                        marginLeft:"2%", 
                        marginRight:"2%",
                        display: (reportType.indexOf("Actual")!==-1 ? 'none' : '') 
                     }}>
                     <div style={{border:"0px solid red", width:"98%",  margin:"auto", marginBottom:"20px" }}>
                        <div style={{textAlign:"right", marginTop:"10px", marginRight:"10px", fontFamily:"Arial"}}>
                           <Image src={logo} style={{width:"20%"}} fluid />
                        </div>
                        <hr></hr>
                        <div style={{textAlign:"right", marginRight:"10px", fontFamily:"Poppins"}}>
                           <p>QMS/QA/PPI/Rev 01/Rev Date 01-04-2021</p>
                        </div>
                        <hr></hr>
                        <div style={{textAlign:"center", marginRight:"10px", fontFamily:"Poppins", background:"lightgray"}}>
                           <h5 style={{ color:"black" }}>PPM FOR CUSTOMER COMPLAINTS IN FY 2021-22</h5>
                        </div>
                     </div>
                     <React.Fragment>
                        <div style={{border:"0px solid red", width:"98%",  margin:"auto", marginBottom:"20px"}}>
                           <PPMDataDisplayComponent
                              reportYear = {reportYear}
                              months={months}
                              dispatchedQty={adjustedDispatchedQty}
                              complaintedQty={adjustedComplaintedQty}
                              targetPPMLevel={adjustedTargetPPMLevel}
                              actualPPMLevel={adjustedPPMLevel}
                           />
                           <br></br>
                           <div style={{border:"1px solid black", margin:"auto", marginBottom:"20px" }}>
                              <Row className="mx-2 my-2">
                                 <Col xl={12} lg={12} md={12} xs={12}>
                                    <h4 style={{ color:"black", textAlign:"center"}}>PPM FOR CUSTOMER COMPLAINTS</h4>
                                    <br />
                                    <PPMReportChart
                                       chartTitle = {["PPM FOR CUSTOMER COMPLAINTS"]}
                                       TypeOfChart = {Bar}
                                       targetPPMLevel = {adjustedTargetPPMLevel}
                                       showlegends = {false}
                                       chartLables = {months!==undefined?months.slice(0,12):[]}
                                       chartData = {adjustedPPMLevel!==undefined?adjustedPPMLevel.slice(0,12):[]}
                                    />
                                    <div style={{ marginTop:"10px", color:"black", textAlign:"center"}}>
                                       <span style={{ color:"rgba(248,203,173,1)" }}><i className="fas fa-square"></i></span>&nbsp;<span>PPM Level (Target)</span>
                                       &nbsp;&nbsp;
                                       <span style={{ color:"rgba(91, 155, 213, 1)" }}><i className="fas fa-square"></i></span>&nbsp;<span>PPM Level (Actual)</span>
                                    </div>
                                 </Col>
                              </Row>
                           </div>
                        </div>
                     </React.Fragment>
                  </div>
                  <div  
                     className={css(styles.gajanan)} 
                     style={{
                        border:"1px solid purple", 
                        marginTop:"1%", 
                        marginLeft:"2%", 
                        marginRight:"2%",
                        display: (reportType.indexOf("Corrected")!==-1 ? 'none' : '')
                     }}>
                     <div style={{border:"0px solid red", width:"98%",  margin:"auto", marginBottom:"20px" }}>
                        <div style={{textAlign:"right", marginTop:"10px", marginRight:"10px", fontFamily:"Arial"}}>
                           <Image src={logo} style={{width:"20%"}} fluid />
                        </div>
                        <hr></hr>
                        <div style={{textAlign:"right", marginRight:"10px", fontFamily:"Poppins"}}>
                           <p>QMS/QA/PPI/Rev 01/Rev Date 01-04-2021</p>
                        </div>
                        <hr></hr>
                        <div style={{textAlign:"center", marginRight:"10px", fontFamily:"Poppins", background:"lightgray"}}>
                           <h5 style={{ color:"black" }}>PPM FOR CUSTOMER COMPLAINTS IN FY 2021-22</h5>
                        </div>
                     </div>
                     <React.Fragment>
                     <div style={{border:"0px solid red", width:"98%",  margin:"auto", marginBottom:"20px" }}>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <h5>System Generated PPM Data</h5>
                           </Col>
                        </Row>
                        <PPMDataDisplayComponent
                           reportYear = {reportYear}
                           months={months}
                           dispatchedQty={actualDispatchedQty}
                           complaintedQty={actualComplaintedQty}
                           targetPPMLevel={adjustedTargetPPMLevel}
                           actualPPMLevel={actualPPMLevel}
                        />
                        <br></br>
                        <div style={{border:"1px solid black", margin:"auto", marginBottom:"20px" }}>
                           <Row className="mx-2 my-2">
                              <Col xl={12} lg={12} md={12} xs={12}>
                                 <h4 style={{ color:"black", textAlign:"center"}}>PPM FOR CUSTOMER COMPLAINTS</h4>
                                 <br />
                                 <PPMReportChart
                                    chartTitle = {["PPM FOR CUSTOMER COMPLAINTS"]}
                                    TypeOfChart = {Bar}
                                    targetPPMLevel = {adjustedTargetPPMLevel}
                                    showlegends = {false}
                                    chartLables = {months!==undefined?months.slice(0,12):[]}
                                    chartData = {actualPPMLevel!==undefined?actualPPMLevel.slice(0,12):[]}
                                 />
                                 <div style={{ marginTop:"10px", color:"black", textAlign:"center"}}>
                                    <span style={{ color:"rgba(248,203,173,1)" }}><i className="fas fa-square"></i></span>&nbsp;<span>PPM Level (Target)</span>
                                    &nbsp;&nbsp;
                                    <span style={{ color:"rgba(91, 155, 213, 1)" }}><i className="fas fa-square"></i></span>&nbsp;<span>PPM Level (Actual)</span>
                                 </div>
                              </Col>
                           </Row>
                        </div>
                     </div>
                        
                     </React.Fragment>
                  </div>
               </PrinterWrapper>
            </React.Fragment>
         )}
      </React.Fragment>
   )
}

export default PPMLevelPrintReportScreen
