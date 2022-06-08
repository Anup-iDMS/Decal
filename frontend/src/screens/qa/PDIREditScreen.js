//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';

// React Notification
import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from '../../components/app/Breadcrumb';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';
import { logger } from './../../util/ConsoleHelper';
import { format } from 'date-fns'
import { getPDIRDetails, updatePDIR } from '../../actions/qa/pdirActions';
import { PDIR_UPDATE_RESET } from './../../constants/qa/pdirConstants';

const PDIREditScreen = ({ match, history }) => {
    // 1. Get all the master data and dependent data required to create a form
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
 
    const pdirId = match.params.id;
    
    const pdirDataDetails = useSelector((state) => state.pdirDetails)
 
    const { loading, pdir, error } = pdirDataDetails;
 
   //post updated the record
   const pdirUpdate = useSelector((state) => state.pdirUpdate);
   const { success: successUpdate, error: errorUpdate } = pdirUpdate
   
   //disable button on click
   const [executing, setExecuting] = useState(false);
   const [ productCode, setProductCode ] = useState("")
   const [ pdirCode, setPDIRCode ] = useState("")
   const [ pdirDate, setPDIRDate ] = useState(new Date())
   const [ customer, setCustomer ] = useState("")
   const [ customerCode, setCustomerCode ] = useState("")
   const [ customerName, setCustomerName ] = useState("")
   const [ salesInvoiceNumber, setSalesInvoiceNumber ] = useState("")
   const [ salesInvoiceDate, setSalesInvoiceDate ] = useState()
   const [ pdirTemplateID, setPDIRTemplateID ] = useState("")
   const [ disposition, setDisposition ] = useState("")
   const [ approvedBy, setApprovedBy ] = useState(userInfo.name)
   const [ totalNumberOfJCs, setTotalNumberOfJCs ] = useState(1)
   const [ invoiceLineDetails, setInvoiceLineDetails ] = useState([{}])
   const [key, setKey] = useState('i0');
   const [ pdirDetails, setPDIRDetails ] = useState([{}])

   const [ pdirTemplateDetails, setPDIRTemplateDetails ] = useState([{}])
   const [ pdirTemplateDetailsCount, setPDIRTemplateDetailsCount ] = useState(1)
   const [ pdirTempDetails, setPDIRTempDetails ] = useState([{
      id: uuidv4(), 
      lineNumber:'1', 
      jcDescription: '', 
      batchDate: '',
      invoicedQty: '',
      lineDisposition: '',
      pdirDetails: [{
         pdirid: uuidv4(),
         inspectionParameter: '',
         inspectionMethod: '',
         inspectionStandard: '',
         inspectionObservations: ''
      }]
   }])

   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   const masterDataForPDIR = useSelector((state) => state.masterDataForPDIR)

   const { loading: loadingMasterData } = masterDataForPDIR;

   let pdirTemplates = [];
 
   let autoIncrementePDIRNo = "";
   if(masterDataForPDIR !== undefined) {
      pdirTemplates = masterDataForPDIR.pdirTemplates;
   }

   useEffect(() => {
      
      if (pdir._id !== pdirId) {
         dispatch(getPDIRDetails(pdirId))
      } else {
         //console.log(">>>>>>>>>>>> PDIR Data <<<<<<<<<<<<<< ", pdir)
         //logger("user.role._id ", user.isActive)
         setFormData();
      }
      if(successUpdate) {
         history.push('/pdirlist');
         dispatch({ type: PDIR_UPDATE_RESET })
         NotificationManager.success(`The record has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: PDIR_UPDATE_RESET })
         NotificationManager.error(`Error in updating the record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [pdirId, pdir, successUpdate]);

   const setFormData = () => {
      setProductCode(pdir.productCode)
      setPDIRCode(pdir.pdirCode)
      setPDIRDate(pdir.pdirDate)
      setCustomer(pdir.customer._id)
      setCustomerCode(pdir.customer.custCode)
      setCustomerName(pdir.customer.custName)
      setSalesInvoiceNumber(pdir.salesInvoiceNumber.salesInvoiceNumber)
      setSalesInvoiceDate(pdir.salesInvoiceNumber.salesInvoiceDate)
      //setPDIRTemplateID(pdir.)
      setDisposition(pdir.disposition)
      setApprovedBy(pdir.approvedBy)
      setInvoiceLineDetails(pdir.invoiceLineDetails)
      console.log(">>>>>>>>>>>>>>> pdir.customer.custCode >>>>>>>>>>>>> ", pdir.customer.custCode)
   }

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( customer.trim().length === 0 ) {
         newErrors.customer = 'Select a Customer!'
      }

      if ( salesInvoiceNumber.trim().length === 0 ) {
          newErrors.salesInvoiceNumber = 'Select an Invoice!'
      }
      // if ( productCode.trim().length === 0 ) {
      //    newErrors.productCode = 'Select a Product Code!'
      // }

      // if ( inspectionMethod.trim().length === 0 ) {
      //    newErrors.inspectionMethod = 'Select an Inspection Method!'
      // }
      // if ( inspectionStandard.trim().length === 0 ) {
      //    newErrors.inspectionStandard = 'Enter an Inspection Standard!'
      // }
      

      return newErrors;
   }

   const submitHandler = (e) => {
      e.preventDefault();
      //console.log(">>>>>>>>>>>>>>> Inside Sabe and pdirTempDetails === ", pdirTempDetails)
      //return;
      const newErrors = findFormErrors();
      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
         NotificationManager.error(`Please fill in the required details !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      } else {
         setExecuting(true);
         dispatch(
            updatePDIR({
               _id: pdirId,
               pdirCode,
               productCode,
               salesInvoiceNumber,
               customer,
               pdirDate,
               disposition,
               approvedBy,
               invoiceLineDetails
            })
         );
      }
   }

   const handleChangeInput = (index, id, pdirid, event) => {
      let nama = [...invoiceLineDetails]
      //console.log("-------- handle Chnage Input Before modification ------------- ", nama)
      const newInputFields = nama.map(i => {
         //console.log("-------- Passed ID is ------------- ", id)
         //console.log("-------- Inut ID is ------------- ", i.id)
         if(id === i._id) {
            //console.log("1. handleChangeInput MATCHING JC is >>>>>>>>>>>>> ", i.jcDescription)
            //console.log("2. handleChangeInput MATCHING Sales Invoice Details Unique ID is >>>>>>>>>>>>> ", id)
            //console.log("3. handleChangeInput MATCHING Index is >>>>>>>>>>>>> ", index)
            ////console.log("3. handleChangeInput MATCHING Sales Invoice Details Unique ID is >>>>>>>>>>>>> ", pdirTempDetails)
            const newPDIRInputFields = i.pdirDetails.map(p => {
               if(pdirid === p._id) {
                  //console.log("4. handleChangeInput PDIR MATCHING Marameter is >>>>>>>>>>>>> ", p.inspectionParameter)
                  //console.log("5. handleChangeInput PDIR MATCHING Unique ID is >>>>>>>>>>>>> ", pdirid)
                  //console.log("6. handleChangeInput Event MATCHING  Target Value is >>>>>>>>>>>>> ", event.target.value)
                  //i[event.target.name] = event.target.value
                  p[event.target.name] = event.target.value
               }
               return p
            })
         }
         return i;
      })
      //console.log("5. handleChangeInput Event and newInputFields >>>>>>>>>>>>> ", newInputFields)
      setInvoiceLineDetails(newInputFields);
   }

   const handleDisposition = (e, id, index) => {
      console.log("------------------ START handleDisposition ---------------------", e.target.value)
      let newSIDetails = [...invoiceLineDetails]
      let newSIDetails1 = newSIDetails.map((sid,index) => {
         //console.log("1.20 >>>>>>>>>>>>> sid.id <<<<<<<<<< ", sid._id)
         if(sid._id === id) {
            sid.lineDisposition = e.target.value;
         }
         return sid;
      })
      setInvoiceLineDetails(newSIDetails1)
      //console.log("---x--x---x---x---x---- END handleDisposition ---------------------", newSIDetails1)
   }

   const handleCustomerDisposition = (e, id, index) => {
      //console.log("------------------ START handleDisposition ---------------------", e.target.value)
      let newSIDetails = [...invoiceLineDetails]
      let newSIDetails1 = newSIDetails.map((sid,index) => {
         //console.log("1.20 >>>>>>>>>>>>> sid.id <<<<<<<<<< ", sid._id)
         if(sid._id === id) {
            sid.lineCustomerDisposition = e.target.value;
         }
         return sid;
      })
      setInvoiceLineDetails(newSIDetails1)
      //console.log("---x--x---x---x---x---- END handleDisposition ---------------------", newSIDetails1)
   }

   //7. Form Reset
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const handleReset = () => {
      window.location.reload();
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
         <Breadcrumb listPage = "pdirlist" />
         <br></br>
         {loadingMasterData ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col>
                     <h3>PDIR Entry</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Enter The Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='pdirCode'>
                                 <Form.Label>PDIR #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='pdirCode'
                                    readOnly
                                    value={pdirCode}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='pdirDate'>
                                 <Form.Label>PDIR Date<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='pdirDate'
                                    readOnly
                                    value={format(new Date(pdirDate), 'dd-MMM-yyyy')}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.pdirDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='customerName'>
                                 <Form.Label>Customer<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='customerName'
                                    readOnly
                                    value={customerName}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.customerName}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='salesInvoiceNumber'>
                                 <Form.Label>Invoice #<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='salesInvoiceNumber'
                                    readOnly
                                    value={salesInvoiceNumber}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.salesInvoiceNumber}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='salesInvoiceDate'>
                                 <Form.Label>Invoice Date<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='salesInvoiceDate'
                                    readOnly
                                    value={format(new Date(salesInvoiceDate!==undefined?salesInvoiceDate:null), 'dd-MMM-yyyy')}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.salesInvoiceDate}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={12} md={12} xs={12}>
                              {totalNumberOfJCs > 0 ?(
                                 <React.Fragment>
                                    <Tabs
                                       id="controlled-tab-example"
                                       activeKey={key}
                                       onSelect={(k) => setKey(k)}
                                       className="mb-2"
                                       style={{ background:"white" }}
                                    >
                                       {invoiceLineDetails.map((sid, index) => (
                                          <Tab key={index} eventKey={"i"+index} title={sid.jcDescription} style={{ background:"white" }}>
                                             <Row>
                                                <Col lg={6} md={12} xs={12}>
                                                   <Form.Group controlId='pdirCode'>
                                                      <Form.Label>Part Number<span className="mandatory">*</span></Form.Label>
                                                      <Form.Control
                                                         type='text'
                                                         name='jcDescription'
                                                         readOnly
                                                         value={sid.jcDescription}
                                                      ></Form.Control>
                                                   </Form.Group>
                                                </Col>
                                                <Col lg={3} md={12} xs={12}>
                                                   <Form.Group controlId='batchDate'>
                                                      <Form.Label>Batch Date<span className="mandatory">*</span></Form.Label>
                                                      <Form.Control
                                                         type='text'
                                                         name='batchDate'
                                                         readOnly
                                                         value={format(new Date(sid.batchDate!==undefined?sid.batchDate:null), 'dd-MMM-yyyy')}
                                                      ></Form.Control>
                                                   </Form.Group>
                                                </Col>
                                                <Col lg={3} md={12} xs={12}>
                                                   <Form.Group controlId='invoicedQty'>
                                                      <Form.Label>Invoice Qty<span className="mandatory">*</span></Form.Label>
                                                      <Form.Control
                                                         type='text'
                                                         name='invoicedQty'
                                                         readOnly
                                                         value={sid.invoicedQty}
                                                      ></Form.Control>
                                                   </Form.Group>
                                                </Col>
                                             </Row>
                                             <Row>
                                                {/*<Col lg={4} md={12} xs={12}>
                                                   <Form.Group controlId='salesInvoiceNumber'>
                                                      <Form.Label>Select PDIR Template<span className="mandatory">*</span></Form.Label>
                                                      <Select 
                                                         name="salesInvoiceNumber"
                                                         options = {pdirTemplates!==undefined?(pdirTemplates.map(pid => {
                                                            return { value: pid._id, label: pid.pdirTemplateName }
                                                         })):null} 
                                                         onChange={event => handlePDIRTemplateSelection(event, sid.id, index)}
                                                      />
                                                      <p className="validation-error">{errors.pdirTemplateName}</p>
                                                   </Form.Group>
                                                      </Col>*/}
                                                <Col
                                                   style={{ display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'none' : 'block'):"") }}
                                                   lg={4} md={12} xs={12}>
                                                   <Form.Group controlId='lineDisposition'>
                                                      <Form.Label>Disposition<span className="mandatory">*</span></Form.Label>
                                                      <Form.Control
                                                         as='select'
                                                         custom
                                                         name='lineDisposition'
                                                         placeholder='Select'
                                                         value={sid.lineDisposition}
                                                         onChange={(e) => handleDisposition(e, sid._id, index)}
                                                      >
                                                         <option value="Approved">Approved</option>
                                                         <option value="Sent with Deviation">Sent with Deviation</option>
                                                      </Form.Control>
                                                      <p className="validation-error">{errors.lineDisposition}</p>
                                                   </Form.Group>
                                                </Col>
                                                <Col
                                                   style={{ display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'block' : 'none'):"") }}
                                                   lg={4} md={12} xs={12}>
                                                   <Form.Group controlId='lineDisposition'>
                                                      <Form.Label>Disposition<span className="mandatory">*</span></Form.Label>
                                                      <Form.Control
                                                         as='select'
                                                         custom
                                                         name='lineDisposition'
                                                         placeholder='Select'
                                                         value={sid.lineDisposition}
                                                         onChange={(e) => handleDisposition(e, sid._id, index)}
                                                      >
                                                         <option value="Accepted">Accepted</option>
                                                         <option value="Rejected">Rejected</option>
                                                      </Form.Control>
                                                      <p className="validation-error">{errors.lineDisposition}</p>
                                                   </Form.Group>
                                                </Col>
                                                <Col
                                                   style={{ display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'block' : 'none'):"") }}
                                                   lg={4} md={12} xs={12}>
                                                   <Form.Group controlId='lineCustomerDisposition'>
                                                      <Form.Label>Customer Disposition<span className="mandatory">*</span></Form.Label>
                                                      <Form.Control
                                                         as='select'
                                                         custom
                                                         name='lineCustomerDisposition'
                                                         placeholder='Select'
                                                         value={sid.lineCustomerDisposition}
                                                         onChange={(e) => handleCustomerDisposition(e, sid._id, index)}
                                                      >
                                                         <option value="None"></option>
                                                         <option value="Accepted">Accepted</option>
                                                         <option value="Rejected">Rejected</option>
                                                      </Form.Control>
                                                      <p className="validation-error">{errors.lineCustomerDisposition}</p>
                                                   </Form.Group>
                                                </Col>
                                                <Col lg={4} md={12} xs={12}>
                                                   <Form.Group controlId='approvedBy'>
                                                      <Form.Label>Approved By<span className="mandatory">*</span></Form.Label>
                                                      <Form.Control
                                                         type='text'
                                                         name='approvedBy'
                                                         readOnly
                                                         value={approvedBy}
                                                      ></Form.Control>
                                                   </Form.Group>
                                                </Col>
                                             </Row>
                                             {pdirTemplateDetailsCount > 0?
                                                (
                                                   <div>
                                                      <Row style={{ display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'none' : 'block'):"") }}>
                                                         <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                                            <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" }}>
                                                               <thead>
                                                                  <tr>
                                                                     <th className="col-2" style={{ ...tableStyle, color:"black" }}>#</th>
                                                                     <th className="col-10" style={{ ...tableStyle, color:"black" }}>Inspection Parameter</th>
                                                                     <th className="col-5" style={{ ...tableStyle, color:"black" }}>Method</th>
                                                                     <th className="col-5" style={{ ...tableStyle, color:"black" }}>STD Requirement</th>
                                                                     <th className="col-8" style={{ ...tableStyle, color:"black" }}>Observations</th>
                                                                  </tr>
                                                               </thead>
                                                               <tbody>
                                                               </tbody>
                                                            </table>
                                                         </Col>
                                                      </Row>
                                                      <Row style={{ display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'block' : 'none'):"") }}>
                                                         <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                                            <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" }}>
                                                               <thead>
                                                                  <tr>
                                                                     <th className="col-2" style={{ ...tableStyle, color:"black" }}>#</th>
                                                                     <th className="col-8" style={{ ...tableStyle, color:"black" }}>Inspection Parameter</th>
                                                                     <th className="col-8" style={{ ...tableStyle, color:"black" }}>Specification</th>
                                                                     <th className="col-8" style={{ ...tableStyle, color:"black" }}>DTPL Observations</th>
                                                                     <th className="col-8" style={{ ...tableStyle, color:"black" }}>TGY Remarks</th>
                                                                  </tr>
                                                               </thead>
                                                               <tbody>
                                                               </tbody>
                                                            </table>
                                                         </Col>
                                                      </Row>
                                                      {sid.pdirDetails !==undefined?sid.pdirDetails.map((pidd, index) => (
                                                         <React.Fragment key={index}>
                                                            {index > -1?(
                                                               <React.Fragment>
                                                                  <Row style={{ display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'none' : 'block'):"") }} >
                                                                     <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                                                        <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed", marginTop:index===0?"0px":"-22px" }}>
                                                                           <tbody>
                                                                              <tr>
                                                                                 <td  className="col-2" style={tableStyle} colSpan={1}>
                                                                                    <b>{index+1}</b>
                                                                                 </td>
                                                                                 <td  className="col-10" style={tableStyle} colSpan={1}>
                                                                                    <b>{pidd.inspectionParameter}</b>
                                                                                 </td>
                                                                                 <td  className="col-5" style={tableStyle} colSpan={1}>
                                                                                    <b>{pidd.inspectionMethod}</b>
                                                                                 </td>
                                                                                 <td  className="col-5" style={tableStyle} colSpan={1}>
                                                                                    <b>{pidd.inspectionStandard}</b>
                                                                                 </td>
                                                                                 <td  className="col-8" style={tableStyle} colSpan={1}>
                                                                                    <Form.Group controlId='inspectionObservations'>
                                                                                       <Form.Control
                                                                                          type='text'
                                                                                          placeholder=''
                                                                                          value={pidd.inspectionObservations}
                                                                                          name="inspectionObservations"
                                                                                          onChange={event => handleChangeInput(index, sid._id, pidd._id, event)}
                                                                                       ></Form.Control>
                                                                                       <p className="validation-error">{errors.inspectionObservations}</p>
                                                                                    </Form.Group>
                                                                                 </td>
                                                                              </tr>
                                                                           </tbody>
                                                                        </table>
                                                                     </Col>
                                                                  </Row>
                                                                  <Row style={{ display: (customerCode!==undefined?(customerCode.trim() === "C0022" ? 'block' : 'none'):"") }} >
                                                                     <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                                                        <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed", marginTop:index===0?"0px":"-22px" }}>
                                                                           <tbody>
                                                                              <tr>
                                                                                 <td  className="col-2" style={tableStyle} colSpan={1}>
                                                                                    <b>{index+1}</b>
                                                                                 </td>
                                                                                 <td  className="col-8" style={tableStyle} colSpan={1}>
                                                                                    <b>{pidd.inspectionParameter}</b>
                                                                                 </td>
                                                                                 <td  className="col-8" style={tableStyle} colSpan={1}>
                                                                                    <b>{pidd.inspectionStandard}</b>
                                                                                 </td>
                                                                                 <td  className="col-8" style={tableStyle} colSpan={1}>
                                                                                    <Form.Group controlId='inspectionObservations'>
                                                                                       <Form.Control
                                                                                          type='text'
                                                                                          placeholder=''
                                                                                          value={pidd.inspectionObservations}
                                                                                          name="inspectionObservations"
                                                                                          onChange={event => handleChangeInput(index, sid._id, pidd._id, event)}
                                                                                       ></Form.Control>
                                                                                       <p className="validation-error">{errors.inspectionObservations}</p>
                                                                                    </Form.Group>
                                                                                 </td>
                                                                                 <td  className="col-8" style={tableStyle} colSpan={1}>
                                                                                    <Form.Group controlId='customerFeedback'>
                                                                                       <Form.Control
                                                                                          type='text'
                                                                                          placeholder=''
                                                                                          value={pidd.customerFeedback}
                                                                                          name="customerFeedback"
                                                                                          onChange={event => handleChangeInput(index, sid._id, pidd._id, event)}
                                                                                       ></Form.Control>
                                                                                       <p className="validation-error">{errors.customerFeedback}</p>
                                                                                    </Form.Group>
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
                                                      )):null}
                                                   </div>
                                                ):
                                                (null)
                                             }
                                          </Tab>
                                       ))}
                                    </Tabs>
                                 </React.Fragment>
                              ):(null)}
                           </Col>
                        </Row>
                        {/* START of LAST row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button 
                                 type='submit' 
                                 className=' my-3 btn-md button-class' 
                                 disabled={ pdirDetails.length === 0 || executing}
                                 onClick={(e) => e.currentTarget.blur()}
                              >
                                 <i className="fas fa-save"></i> Save
                              </Button>
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

export default PDIREditScreen
