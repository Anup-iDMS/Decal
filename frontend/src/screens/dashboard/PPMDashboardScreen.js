import React, { useState, useEffect }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPPMDashboardData } from './../../actions/dashboard/dashboardActions';
import { Form, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import Goback from './../../components/app/Goback';
import PPMDataDisplayComponent from './../../components/charts/PPMDataDisplayComponent';


const PPMDashboardScreen = ({ history, match }) => {
   const dispatch = useDispatch()

   //const reportId = "618e37b7ed66cd400cf0527f";

   const userDetails = useSelector((state) => state.userDetails)
   const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const ppmDashboardData = useSelector((state) => state.ppmDashboardData)
	
   const { 
      loading, 
      actualPPMData,
      correctedPPMData,
      monthlyPPMSalesData,
      monthlyPPMCreditData,
      error 
   } = ppmDashboardData;


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

   return (
      <React.Fragment>
         <Row>
            <Col lg={4} md={12} xs={12}>
               <Goback history = {history} />
            </Col>
            <Col lg={4} md={12} xs={12} style={{textAlign:"center"}}>
               <Link to={`/ppmlevelreportprint`}  target="_blank" rel="noopener noreferrer">
                  <Button
                     className='btn-md reset-button-class'
                     variant="primary"
                     onClick={(e) => e.currentTarget.blur()}
                  >
                     <i className="fas fa-print"></i> Print PPM Report
                  </Button>
               </Link>
            </Col>
            <Col lg={4} md={12} xs={12} style={{textAlign:"end"}}>
               <Link to={`/ppmreportcorrection`}>
                  <Button
                     className='btn-md reset-button-class'
                     variant="primary"
                     onClick={(e) => e.currentTarget.blur()}
                  >
                     <i className="fas fa-edit"></i> Adjust PPM Report
                  </Button>
               </Link>
            </Col>
         </Row>
         <div style={{border:"1px solid red", borderRadius:"7px"}} className="my-2">
            <Row className="mx-2 my-3">
               <Col>
                  <h5>System Generated PPM Report</h5>
               </Col>
            </Row>
            <PPMDataDisplayComponent
               reportYear = {reportYear}
               months={months}
               dispatchedQty={actualDispatchedQty}
               complaintedQty={actualComplaintedQty}
               targetPPMLevel={actualTargetPPMLevel}
               actualPPMLevel={actualPPMLevel}
            />
         </div>
         <hr />
         <div style={{border:"1px solid green", borderRadius:"7px"}} className="my-3">
            <Row className="mx-2 my-3">
               <Col>
                  <h5>Corrected PPM Report</h5>
               </Col>
            </Row>
            <PPMDataDisplayComponent
               reportYear = {reportYear}
               months={months}
               dispatchedQty={adjustedDispatchedQty}
               complaintedQty={adjustedComplaintedQty}
               targetPPMLevel={adjustedTargetPPMLevel}
               actualPPMLevel={adjustedPPMLevel}
            />
         </div>
      </React.Fragment>
   )
}

export default PPMDashboardScreen
