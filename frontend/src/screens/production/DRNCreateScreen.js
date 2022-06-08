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

//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';
//import DRN Redux "action(s)"
import { createDRN, getAllMasterDataForDRN } from '../../actions/production/drnActions';

//import Redux "constantc(s)"
import { DRN_CREATE_RESET, DRN_MASTER_LIST_RESET } from '../../constants/production/drnConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import { getCustomerOpenSalesOrders } from '../../actions/sales/salesOrderActions';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import StepperComponent from './../../components/app/StepperComponent';
import { getCustomerJCs, getCustomerJCPOs } from './../../actions/masters/jcMasterActions';
import DRNCreationModal from '../../components/modals/DRNCreationModal';
import { OPEN_CUSTOMER_SO_LIST_RESET } from '../../constants/sales/salesOrderConstants';
import { JC_MASTER_CUSTOMER_LIST_RESET, JC_MASTER_CUSTOMER_PO_LIST_RESET } from '../../constants/masters/jcMasterConstants';

import Model from './../../components/modals/videoModal';
import DRNCreationVideoModal from './../../components/modals/DRNCreationVideoModal';



const DRNCreateScreen = ({ history, location }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin
   
   //console.log("00. _________ This is start of the userInfo ________________ ", userInfo.companyAddress[0])
   
   //2. Get the master data required for DRN generation
   
   const drnCreate = useSelector((state) => state.drnCreate)

   const { success, drn, error: errorCreate } = drnCreate

   const masterDataForDRN = useSelector((state) => state.masterDataForDRN)

   const { loading: loadingMasterData } = masterDataForDRN;

   //check to get Customer specific open orders
   const customerOpenSalesOrderList = useSelector((state) => state.customerOpenSalesOrderList)
   const { loading: loadingOpenSalesOrder } = customerOpenSalesOrderList;

   //check to get Customer specific JCs
   const allCustomerJCList = useSelector((state) => state.allCustomerJCList)
   const { success: successCustomerJCs, loading: loadingCustomerJCs } = allCustomerJCList;

   //check to get Customer specific JCs
   const allCustomerJCPOList = useSelector((state) => state.allCustomerJCPOList)
   const { success: successCustomerJCPOs, loading: loadingCustomerJCPOs } = allCustomerJCPOList;

   //console.log("!!!!!!!!! On Page Load Called and Customer JC Details are ---------- ", allCustomerJCList)
   //console.log("@@@@@@@@ On Page Load Called and Customer JC PO Details are @@@@@@@@@ ", allCustomerJCPOList)

   //Customer specific JCs
   //let customerOpenSalesOrders = [];
   let customers = [];
   let options = [];
   let autoIncrementedDRNNo = "";
   let supplierAddressOptions = [];
   //let customerBillingAddressOptions = [];
   //let customerShipingAddressOptions = [];

   //Customer specific JCs
   //let customerSpecificJCs = [];
   let customerSpecificJCOptions = [];
   let customerSpecificJCPOOptions = [];
   let paymentOptionsList = [
      { id: 0, name:"Within 30 Days" },
      { id: 1, name:"Within 45 Days" },
      { id: 2, name:"Within 60 Days" },
      { id: 3, name:"100% Advance" }
   ]
   let paymentOptions = []

   //4. Define All Form Variables and their state
   const [ drnNumber, setDRNNo ] = useState(autoIncrementedDRNNo);
   const [ drnDate, setDRNDate] = useState(new Date());
   const [ customer, setCustomer ] = useState("");
   const [ customerCode, setCustomerCode ] = useState("");
   // const [ customerId, setCustomerId ] = useState("");
   const [ jcId, setJCId ] = useState("");
   const [ jcPO, setJCPOId ] = useState("");
   const [ customerSpecificJCs, setCustomerSpecificJCs ] = useState([]);
   const [ customerSpecificJCPOs, setCustomerSpecificJCPOs ] = useState([]);
   const [ openSOCount, setOpenSOCount ] = useState(0);
   const [ supplierAddressIndex, setSupplierAddressIndex ] = useState(-1);
   const [ supplierAddress, setSupplierAddress ] = useState([{}]);
   //customer bill to address
   const [ customerBillingAddressIndex, setCustomerBillingAddressIndex ] = useState(-1);
   const [ customerBillingAddress, setCustomerBillingAddress ] = useState([{}]);
   //customer ship to address
   const [ customerShipingAddressIndex, setCustomerShipingAddressIndex ] = useState(-1);
   const [ customerShipingAddress, setCustomerShipingAddress ] = useState([{}]);
   //customer ship to/bill to address options
   const [customerBillingAddressOptions, setCustomerBillingAddressOptions] = useState([]);
   const [customerShipingAddressOptions, setCustomerShipingAddressOptions] = useState([]);
   
   const [ billState, setBillState ] = useState("");
   const [ billPinCode, setBillPinCode ] = useState("");
   const [ shipState, setShipState ] = useState("");
   const [ shipPinCode, setShipPinCode ] = useState("");
   const [ batchId, setBatchId ] = useState("");
   const [ viewOpenOrders, setViewOpenOrders ] = useState("none");
   const [ openSalesOrdersForCustomer, setOpenSalesOrdersForCustomer ] = useState([]);
   //const [ batchId, setBatchId ] = useState([{}]);

   const [ dispObj, setDispObj ] = useState({name:'', value:0});

   //empty object array to store 
   const [drnDetails, setDRNDetails] = useState([{}]);

   const [disable, setDisable] = useState(false);
   const [buttonClicked, setButtonClicked] = useState([]);

   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});
   const [firstTimeMessage, setFirstTimeMessage] = useState(true);

   //payment option
   const [ paymentTerms, setPaymentTerms ] = useState("Within 30 Days"); 
   const [ selectedPaymentOption, setSelectedPaymentOption] = useState([{ label: "Within 30 Days", value: 1 }]);
   
   //disable button on click
   const [executing, setExecuting] = useState(false);

   //9. Trigger useEffect hook to get all the form details
   useEffect(() => {
      
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForDRN())
      }
		if (success) {
         //history.push(`/drn/${drn._id}/edit`)
		   dispatch({ type: DRN_CREATE_RESET })
		   dispatch({ type: DRN_MASTER_LIST_RESET })
		   dispatch({ type: OPEN_CUSTOMER_SO_LIST_RESET })
		   dispatch({ type: JC_MASTER_CUSTOMER_LIST_RESET })
         history.push('/drnlist')
         NotificationManager.success(`DRN # ${drn.drnNumber} has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(successCustomerJCs) {
         //dispatch({ type: JC_MASTER_CUSTOMER_LIST_RESET })
      }

      if(successCustomerJCPOs) {
         //dispatch({ type: JC_MASTER_CUSTOMER_PO_LIST_RESET })
      }

      if(errorCreate) {
         dispatch({ type: DRN_CREATE_RESET })
         dispatch({ type: DRN_MASTER_LIST_RESET })
         dispatch({ type: OPEN_CUSTOMER_SO_LIST_RESET })
         dispatch({ type: JC_MASTER_CUSTOMER_LIST_RESET })
         NotificationManager.error(`Error in creating DRN !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

      if(allCustomerJCList !== undefined) {
         if(customerCode !== "C0022") {
            setCustomerSpecificJCs(allCustomerJCList.customerJCs);
         }
      }

      if(allCustomerJCPOList !== undefined) {
         if(allCustomerJCPOList.customerJCs !== undefined) {
            if(customerCode === "C0022") {
               //console.log("---- Customer is TATA TGY and details are ========== ", allCustomerJCPOList.customerJCs.length)
               //console.log("---- Customer is TATA TGY and customerJCIDs details are ========== ", allCustomerJCPOList.customerJCIDs.length)
               //setCustomerSpecificJCs(allCustomerJCPOList.customerJCs);
               setCustomerSpecificJCPOs(allCustomerJCPOList.customerJCIDs);
            }
         }
      }

      if(customerOpenSalesOrderList !== undefined) {
         //console.log("203. useEffect >>>> customerOpenSalesOrderList.salesOrders ==== ", customerOpenSalesOrderList.salesOrders)
         setOpenSalesOrdersForCustomer(customerOpenSalesOrderList.salesOrders);
         //setOpenSOCount(openSalesOrdersForCustomer.length)
      }
      if(firstTimeMessage){
         //console.log("UseEffect ---> firstTimeMessage ----> ", firstTimeMessage)
         setTimeout(() => handleShow(), 2000);
         setTimeout(() => handleClose(), 15000);
      }

		// eslint-disable-next-line
	}, [history, success, customer, jcId, loadingCustomerJCs, loadingCustomerJCPOs, loadingOpenSalesOrder])

   // if(customerOpenSalesOrderList !== undefined) {
   //    customerOpenSalesOrders = customerOpenSalesOrderList.salesOrders;
   //    //setOpenSOCount(openSalesOrdersForCustomer.length)
   // }

   //console.log(" >>>>>>>>>>> 221. On PAGE LOAD openSalesOrdersForCustomer ========= ", openSalesOrdersForCustomer)

   //3. Set Master Data on The Screen
   if(masterDataForDRN !== undefined) {
      customers = masterDataForDRN.customers
      autoIncrementedDRNNo = masterDataForDRN.autoIncrementedDRNNo
      if(customers !== undefined) {
         customers.map(customer => {
            let dropDownEle = { label: customer.custName, value: customer._id };
            return options.push(dropDownEle);
         });
      }
      //setDRNNo(autoIncrementedDRNNo);
   }

   if(userInfo !== undefined) {
      const addresses = userInfo.companyAddress
      if(addresses !== undefined) {
         addresses.map((address, index) => {
            let fullAddress = `${address.addressLine1}, ${address.addressLine2}, ${address.addressLine3}`
            let dropDownEle = { label: fullAddress, value: index };
            return supplierAddressOptions.push(dropDownEle);
         });
      }
   }

   if(customerSpecificJCs!==undefined) {
      customerSpecificJCs.map(jc => {
         let dropDownEle = { label: jc.jcDescription, value: jc._id };
         return customerSpecificJCOptions.push(dropDownEle);
      })
   }

   if(customerSpecificJCPOs!==undefined) {
      //console.log("Length of customerSpecificJCPOs ===== ", customerSpecificJCPOs.length)
      customerSpecificJCPOs.map(po => {
         //console.log("PO name is ", po)
         let dropDownEle = { label: po, value: po };
         return customerSpecificJCPOOptions.push(dropDownEle);
      })
   }

   paymentOptionsList.map(po => {
      let dropDownEle = { label: po.name, value: po.id };
      return paymentOptions.push(dropDownEle);
   })
   
   //5. Different Form Variable State handlers
   const handleCustomerName = (e) => {
      setFirstTimeMessage(false);
      dispatch({ type: OPEN_CUSTOMER_SO_LIST_RESET })
      //console.log(">>>>>. handleCustomerName openSalesOrdersForCustomer >>>>>>>>>> ", openSalesOrdersForCustomer)
      //openSalesOrdersForCustomer = undefined;

      if(e.value.trim() === "") {
         //setCustomer("")
         setDRNDetails([{}]);
      } else {
         setCustomer(e.value);
         let srs = [...customers];
         let naam = srs.filter(cust=>{
            return cust._id.trim() === e.value.trim();
         })
         //dispatch(getCustomerJCs(naam[0]._id))
         setCustomerCode((naam === undefined || naam[0] === undefined)? "":naam[0].custCode);
         setBillState((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillState);
         setBillPinCode((naam === undefined || naam[0] === undefined)? "":naam[0].custBillingAddress[0].custBillPinCode);
         setShipState((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipState);
         setShipPinCode((naam === undefined || naam[0] === undefined)? "":naam[0].custShipingAddress[0].custShipPinCode);
         resetErrorMessage("customer")
         
         if(naam[0].custCode === "C0022") {
            console.log("When customer is TGY --------> ")
            dispatch(getCustomerJCPOs(naam[0]._id))
         } else {
            dispatch(getCustomerJCs(naam[0]._id))
         }
         
         let customerBillingAddressOptions1 = []
         //let customerShipingAddressOptions1 = []
         if(naam[0] !== undefined) {
            const addresses = naam[0].customerAddress
            if(addresses !== undefined) {
               addresses.map((address, index) => {
                  let fullAddress = `${address.addressLine1} ${address.addressLine2} ${address.addressLine3}`
                  let dropDownEle = { label: fullAddress, value: index };
                  return customerBillingAddressOptions1.push(dropDownEle);
               });
            }
         }
         setCustomerBillingAddressOptions(customerBillingAddressOptions1)
         setCustomerShipingAddressOptions(customerBillingAddressOptions1)
         //dispatch(getCustomerOpenSalesOrders(naam[0]._id))
         //setOpenSOCount(openSalesOrdersForCustomer!==undefined?openSalesOrdersForCustomer.length:0)
         //setDRNDetails([{}]);

      }
   }

   const handleSupplierAddress = (e) => {
      setSupplierAddressIndex(e.value)
      //console.log("----------handleSupplierAddress e.value =========== ", e.value)
      setSupplierAddress(userInfo.companyAddress[e.value])
      //console.log("----------handleSupplierAddress userInfo.companyAddress =========== ", userInfo.companyAddress)
      //console.log("----------handleSupplierAddress userInfo.companyAddress[e.value] =========== ", userInfo.companyAddress[e.value])
      resetErrorMessage("supplierAddress")
   }

   const handleBillingAddress = (e) => {
      setCustomerBillingAddressIndex(e.value)
      //const billto = [...customerBillingAddressOptions]
      //
      //let srs = billto[e.value]
      //console.log("1. handleBillingAddress >>> SELECTED bill to address ", srs)
      let srs = [...customers];
      let naam = srs.filter(cust=>{
         return cust._id.trim() === customer;
      })

	   const addresses = naam[0].customerAddress
      let sdk = addresses[e.value]
      setCustomerBillingAddress(sdk)

      resetErrorMessage("customerBillingAddress")
   }

   const handleShipingAddress = (e) => {
      setCustomerShipingAddressIndex(e.value)
      let srs = [...customers];
      let naam = srs.filter(cust=>{
         return cust._id.trim() === customer;
      })

	   const addresses = naam[0].customerAddress
      let sdk = addresses[e.value]
      setCustomerShipingAddress(sdk)

      resetErrorMessage("customerShipingAddress")
   }

   const handleViewOpenOrders = (e) => {
      let option = e.target.value;
      setViewOpenOrders(option)
      if(option === "SO") {
         dispatch(getCustomerOpenSalesOrders(customer))
         setOpenSOCount(openSalesOrdersForCustomer!==undefined?openSalesOrdersForCustomer.length:0)
         setDRNDetails([{}]);
      } else if(option === "JC") {
         setDRNDetails([{}]);
      }
   }

   const handleJCChanges = (e) => {
      let srs = [...customerSpecificJCs];
      let naam = srs.filter(pc=>{
         //return pc._id.trim() === e.target.value.trim();
         return pc._id.trim() === e.value.trim();
      })
      setJCId(naam[0]._id);
      dispatch(getCustomerOpenSalesOrders(naam[0]._id))
   }

   const handleJCPOChanges = (e) => {
      if(allCustomerJCPOList !== undefined) {
         if(customerCode === "C0022") {
            //console.log("handleJCPOChanges >>>>>>>>> Initial allCustomerJCPOList.customerJCs --------- ", allCustomerJCPOList.customerJCs)
            let srs = JSON.parse(JSON.stringify(allCustomerJCPOList.customerJCs));//[...customerSpecificJCs];
            //console.log("handleJCPOChanges >>>>>>> Selected PO is === ", e.value)
            let naam = srs.filter(pc=>{
               return pc.jcCustomerDetails[0].customerPONumber.trim() === e.value.trim();
            })
            setJCPOId(e.value);
            //console.log("handleJCPOChanges >>>>>>>>> Filtered JC  --------- ", naam)
            setCustomerSpecificJCs(naam)
         }
      }
     
      //dispatch(getCustomerOpenSalesOrders(naam[0]._id))
   }

   const handleAddDRNDetails = (e, id) => {
      const { name } = e.target;
      let srs = openSalesOrdersForCustomer.map(object => ({ ...object }))

      let selectedSO = srs[id];

      let insertDRNDetails = {};
      insertDRNDetails.drnLineNumber = 1;
      insertDRNDetails.soNo = selectedSO._id;
      insertDRNDetails.soNumber = selectedSO.soNumber;
      insertDRNDetails.soLineNumber = selectedSO.lineNumber;
      insertDRNDetails.batchId = batchId;
      insertDRNDetails.batchDate = selectedSO.batchDate;
      insertDRNDetails.jcNo = selectedSO.jcId;
      insertDRNDetails.jcDescription = selectedSO.jcDescription;
      insertDRNDetails.customerPartNumber = selectedSO.customerPartNumber;
      insertDRNDetails.dispatchQty = selectedSO.dispatchQty;
      insertDRNDetails.addedQty = selectedSO.dispatchQty;
      insertDRNDetails.invoicedQty = selectedSO.invoicedQty;
      insertDRNDetails.drnUnitRate = selectedSO.soUnitRate;
      insertDRNDetails.drnLineValue = parseFloat(selectedSO.dispatchQty) * parseFloat(selectedSO.soUnitRate);

      setDRNDetails([...drnDetails, insertDRNDetails]);

      setDisable(true);
      let btnClickName = name+selectedSO.jcId+selectedSO.lineNumber;
      
      setButtonClicked([...buttonClicked, btnClickName])
      
      setDispObj({ [name]: "clicked" })
      resetErrorMessage("drndetails")
   }

   const handleRemoveFields = id => {
      const values  = [...drnDetails];
      values.splice(id,id);
      setDRNDetails(values);
   }

   const handleBatch = (e, index) => {
      const { name, value } = e.target;
      if(e.target.value === "none") {
         openSalesOrdersForCustomer[index].availableQty = 0;
         openSalesOrdersForCustomer[index].batchDate = null;
         setDispObj({ [name]: value })
      } else {
         let fgmid = openSalesOrdersForCustomer[index].fgmiDetails;
         let naam = fgmid.filter(fm=>{
            if(fm._id === e.target.value) {
               openSalesOrdersForCustomer[index].availableQty = fm.batchQuantity
               openSalesOrdersForCustomer[index].batchDate = fm.batchDate
               return fm;
            }
         } )
         setDispObj({ [name]: value })
      }
      setBatchId(e.target.value);
      //setBatchId([{ [name]: value }])
   }

   const handleDispatchQty = (e, index) => {
      const { name, value } = e.target;
      setDispObj({ [name]: value })

      openSalesOrdersForCustomer[index].dispatchQty = parseInt(e.target.value !== null ? e.target.value:"0")
   }


   //6. Form Validation

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( customer.trim().length === 0 ) {
         newErrors.customer = 'Select a Customer!'
      }

      if ( supplierAddressIndex === -1 ) {
         newErrors.supplierAddress = 'Select a Supplier Address!'
      }
      if ( customerBillingAddressIndex === -1 ) {
         newErrors.customerBillingAddress = 'Select Customer\'s Bill To Address!'
      }
      if ( customerShipingAddressIndex === -1 ) {
         newErrors.customerShipingAddress = 'Select Customer\'s Ship To Address!'
      }
      if ( paymentTerms.trim().length === 0 ) {
         newErrors.customerShipingAddress = 'Select Payment Terms!'
      }

      
      
      // drnDetails.map((openSO, index) => {
      //    if(openSO.soNumber === undefined) {
      //       newErrors.drndetails = 'Enter DRN Details!'
      //    }
      // })

      return newErrors;
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

   const handlePaymentTermsChanges = (e) => {
      let srs = [...paymentOptionsList];
      let naam = srs.filter(po=>{
         return po.id === e.value;
      })
      let dropDownPTEle = { label: naam[0].name, value: e.value };
      setSelectedPaymentOption(dropDownPTEle);
		setPaymentTerms(naam[0].name);
   }

   //8. Form Submit
   const submitHandler = (e) => {
      e.preventDefault();

      const newErrors = findFormErrors();

      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
         NotificationManager.error(`Please fill in the required details !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      } 
       else {
         setExecuting(true);
         //console.log("1. Before Inserting supplierAddressIndex ====== ", supplierAddressIndex)
         //console.log("2. Before Inserting customerBillingAddressIndex ====== ", customerBillingAddressIndex)
         //console.log("3. Before Inserting customerShipingAddressIndex ====== ", customerShipingAddressIndex)
         dispatch(
            createDRN({
               drnNumber: autoIncrementedDRNNo,
               supplierAddressIndex,
               supplierAddress,
               customerBillingAddressIndex,
               customerBillingAddress,
               customerShipingAddressIndex,
               customerShipingAddress,
               paymentTerms,
               drnDate,
               customer,
               billState,
               billPinCode,
               shipState,
               shipPinCode,
               drnDetails
            })
         )
       }
   }

   /** styling start */
   let tableStyle = {
      border: "1px solid black",
      width: "100%",
      height: "100%",
      fontFamily:"Arial"
   }
   /** styling end */
   let showDRNCreationModal = localStorage.getItem('showDRNCreationModal')=== "false"? false:true;
   const [show, setShow] = useState(false);

   const handleClose = () => {
      setShow(false);
      setFirstTimeMessage(false);
   }
   const handleShow = () => setShow(true);
   const handleShowHelp = (e) => {
      e.currentTarget.blur()
      setFirstTimeMessage(true);
      setShow(true);
   }

   return (
      <FormContainer>
         { firstTimeMessage && showDRNCreationModal ? <DRNCreationModal onShow={show} onClose={handleClose} userInfo={userInfo} />:null}
         <Breadcrumb
            listPage = "drnlist"
         />
         <br></br>
         <>
            <StepperComponent activeStep= {0} />
            <br></br>
            <Row>
               <Col lg={6} md={12} xs={12}>
                  <h4>Dispatch Request Note Details Entry</h4>
               </Col>
               <Col lg={6} md={12} xs={12} style={{textAlign:"right"}}>
                  {/*<Model />*/}
                  <Button className="btn-sm " style={{background:"rgb(232, 67, 71)"}} onClick={(e)=>handleShowHelp(e)}><i className="fas fa-info-circle fa-2x"></i></Button>
               </Col>
            </Row>
            <br />
            <FormFieldsContainer  frameTitle = "Please Enter DRN Details !!!" >
               <Form onSubmit={submitHandler}>
                  <Col>
                     {/* START of 1st row in the form */}
                     <Row>
                        <Col lg={4} md={12} xs={12}>
                           <Form.Group controlId='drnNumber'>
                           <Form.Label>DRN #<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='drnNumber'
                                 readOnly
                                 value={autoIncrementedDRNNo}
                                 onChange={(e) => setDRNNo(e.target.value)}
                              ></Form.Control>
                           </Form.Group>
                        </Col>
                        <Col lg={4} md={12} xs={12}>
                           <Form.Group controlId='drnDate'>
                              <Form.Label>DRN Date<span className="mandatory">*</span></Form.Label>
                              <DatePicker
                                 dateFormat="dd-MMM-yyyy" 
                                 className="form-control"
                                 selected={drnDate} 
                                 onChange={(date) => setDRNDate(date)} 
                                 maxDate={new Date()}
                              />
                              <p className="validation-error">{errors.drnDate}</p>
                           </Form.Group>
                        </Col>
                        <Col lg={4} md={12} xs={12}>
                           <Form.Group controlId='customer'>
                              <Form.Label>Select Customer<span className="mandatory">*</span></Form.Label>
                              <Select
                                 style={{background:"#e84347", color:"white"}} 
                                 options={options}
                                 onChange={(e) => handleCustomerName(e)}
                              />
                              <p className="validation-error">{errors.customer}</p>
                           </Form.Group>
                        </Col>
                     </Row>
                     <Row>
                        <Col lg={12} md={12} xs={12}>
                           <Form.Group controlId='supplierAddress'>
                              <Form.Label>Select Supplier Address<span className="mandatory">*</span></Form.Label>
                              <Select
                                 style={{background:"#e84347", color:"white"}} 
                                 options={supplierAddressOptions}
                                 onChange={(e) => handleSupplierAddress(e)}
                              />
                              <p className="validation-error">{errors.supplierAddress}</p>
                           </Form.Group>
                        </Col>
                     </Row>
                     <Row>
                        <Col lg={6} md={12} xs={12}>
                           <Form.Group controlId='customerBillingAddress'>
                              <Form.Label>Select Bill To Address<span className="mandatory">*</span></Form.Label>
                              <Select
                                 style={{background:"#e84347", color:"white"}} 
                                 options={customerBillingAddressOptions}
                                 onChange={(e) => handleBillingAddress(e)}
                              />
                              <p className="validation-error">{errors.customerBillingAddress}</p>
                           </Form.Group>
                        </Col>
                        <Col lg={6} md={12} xs={12}>
                           <Form.Group controlId='customerShipingAddress'>
                              <Form.Label>Select Ship To Address<span className="mandatory">*</span></Form.Label>
                              <Select
                                 style={{background:"#e84347", color:"white"}} 
                                 options={customerBillingAddressOptions}
                                 onChange={(e) => handleShipingAddress(e)}
                              />
                              <p className="validation-error">{errors.customerShipingAddress}</p>
                           </Form.Group>
                        </Col>
                     </Row>
                     <Row>
                        <Col 
                           lg={4} md={12} xs={12}
                           style={{ display: (customerCode!==undefined?(customerCode.trim() !== "C0022" ? 'none' : 'block'):"") }}
                        >
                           <Form.Group controlId='jcId'>
                              <Form.Label>Select PO#<span className="mandatory">*</span></Form.Label>
                              <Select
                                 disabled={customer.trim().length===0}
                                 style={{background:"#e84347", color:"white"}} 
                                 options={customerSpecificJCPOOptions}
                                 name="jcPO"
                                 onChange={(e) => handleJCPOChanges(e)}
                              />
                              <p className="validation-error">{errors.jcNo}</p>
                           </Form.Group>
                        </Col>
                        <Col 
                           lg={(customerCode!==undefined?(customerCode.trim() !== "C0022" ? 6 : 4):6)} 
                           md={12} xs={12}>
                           <Form.Group controlId='jcId'>
                              <Form.Label>Select JC<span className="mandatory">*</span></Form.Label>
                              <Select
                                 disabled={customer.trim().length===0}
                                 style={{background:"#e84347", color:"white"}} 
                                 options={customerSpecificJCOptions}
                                 
                                 name="jcId"
                                 onChange={(e) => handleJCChanges(e)}
                              />
                              <p className="validation-error">{errors.jcNo}</p>
                           </Form.Group>
                        </Col>
                        <Col 
                           lg={(customerCode!==undefined?(customerCode.trim() !== "C0022" ? 6 : 4):6)} 
                           md={12} xs={12}>
                           <Form.Group controlId='paymentTerms'>
                              <Form.Label>Select Payment Terms<span className="mandatory">*</span></Form.Label>
                              <Select
                                 disabled={customer.trim().length===0}
                                 style={{background:"#e84347", color:"white"}} 
                                 options={paymentOptions}
                                 value={selectedPaymentOption}
                                 name="jcId"
                                 onChange={(e) => handlePaymentTermsChanges(e)}
                              />
                              <p className="validation-error">{errors.paymentTerms}</p>
                           </Form.Group>
                        </Col>
                        {/*<Col lg={4} md={12} xs={12}>
                           <Form.Label>Select JC<span className="mandatory">*</span></Form.Label>
                           <Form.Group controlId='jcId'>
                              <Form.Control
                                 disabled={customer.trim().length===0}
                                 as='select'
                                 custom
                                 placeholder='Select JC'
                                 value={jcId}
                                 name="jcId"
                                 onChange={e => handleJCChanges(e)}
                              >
                                 <option value="none">Select</option>
                                 {customerSpecificJCs!==undefined?(customerSpecificJCs.map(jc => {
                                    return <option key={jc._id}  value={jc._id}>{jc.jcDescription}</option>
                                 })):null}
                              </Form.Control>
                              <p className="validation-error">{errors.jcNo}</p>
                           </Form.Group>
                           </Col>*/}
                     </Row>
                     <hr></hr>
                     {/* START of 2nd row in the form */}
                     <Row>
                        <Col>
                           <h5>Address Details</h5>
                        </Col>
                     </Row>
                     <Row>
                        <Col lg={3} md={12} xs={12}>
                           <Form.Group controlId='billState'>
                           <Form.Label>State of Supply (BILL)<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='billState'
                              readOnly
                              value={billState}
                              onChange={(e) => setBillState(e.target.value)}
                           ></Form.Control>
                           </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                           <Form.Group controlId='billPinCode'>
                           <Form.Label>Pincode<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='billPinCode'
                              readOnly
                              value={billPinCode}
                              onChange={(e) => setBillPinCode(e.target.value)}
                           ></Form.Control>
                           </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                           <Form.Group controlId='shipState'>
                           <Form.Label>State of Supply (SHIP)<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='shipState'
                              readOnly
                              value={shipState}
                              onChange={(e) => setShipState(e.target.value)}
                           ></Form.Control>
                           </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                           <Form.Group controlId='shipPinCode'>
                           <Form.Label>Pincode<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='shipPinCode'
                              readOnly
                              value={shipPinCode}
                              onChange={(e) => setShipPinCode(e.target.value)}
                           ></Form.Control>
                           </Form.Group>
                        </Col>
                     </Row>
                     <hr></hr>
                     {/* START of 3rd row in the form */}
                     {(loadingOpenSalesOrder===undefined || openSalesOrdersForCustomer === undefined)?
                        (  <Row>
                              <Col><h6></h6></Col>
                           </Row>
                        ):
                        ((openSalesOrdersForCustomer.length>0)?
                           (
                              <React.Fragment>
                                 {/* START of 4th row in the form */}
                                 <Row>
                                    <Col>
                                       <h5>Open Sales Orders Details</h5>
                                    </Col>
                                 </Row>
                                 <br></br>
                                 
                                 { openSalesOrdersForCustomer.map((openSO, index) => (
                                    <React.Fragment key={index} >
                                       <div key={index} style={{border:index%2===0?"1px solid red":"1px solid black"}} className="my-2">
                                          <Row key={index} className="mx-2 my-2">
                                             <Col lg={2} md={12} xs={12}>
                                                <Form.Group controlId={'soNumber'+index}>
                                                   <Form.Label>SO #</Form.Label>
                                                      <Form.Control
                                                         type='text'
                                                         placeholder=''
                                                         value={openSO.soNumber}
                                                         name="soNumber"
                                                         readOnly
                                                      ></Form.Control>
                                                </Form.Group>
                                             </Col>
                                             <Col lg={3} md={12} xs={12}>
                                                <Form.Group controlId={'soDate'+index}>
                                                   <Form.Label>SO Date</Form.Label>
                                                   <DatePicker
                                                      readOnly
                                                      dateFormat="dd-MMM-yyyy"
                                                      className="form-control"
                                                      selected={new Date(openSO.soDate)} 
                                                   />
                                                </Form.Group>
                                             </Col>
                                             <Col lg={2} md={12} xs={12}>
                                                <Form.Group controlId={'lineNumber'+index}>
                                                   <Form.Label>SO Line #</Form.Label>
                                                   <Form.Control
                                                         type='text'
                                                         placeholder=''
                                                         value={openSO.lineNumber}
                                                         name="lineNumber"
                                                         readOnly
                                                   ></Form.Control>
                                                </Form.Group>
                                             </Col>
                                             <Col lg={5} md={12} xs={12}>
                                                <Form.Group controlId={'jcDescription'+index}>
                                                   <Form.Label>JC Description</Form.Label>
                                                   <Form.Control
                                                         type='text'
                                                         placeholder=''
                                                         value={openSO.jcDescription}
                                                         name="jcDescription"
                                                         readOnly
                                                   ></Form.Control>
                                                </Form.Group>
                                             </Col>
                                          </Row>
                                          <Row className="mx-2 my-2">
                                             <Col lg={2} md={12} xs={12}>
                                                <Form.Group controlId={'orderedQty'+index}>
                                                   <Form.Label>Ordered Qty</Form.Label>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={openSO.orderedQty}
                                                      name="orderedQty"
                                                      readOnly
                                                   ></Form.Control>
                                                </Form.Group>
                                             </Col>
                                             <Col lg={2} md={12} xs={12}>
                                                <Form.Group controlId={'balancedQty'+index}>
                                                   <Form.Label>Balance Qty</Form.Label>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={openSO.balancedQty}
                                                      name="balancedQty"
                                                      readOnly
                                                   ></Form.Control>
                                                </Form.Group>
                                             </Col>
                                             <Col lg={3} md={12} xs={12}>
                                                <Form.Group controlId={'batchDate'+index}>
                                                   <Form.Label>Select Batch</Form.Label>
                                                   <Form.Control
                                                      as='select'
                                                      custom
                                                      name={'batchDate'+index}
                                                      placeholder='Select Batch'
                                                      value={dispObj.value}
                                                      onChange={(e) => handleBatch(e, index)}
                                                   >
                                                      <option value="none">Select Batch</option>
                                                      {openSO.fgmiDetails!==undefined?
                                                         (openSO.fgmiDetails.map(fgmi => {
                                                         return <option key={fgmi._id} value={fgmi._id}>
                                                            {format(new Date(fgmi.batchDate), 'dd-MMM-yyyy')}
                                                         </option>
                                                      })):null}
                                                   </Form.Control>
                                                </Form.Group>
                                             </Col>
                                             <Col lg={2} md={12} xs={12}>
                                                <Form.Group controlId={'availableQty'+index}>
                                                   <Form.Label>Available Qty</Form.Label>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={openSO.availableQty}
                                                      name="availableQty"
                                                      readOnly
                                                   ></Form.Control>
                                                </Form.Group>
                                             </Col>
                                             <Col lg={2} md={12} xs={12}>
                                                <Form.Group controlId={'dispatchQty'+index}>
                                                   <Form.Label>Dispatch Qty</Form.Label>
                                                   <Form.Control
                                                      type='number'
                                                      placeholder=''
                                                      value={dispObj.value}
                                                      name= {'dispatchQty'+index}
                                                      onChange={ (e) => handleDispatchQty(e, index) }
                                                   ></Form.Control>
                                                </Form.Group>
                                             </Col>
                                             <Col lg={1} md={12} xs={12} style={{textAlign:"end"}}>
                                                <Form.Label><b className="appColor"></b></Form.Label>
                                                <Button
                                                   name={'addButton'+index}
                                                   disabled={
                                                      (
                                                         (openSO.dispatchQty === 0 || isNaN(parseFloat(openSO.dispatchQty)))
                                                         || (openSO.dispatchQty > openSO.balancedQty)
                                                         || (openSO.dispatchQty > openSO.availableQty)
                                                         || (openSO.addedQty > 0)
                                                         || (buttonClicked.indexOf('addButton'+index+openSO.jcId+openSO.lineNumber) !== -1)
                                                      )
                                                   }
                                                   className="btn-sm my-2"
                                                   style={{marginRight:"0px"}}
                                                   onClick={(e)=>handleAddDRNDetails(e, index)}
                                                >Add (+)</Button>
                                             </Col>
                                          </Row>
                                       </div>
                                       
                                    </React.Fragment>
                                 )) }

                                 {/* START of row in the form to DISPLAY Delivery Note Details */}
                                 <br></br>
                                 <Row>
                                    <Col>
                                       <h5>Dispatch Request Note Details</h5>
                                    </Col>
                                 </Row>
                                 <p className="validation-error">{errors.drndetails}</p>
                                 <hr></hr>
                                 <Row>
                                    <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                       <table style={{ ...tableStyle, width:"98%", tableLayout:"fixed" }}>
                                          <thead>
                                          <tr>
                                             <th className="col-2" style={{ ...tableStyle, color:"black" }}>#</th>
                                             <th className="col-4" style={{ ...tableStyle, color:"black" }}>SO#</th>
                                             <th className="col-12" style={{ ...tableStyle, color:"black" }}>JC Description</th>
                                             <th className="col-4" style={{ ...tableStyle, color:"black" }}>CPIN</th>
                                             <th className="col-5" style={{ ...tableStyle, color:"black" }}>Batch</th>
                                             <th className="col-6" style={{ ...tableStyle, color:"black" }}>Dispatch Qty</th>
                                             <th className="col-3" style={{ ...tableStyle, color:"black" }}></th>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          </tbody>
                                       </table>
                                    </Col>
                                 </Row>
                                 {drnDetails.map((openSO, index) => (
                                    <React.Fragment key={index}>
                                       {index > 0?(
                                          <React.Fragment>
                                             <Row>
                                                <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                                   <table style={{ ...tableStyle, width:"98%", tableLayout:"fixed", marginTop:"-22px" }}>
                                                      <tbody>
                                                         <tr>
                                                            <td  className="col-2" style={tableStyle} colSpan={1}>
                                                               <b>{index}</b>
                                                            </td>
                                                            <td className="col-4" style={tableStyle} colSpan={2}>
                                                               {openSO.soNumber}
                                                            </td>
                                                            <td style={tableStyle} className="col-12">
                                                               {openSO.jcDescription}
                                                            </td>
                                                            <td style={tableStyle} className="col-4">
                                                               {openSO.customerPartNumber}
                                                            </td>
                                                            <td className="col-5" style={tableStyle} colSpan={2}>
                                                               {format(new Date(openSO.batchDate), 'dd-MMM-yyyy')}
                                                            </td>
                                                            <td className="col-6" style={tableStyle} colSpan={2}>
                                                               {openSO.dispatchQty}
                                                            </td>
                                                            <td  className="col-3" style={tableStyle} colSpan={1}>
                                                               <Button
                                                                  variant="danger" 
                                                                  className="btn-md"
                                                                  disabled={drnDetails.length === 1} 
                                                                  onClick={() => handleRemoveFields(index)}
                                                               >X
                                                               </Button>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </Col>
                                             </Row>
                                             {/*<Row>
                                                <Col lg={1} md={12} xs={12}>
                                                      <Form.Label><b>{index}</b></Form.Label>
                                                </Col>
                                                <Col lg={2} md={12} xs={12}>
                                                   <Form.Label><b>{openSO.soNumber}</b></Form.Label>
                                                </Col>
                                                <Col lg={4} md={12} xs={12}>
                                                   <Form.Label><b>{openSO.jcDescription}</b></Form.Label>
                                                </Col>
                                                <Col lg={2} md={12} xs={12}>
                                                   <Form.Label><b>{format(new Date(openSO.batchDate), 'dd-MMM-yyyy')}</b></Form.Label>
                                                </Col>
                                                <Col lg={2} md={12} xs={12}>
                                                   <Form.Label><b>{openSO.dispatchQty}</b></Form.Label>
                                                </Col>
                                                <Col lg={1} md={12} xs={12} style={{textAlign:"end"}}>
                                                   <Button
                                                      variant="danger" 
                                                      className="btn-md"
                                                      disabled={drnDetails.length === 1} 
                                                      onClick={() => handleRemoveFields(index)}
                                                   >X
                                                   </Button>
                                                </Col>
                                             </Row>*/}
                                          </React.Fragment>
                                    ):(null)}
                                     <br></br>  
                                    </React.Fragment>
                                 ))}
                                 <br></br>

                              </React.Fragment>
                           ):(
                              <Row>
                                 <Col>
                                    <h5><i className="fas fa-frown"></i> Oops! You cannot proceed with DRN Creation.</h5>
                                    <h6>Sales Order not available for the "Selected JC"</h6>
                                    <h6>OR</h6>
                                    <h6>Finished Goods not in the "Inventory"</h6>
                                 </Col>
                              </Row>
                           )
                        )}
                     <Row>
                     
                     </Row>
                     {/* START of LAST row in the form */}
                     <Row>
                        <Col style={{textAlign:"end"}}>
                           <Button type='reset' className='mx-3 my-3 btn-md' onClick={(e)=>handleReset(e)}><i className="fas fa-undo"></i> Reset</Button>
                           <Button 
                              type='submit'
                              disabled={executing} 
                              onClick={(e) => e.currentTarget.blur()}
                              className=' my-3 btn-md button-class' >
                                 <i className="fas fa-save"></i> Save</Button>
                        </Col>
                     </Row>
                  </Col>
               </Form>
            </FormFieldsContainer>
         </>
      </FormContainer>
   )
}

export default DRNCreateScreen
