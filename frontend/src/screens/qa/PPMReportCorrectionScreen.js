//import standard React Components
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

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';
import { logger } from './../../util/ConsoleHelper';

import { getPPMReportDetails, updatePPMReport } from '../../actions/qa/ppmReportActions';
import { PPM_REPORT_UPDATE_RESET } from '../../constants/qa/ppmReportConstants';
import Goback from './../../components/app/Goback';

const PPMReportCorrectionScreen = ({ match, history  }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const ppmReportDetails = useSelector((state) => state.ppmReportDetails)

   const { loading, ppmReport, error } = ppmReportDetails;

   //post updated the record
   const ppmReportUpdate = useSelector((state) => state.ppmReportUpdate);
   const { success: successUpdate, error: errorUpdate } = ppmReportUpdate

   const [ month, setMonth ] = useState([]);
   //const [ reportId, setReportId ] = useState("");
   const reportId = match.params.id || "618e37b7ed66cd400cf0527f";
   //let reportId = "";
   const [ dispatchedQuantity, setDispatchedQuantity ] = useState([]);
   const [ customerComplaintQty, setCustomerComplaintQty ] = useState([]);
   const [ targetPPMLevel, setTargetPPMLevel ] = useState([]);
   const [ actualPPMLevel, setActualPPMLevel ] = useState([]);

   const [ dispatchedQuantityChanged, setDispatchedQuantityChanged ] = useState([]);
   const [ customerComplaintQtyChanged, setCustomerComplaintQtyChanged ] = useState([]);
   const [ actualPPMLevelChanged, setActualPPMLevelChanged ] = useState([]);

   //console.log("1. ????????? before useEffect ppmReport ------------- ", ppmReport)
   //console.log("1.1 ????????? before useEffect ppmReport._id ------------- ", ppmReport._id)
   //console.log("2. ????????? reportId ------------- ", reportId)

   //let dispatchedQuantityChanged = [];
   //let customerComplaintQtyChanged = [];
   useEffect(() => {
      
      if (ppmReport._id !== reportId) {
         //console.log("3. @@@@@@@@@ USEEFFECT IF ------------- ", reportId)
         dispatch(getPPMReportDetails())
      } else {
         //console.log("4. ~~~~~~~~~~ USEEFFECT ELSE ------------- ", reportId)
         setFormData();
      }
      
      if(successUpdate) {
         history.push('/ppmreportcorrection');
         dispatch({ type: PPM_REPORT_UPDATE_RESET })
         NotificationManager.success(`The record has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: PPM_REPORT_UPDATE_RESET })
         NotificationManager.error(`Error in updating the record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
	}, [reportId, ppmReport])
   
   const setFormData = () => {
      //console.log("5. ~~~~~~~~~~ INSIDE setFormData ------------- ", ppmReport)
      setMonth(ppmReport.month)
      setDispatchedQuantity(ppmReport.dispatchedQuantity)
      setCustomerComplaintQty(ppmReport.customerComplaintQty)
      setTargetPPMLevel(ppmReport.targetPPMLevel)
      setActualPPMLevel(ppmReport.actualPPMLevel)
      let srs = [];
      for (let index = 0; index < 13; index++) {
         srs.push(false)
      }
      setDispatchedQuantityChanged(srs);
      setCustomerComplaintQtyChanged(srs);
      setActualPPMLevelChanged(srs);
   }

   const handleDipatchQty = (index, e) => {
      let value = e.target.value;
      if(value === "" || value === "undefined" || value === undefined) {
         value = 0;
      }
      let srs = [...dispatchedQuantity]
      srs[index] = value;
      setDispatchedQuantity(srs);
      let sdk = [...dispatchedQuantityChanged]
      sdk[index] = true;
      sdk[12] = true;
      setDispatchedQuantityChanged(sdk)
      //console.log("dispatchedQuantityChanged[index] >>>>>>> ", dispatchedQuantityChanged[index])
   } 

   const handleDipatchQtyTotal = (e, index) => {
      let srs = [...dispatchedQuantity]
      let value = 0;
      for (let index = 0; index < srs.length-1; index++) {
         const element = srs[index];
         value += parseFloat(element)
      }
      srs[12] = value;
      setDispatchedQuantity(srs);

      //calculate Actual PPM Level
      let targetLevel = targetPPMLevel[index]
      let complaintqty = customerComplaintQty[index]
      let dispqty = dispatchedQuantity[index]
      let mf = 1000
      let actualppm = Math.round(((targetLevel*complaintqty)/dispqty)*mf)
      let sdk = [...actualPPMLevel]
      sdk[index] = actualppm
      setActualPPMLevel(sdk)

      let sdk1 = [...actualPPMLevelChanged]
      sdk1[index] = true;
      sdk1[12] = true;
      setActualPPMLevelChanged(sdk1)
   } 

   const handleCustomerComplaintQty = (index, e) => {
      let value = e.target.value;
      if(value === "" || value === "undefined" || value === undefined) {
         value = 0;
      }
      let srs = [...customerComplaintQty]
      srs[index] = value;
      setCustomerComplaintQty(srs);
      
      let sdk = [...customerComplaintQtyChanged]
      sdk[index] = true;
      sdk[12] = true;
      setCustomerComplaintQtyChanged(sdk)
   } 

   const handleDCustomerComplaintQtyTotal = (e, index) => {
      let srs = [...customerComplaintQty]
      let value = 0;
      for (let index = 0; index < srs.length-1; index++) {
         const element = srs[index];
         value += parseFloat(element)
      }
      srs[12] = value;
      setCustomerComplaintQty(srs);

      //calculate Actual PPM Level
      let targetLevel = targetPPMLevel[index]
      let complaintqty = customerComplaintQty[index]
      let dispqty = dispatchedQuantity[index]
      let mf = 1000
      let actualppm = Math.round(((targetLevel*complaintqty)/dispqty)*mf)
      let sdk = [...actualPPMLevel]
      sdk[index] = actualppm
      setActualPPMLevel(sdk)

      let sdk1 = [...actualPPMLevelChanged]
      sdk1[index] = true;
      sdk1[12] = true;
      setActualPPMLevelChanged(sdk1)
   } 

   const handleReset = (e) => {
      e.currentTarget.blur()
      window.location.reload();
   }

   //8. Form Submit
   const submitHandler = (e) => {
      e.preventDefault();
      dispatch(
         updatePPMReport({
            _id: reportId,
            month,
            dispatchedQuantity,
            customerComplaintQty,
            targetPPMLevel,
            actualPPMLevel
         })
      )
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
         <Row>
            <Col lg={6} md={12} xs={12}>
               <Goback history = {history} />
            </Col>
            <Col lg={6} md={12} xs={12} style={{textAlign:"end"}}>
               <Link to={`/ppm`}>
                  <Button
                     className='btn-md reset-button-class'
                     variant="primary"
                     onClick={(e) => e.currentTarget.blur()}
                  >
                     <i className="fas fa-chart-bar"></i> PPM Report Dashboard
                  </Button>
               </Link>
            </Col>
         </Row>
         
         <Form onSubmit={submitHandler}>
            <table>
               <tr>
                  <td colspan="14" style={{...tableStyle, textAlign:"center", fontWeight:"bold"}}>
                     <span>PPM FOR CUSTOMER COMPLAINTS IN FY 2021-22</span>
                  </td>
               </tr>
               <tr>
                  <td colspan="14" style={{...tableStyle, textAlign:"left", fontWeight:"bold"}}>&nbsp;</td>
               </tr>
               {month !==undefined?(
                  <tr>
                     <td style={{...tableStyle}}>Month & Year</td>
                     { month.map((d, index) => 
                        <td style={{...tableStyle}}>{d}</td>
                     )}
                  </tr>
               ):(null)}
               {dispatchedQuantity !==undefined?(
                  <tr>
                     <td style={{...tableStyle}}>Dispatched Quantity (Parts)</td>
                     { dispatchedQuantity.map((d, index) => 
                        <td 
                           style={{...tableStyle, color: (dispatchedQuantityChanged[index] ? 'red' : '') }}

                        >
                           {d}
                        </td>
                     )}
                  </tr>
               ):(null)}
               {customerComplaintQty !== undefined?(
                  <tr>
                     <td style={{...tableStyle}}>Customer Complaint Qty (Parts)</td>
                     { customerComplaintQty.map((d, index) => 
                        <td style={{...tableStyle, color: (customerComplaintQtyChanged[index] ? 'red' : '') }}>{d}</td>
                     )}
                  </tr>
               ):(null)}
               {targetPPMLevel !== undefined? (
                  <tr>
                     <td style={{...tableStyle}}>PPM Level (Target)</td>
                     { targetPPMLevel.map((d, index) => 
                        <td style={{...tableStyle}}>{d}</td>
                     )}
                  </tr>
               ): (null)}
               {actualPPMLevel !== undefined?(
                  <tr>
                     <td style={{...tableStyle}}>PPM Level (Actual)</td>
                     { actualPPMLevel.map((d, index) => 
                        <td style={{...tableStyle, color: (actualPPMLevelChanged[index] ? 'red' : '') }}>{d}</td>
                     )}
                  </tr>
               ):(null)}
            </table>
            <div style={{border:"1px solid green", borderRadius:"7px"}} className="my-3">
               <Row className="mx-1 my-2">
                  <Col>
                     <h5>Adjust Dispatched Quantity (Parts)</h5>
                  </Col>
               </Row>
               <Row className="my-2 mx-2">
                  { dispatchedQuantity.map((d, index) => 
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='cpin'>
                           <Form.Label>{month[index]}<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='number'
                              placeholder=''
                              value={d}
                              name="cpin"
                              disabled={index===12}
                              onChange={(e) => handleDipatchQty(index, e)}
                              onBlur={(e) => handleDipatchQtyTotal(e, index)}
                           ></Form.Control>
                        </Form.Group>
                     </Col>
                  )} 
               </Row>
            </div>
            <div style={{border:"1px solid red", borderRadius:"7px"}} className="my-3">
               <Row className="mx-1 my-2">
                  <Col>
                     <h5>Adjust Customer Complaint Qty (Parts)</h5>
                  </Col>
               </Row>
               <Row className="my-2 mx-2">
                  { customerComplaintQty.map((d, index) => 
                     <Col lg={3} md={12} xs={12}>
                        <Form.Group controlId='cpin'>
                           <Form.Label>{month[index]}<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='number'
                              placeholder=''
                              value={d}
                              name="cpin"
                              disabled={index===12}
                              onChange={(e) => handleCustomerComplaintQty(index, e)}
                              onBlur={(e) => handleDCustomerComplaintQtyTotal(e, index)}
                           ></Form.Control>
                        </Form.Group>
                     </Col>
                  )} 
               </Row>
            </div>
            {/* START of LAST row in the form */}
            <Row>
               <Col style={{textAlign:"end"}}>
                  <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={(e)=>handleReset(e)}><i className="fas fa-undo"></i> Reset</Button>
                  <Button 
                     type='submit'
                     className=' my-3 btn-md button-class' 
                     onClick={(e) => e.currentTarget.blur()}><i className="fas fa-save"></i> Save</Button>
               </Col>
            </Row>
         </Form>
      </React.Fragment>
   )
}

export default PPMReportCorrectionScreen
