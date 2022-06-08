//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Tab } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import { NotificationManager } from 'react-notifications';
import { v4 as uuidv4 } from 'uuid';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';
import { format } from 'date-fns'
import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import { PDIR_LIST_RESET } from '../../constants/qa/pdirConstants';
import { createPDIR, getAllMasterDataForPDIR } from './../../actions/qa/pdirActions';
import { listAllSalesInvoicesForCustomer } from '../../actions/sales/salesInvoiceActions';
import { Tabs } from 'react-bootstrap';


const PDIRCreateScreen = ({ history }) => {
   const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails)
  	const { user } = userDetails

  	const userLogin = useSelector((state) => state.userLogin)
  	const { userInfo } = userLogin

	const pdirCreate = useSelector((state) => state.pdirCreate)
	const { success, pdir, error: errorCreate } = pdirCreate
   
   //disable button on click
   const [executing, setExecuting] = useState(false);

   const [ productCode, setProductCode ] = useState("")
   const [ pdirCode, setPDIRCode ] = useState("")
   const [ pdirDate, setPDIRDate ] = useState(new Date())
   const [ customer, setCustomer ] = useState("")
   const [ customerCode, setCustomerCode ] = useState("")
   const [ salesInvoiceNumber, setSalesInvoiceNumber ] = useState("")
   const [ pdirTemplateID, setPDIRTemplateID ] = useState("")
   const [ salesInvoiceDate, setSalesInvoiceDate ] = useState()
   const [ disposition, setDisposition ] = useState("Approved")
   const [ approvedBy, setApprovedBy ] = useState(userInfo.name)
   const [ totalNumberOfJCs, setTotalNumberOfJCs ] = useState(0)
   const [ invoiceLineDetails, setInvoiceLineDetails ] = useState([{}])
   const [key, setKey] = useState('i0');
   const [ pdirDetails, setPDIRDetails ] = useState([{}])

   const [ pdirTemplateDetails, setPDIRTemplateDetails ] = useState([{}])
   const [ pdirTemplateDetailsCount, setPDIRTemplateDetailsCount ] = useState(0)
   const [ pdirTempDetails, setPDIRTempDetails ] = useState([{
      id: uuidv4(), 
      lineNumber:'1', 
      jcDescription: '', 
      partNumber: '', 
      batchDate: '',
      invoicedQty: '',
      lineDisposition: 'Approved',
      pdirDetails: [{
         pdirid: uuidv4(),
         inspectionParameter: '',
         inspectionMethod: '',
         inspectionStandard: '',
         inspectionObservations: '',
         customerFeedback: ''
      }]
   }])

   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   const masterDataForPDIR = useSelector((state) => state.masterDataForPDIR)

   const { loading: loadingMasterData } = masterDataForPDIR;

   let customers = [];
   let pdirTemplates = [];
 
   let autoIncrementePDIRNo = "";
   if(masterDataForPDIR !== undefined) {
      ////console.log("????????????????? masterDataForPDIR >>>>>>>>>>>>>> ", masterDataForPDIR)
      autoIncrementePDIRNo = masterDataForPDIR.autoIncrementePDIRNo;
      // prodCategories = masterDataForPDIR.prodCategories;
      // prodCodes = masterDataForPDIR.prodCodes;
      // inspectionparams = masterDataForPDIR.inspectionparams;
      // inspectionmethods = masterDataForPDIR.inspectionmethods;
      customers = masterDataForPDIR.customers;
      pdirTemplates = masterDataForPDIR.pdirTemplates;
      ////console.log("customers >>>>>>>>>>>>>> ", pdirTemplates)
   }

   //check to get Customer specific Tax Invocies
   const allSalesInvoiceListForCustomer = useSelector((state) => state.allSalesInvoiceListForCustomer)

   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForPDIR())
      }
		if (success) {
         history.push('/pdirlist')
		   dispatch({ type: PDIR_LIST_RESET })
         NotificationManager.success(`Record has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: PDIR_LIST_RESET })
         NotificationManager.error(`Error in creating Record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

   //Customer specific JCs
   let customerSpecificInvocies = [];

   if(allSalesInvoiceListForCustomer !== undefined) {
      customerSpecificInvocies = allSalesInvoiceListForCustomer.salesInvoices;
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
      e.currentTarget.blur()
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
            createPDIR({
               pdirCode,
               productCode,
               salesInvoiceNumber,
               customer,
               pdirDate,
               disposition,
               approvedBy,
               invoiceLineDetails: pdirTempDetails
            })
         );
      }
   }

   const handleCustomerName = (e) => {
      setInvoiceLineDetails([{}])
      setTotalNumberOfJCs(0)
      setSalesInvoiceDate();
      if(e.value.trim() === "") {
         setCustomer("")
      } else {
         setCustomer(e.value);
         let srs = [...customers];
         let naam = srs.filter(cust=>{
            return cust._id.trim() === e.value.trim();
         })
         //dispatch action to get customer invoices
         console.log("Customer CODE is ", naam[0].custCode)
         setCustomerCode(naam[0].custCode)
         dispatch(listAllSalesInvoicesForCustomer(naam[0]._id))
      }
   }

   const handleInvoiceSelection = (e) => {
      if(e.value.trim() === "") {
         setSalesInvoiceNumber("")
      } else {
         setSalesInvoiceNumber(e.value)
         setPDIRCode("PDIR/"+e.label.slice(-4))
         let srs = [...customerSpecificInvocies];
         let naam = srs.filter(cust=>{
            return cust._id.trim() === e.value.trim();
         })
         //dispatch action to get customer invoices
         ////console.log("Selected Invoice is ", naam[0])
         if(naam[0] !== undefined) {
            //console.log("Selected Invoice is ", naam[0])
            setSalesInvoiceDate(new Date(naam[0].salesInvoiceDate))
            setTotalNumberOfJCs(naam[0].salesInvoiceDetails.length)
            setInvoiceLineDetails(naam[0].salesInvoiceDetails)

            let newSIDetails = [...naam[0].salesInvoiceDetails]
            let newSIDetails1 = newSIDetails.map(sid => {
               sid.id = uuidv4();
               sid.lineNumber = sid.lineNumber; 
               sid.jcDescription = sid.jcNo.jcDescription; 
               sid.partNumber = sid.jcNo.customerPartNumber; 
               sid.batchDate = new Date(sid.batchDate); 
               sid.invoicedQty = sid.invoicedQty; 
               sid.lineDisposition = "Approved"; 

               if(customerCode !== "C0022") {
                  sid.pdirDetails = [{
                     pdirid: uuidv4(),
                     inspectionParameter:'',
                     inspectionMethod:'',
                     inspectionStandard:'',
                     inspectionObservations:'',
                     customerFeedback: ''
                  }];
   
               } else {
                  console.log("Here when Customer Code is TATA GY")
                  console.log(`when JC is ${sid.jcNo.jcDescription} with width = ${sid.jcNo.adWidth} and height = ${sid.jcNo.adHeight} and area = ${sid.jcNo.adArea}`)
                  const insParam = ['Label Dimensions [mm x mm]', 'Label Thickness [mm]', 'Font Legibility/Readability', 'Shade/Colours'];
                  const specification = [`${sid.jcNo.adWidth} X ${sid.jcNo.adHeight}`, '> 0.150', 'As per master sample', 'As per master sample'];
                  let temp = []
                  for (let index = 0; index < insParam.length; index++) {
                     let srs = {};
                     srs.pdirid = uuidv4(); 
                     srs.inspectionParameter = insParam[index]; 
                     srs.inspectionMethod = ''; 
                     srs.inspectionStandard = specification[index]; 
                     srs.inspectionObservations = ''; 
                     srs.customerFeedback = '';
                     
                     temp.push(srs)
                  }
                  console.log("Temparory Array ========= ", temp)
                  sid.pdirDetails = temp;
                  // sid.pdirDetails = [{
                  //    pdirid: uuidv4(),
                  //    inspectionParameter:'Label Dimensions [mm x mm]',
                  //    inspectionMethod:'',
                  //    inspectionStandard: `${sid.jcNo.adWidth} X ${sid.jcNo.adHeight}`,
                  //    inspectionObservations:'',
                  //    customerFeedback: ''
                  // }];
               }


               return sid;
            })
            setPDIRTempDetails(newSIDetails1)
            console.log(":::::::::::: handleInvoiceSelection and newSIDetails1 :::::::::: ", newSIDetails1)
         }
         
      }
   }

   const handlePDIRTemplateSelection = (e, id, index) => {
      console.log("------------------ START handlePDIRTemplateSelection ---------------------")
      if(e.value.trim() === "") {
         setPDIRTemplateID("")
      } else {
         setPDIRTemplateID(e.value)
         let srs = [...pdirTemplates];
         let naam = srs.filter(pid=>{
            return pid._id.trim() === e.value.trim();
         })
         //dispatch action to get customer invoices
        console.log("1.1 ????????? handlePDIRTemplateSelection & sales invoice details id  ", id)
        
         if(naam[0] !== undefined) {
            ////console.log("Selected PDIR Template is ", naam[0])
            //setPDIRTemplateDetails(naam[0].pdirDetails)
            setPDIRTemplateDetailsCount(naam[0].pdirDetails.length)

            let newSIDetails = [...pdirTempDetails]
            //let newSIDetails = JSON.parse(JSON.stringify(invoiceLineDetails))
            console.log("1.2 >>>>>>>>>>>>> newSIDetails <<<<<<<<<< ", newSIDetails)
            console.log("1.21 >>>>>>>>>>>>> id <<<<<<<<<< ", id)
            let newSIDetails1 = newSIDetails.map((sid,index) => {
               console.log("1.20 >>>>>>>>>>>>> sid.id <<<<<<<<<< ", sid.id)
               if(sid.id === id) {
                  console.log("1.23 >>>>>>>>>>>>> Matching id <<<<<<<<<< ", id)
                  sid.id = sid.id;//uuidv4();//sid.id;//
                  sid.lineNumber = sid.lineNumber; 
                  console.log("1.222 >>>>>>>>>>>>> index is <<<<<<<<<< ", index)
                  console.log("1.223 >>>>>>>>>>>>> Line 262 PDIR details sid.pdirDetails are  <<<<<<<<<< ", sid)
                  console.log("1.224 >>>>>>>>>>>>> Line 263 PDIR details sid.pdirDetails are  <<<<<<<<<< ", sid.pdirDetails)
                  let newPDIRDetails = [...naam[0].pdirDetails]
                  //let newPDIRDetails = JSON.parse(JSON.stringify(...naam[0].pdirDetails))
                  //let newPDIRDetails = [...pdirTempDetails[index].pdirDetails]
                  console.log("1.3 :::::::: handlePDIRTemplateSelection & Matching sales invoice details id  ", newPDIRDetails)
                  let newPDIRDetails1 = newPDIRDetails.map(ppid => {
                     let tempid = uuidv4();
                     ppid.pdirid = tempid 
                     ppid.inspectionParameter = ppid.inspectionParameter;
                     ppid.inspectionMethod = ppid.inspectionMethod;
                     ppid.inspectionStandard = ppid.inspectionStandard;
                     ppid.inspectionObservations = ppid.inspectionObservations;
                     ppid.customerFeedback = '';
                     return ppid;
                  })
                  sid.pdirDetails = newPDIRDetails1;
               }
               return sid;
            })
            console.log("1.4 ............ handlePDIRTemplateSelection and newSIDetails1 ", newSIDetails1)
            console.log("1.5 >>>>>>>>>>>>>>>> handlePDIRTemplateSelection and newSIDetails1[0].pdirDetails ", newSIDetails1[0].pdirDetails)
            setPDIRTempDetails(newSIDetails1)
            //setInvoiceLineDetails(newSIDetails1)
            //setPDIRTemplateDetails(newSIDetails1[0].pdirDetails)
         }
      }
      console.log("------------------ END handlePDIRTemplateSelection ---------------------")
   }

   const handleDisposition = (e, id, index) => {
      //console.log("------------------ START handleDisposition ---------------------")
      //console.log("---x--x---x---x---x---- END handleDisposition ---------------------")
      let newSIDetails = [...pdirTempDetails]
      let newSIDetails1 = newSIDetails.map((sid,index) => {
         //console.log("1.20 >>>>>>>>>>>>> sid.id <<<<<<<<<< ", sid.id)
         if(sid.id === id) {
            sid.lineDisposition = e.target.value;
         }
         return sid;
      })
      setPDIRTempDetails(newSIDetails1)
   }

   const handleChangeInput = (index, id, pdirid, event) => {
      let nama = [...pdirTempDetails]
      //console.log("-------- handle Chnage Input Before modification ------------- ", nama)
      const newInputFields = nama.map(i => {
         //console.log("-------- Passed ID is ------------- ", id)
         //console.log("-------- Inut ID is ------------- ", i.id)
         if(id === i.id) {
            //console.log("1. handleChangeInput MATCHING JC is >>>>>>>>>>>>> ", i.jcDescription)
            //console.log("2. handleChangeInput MATCHING Sales Invoice Details Unique ID is >>>>>>>>>>>>> ", id)
            //console.log("3. handleChangeInput MATCHING Index is >>>>>>>>>>>>> ", index)
            ////console.log("3. handleChangeInput MATCHING Sales Invoice Details Unique ID is >>>>>>>>>>>>> ", pdirTempDetails)
            const newPDIRInputFields = i.pdirDetails.map(p => {
               if(pdirid === p.pdirid) {
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
      setPDIRTempDetails(newInputFields);
   }

   //7. Form Reset
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const handleReset = (e) => {
      e.currentTarget.blur()
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
         ) : errorCreate  ? (
            <Message variant='danger'>{ errorCreate }</Message>
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
                              <DatePicker
                                 dateFormat="dd-MMM-yyyy" 
                                 className="form-control"
                                 selected={pdirDate} 
                                 maxDate={new Date()}
                                 onChange={(date) => setPDIRDate(date)} 
                              />
                                 <p className="validation-error">{errors.pdirDate}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='customer'>
                                 <Form.Label>Select Customer<span className="mandatory">*</span></Form.Label>
                                 <Select 
                                    name="customer"
                                    options = {customers!==undefined?(customers.map(cust => {
                                       return { value: cust._id, label: cust.custName }
                                    })):null} 
                                    onChange={event => handleCustomerName(event)}
                                 />
                                 <p className="validation-error">{errors.customer}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='salesInvoiceNumber'>
                                 <Form.Label>Select Invoice #<span className="mandatory">*</span></Form.Label>
                                 <Select 
                                    name="salesInvoiceNumber"
                                    options = {customerSpecificInvocies!==undefined?(customerSpecificInvocies.map(si => {
                                       return { value: si._id, label: si.salesInvoiceNumber }
                                    })):null} 
                                    onChange={event => handleInvoiceSelection(event)}
                                 />
                                 <p className="validation-error">{errors.salesInvoiceNumber}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='salesInvoiceDate'>
                              <Form.Label>Invoice Date<span className="mandatory">*</span></Form.Label>
                              <DatePicker 
                                 dateFormat="dd-MMM-yyyy"
                                 className="form-control"
                                 selected={salesInvoiceDate} 
                                 onChange={(date) => setSalesInvoiceDate(date)} 
                                 readOnly
                              />
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
                                       {pdirTempDetails.map((sid, index) => (
                                          <Tab key={index} eventKey={"i"+index} title={sid.jcDescription} style={{ background:"white" }}>
                                             <Row>
                                                <Col lg={3} md={12} xs={12}>
                                                   <Form.Group controlId='pdirCode'>
                                                      <Form.Label>Part Number<span className="mandatory">*</span></Form.Label>
                                                      <Form.Control
                                                         type='text'
                                                         name='partNumber'
                                                         readOnly
                                                         value={sid.partNumber}
                                                      ></Form.Control>
                                                   </Form.Group>
                                                </Col>
                                                <Col lg={4} md={12} xs={12}>
                                                   <Form.Group controlId='pdirCode'>
                                                      <Form.Label>Part Description<span className="mandatory">*</span></Form.Label>
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
                                                         value={format(new Date(sid.batchDate), 'dd-MMM-yyyy')}
                                                      ></Form.Control>
                                                   </Form.Group>
                                                </Col>
                                                <Col lg={2} md={12} xs={12}>
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
                                             <div style={{ display: customerCode.trim() === "C0022" ? 'none' : 'block' }}>
                                                <Row>
                                                   <Col lg={4} md={12} xs={12}>
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
                                                   </Col>
                                                   <Col lg={4} md={12} xs={12}>
                                                      <Form.Group controlId='disposition'>
                                                         <Form.Label>Disposition<span className="mandatory">*</span></Form.Label>
                                                         <Form.Control
                                                            as='select'
                                                            custom
                                                            name='disposition'
                                                            placeholder='Select'
                                                            value={sid.lineDisposition}
                                                            onChange={(e) => handleDisposition(e, sid.id, index)}
                                                         >
                                                            <option value="Approved">Approved</option>
                                                            <option value="Sent with Deviation">Sent with Deviation</option>
                                                         </Form.Control>
                                                         <p className="validation-error">{errors.disposition}</p>
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
                                                      <React.Fragment>
                                                         <Row>
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
                                                         {pdirTempDetails[index].pdirDetails.map((pidd, index) => (
                                                            <React.Fragment key={index}>
                                                               {index > -1?(
                                                                  <React.Fragment>
                                                                     <Row>
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
                                                                                             onChange={event => handleChangeInput(index, sid.id, pidd.pdirid, event)}
                                                                                          ></Form.Control>
                                                                                          <p className="validation-error">{errors.inspectionObservations}</p>
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
                                                         ))}
                                                      </React.Fragment>
                                                   ):
                                                   (null)
                                                }
                                             </div>
                                             <div style={{ display: customerCode.trim() === "C0022" ? 'block' : 'none' }}>
                                                <Row>
                                                   <Col lg={4} md={12} xs={12}>
                                                      <Form.Group controlId='disposition'>
                                                         <Form.Label>Disposition<span className="mandatory">*</span></Form.Label>
                                                         <Form.Control
                                                            as='select'
                                                            custom
                                                            name='disposition'
                                                            placeholder='Select'
                                                            value={sid.lineDisposition}
                                                            onChange={(e) => handleDisposition(e, sid.id, index)}
                                                         >
                                                            <option value="Accepted">Accepted</option>
                                                            <option value="Rejected">Rejected</option>
                                                         </Form.Control>
                                                         <p className="validation-error">{errors.disposition}</p>
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
                                                <Row>
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
                                                {pdirTempDetails[index].pdirDetails.map((pidd, index) => (
                                                   <React.Fragment key={index}>
                                                      {index > -1?(
                                                         <React.Fragment>
                                                            <Row>
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
                                                                                    onChange={event => handleChangeInput(index, sid.id, pidd.pdirid, event)}
                                                                                 ></Form.Control>
                                                                                 <p className="validation-error">{errors.inspectionObservations}</p>
                                                                              </Form.Group>
                                                                           </td>
                                                                           <td  className="col-8" style={tableStyle} colSpan={1}>
                                                                              <b>{pidd.customerFeedback}</b>
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
                                                ))}
                                             </div>
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
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={(e)=>handleReset(e)}><i className="fas fa-undo"></i> Reset</Button>
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

export default PDIRCreateScreen
