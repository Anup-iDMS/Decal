import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container, Tabs, Tab, Card } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../../components/form/FormContainer'
import FormFieldsContainer from './../../components/form/FormFieldsContainer';

import { getCustomerDetails, updateCustomer } from '../../actions/masters/customerActions'
import Breadcrumb from './../../components/app/Breadcrumb';
import { CUSTOMER_UPDATE_RESET } from '../../constants/masters/customerConstants'
import { NotificationManager } from 'react-notifications';
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application'
import { logger } from './../../util/ConsoleHelper';
import { v4 as uuidv4 } from 'uuid';


const EditCustomerScreen = ({ match, history }) => {
   
   const customerId = match.params.id;

   const [ custCode, setCustCode ] = useState('');
   const [ custName, setCustName ] = useState('');
   const [ custCIN, setCustCIN ] = useState('');
   const [ custMSMENo, setCustMSMENo ] = useState('');
   const [ custURD, setCustURD ] = useState('');
   const [ custNickName, setCustNickName ] = useState('');
   const [ custCompanyType, setCustCompanyType ] = useState('');
   const [ custGST, setCustGST ] = useState('');
   const [ custPAN, setCustPAN ] = useState('');
   const [ custBillingAddress, setCustBillingAddress ] = useState('');
   const [ custShipingAddress, setCustShippingAddress ] = useState({});

   const [ custBillAddressLine1, setCustBillAddressLine1 ] = useState('');
   const [ custBillAddressLine2, setCustBillAddressLine2 ] = useState('');
   const [ custBillAddressLine3, setCustBillAddressLine3 ] = useState('');
   const [ custBillState, setCustBillState ] = useState('');
   const [ custBillCity, setCustBillCity ] = useState('');
   const [ custBillDistrict, setCustBillDistrict ] = useState('');
   const [ custBillPinCode, setCustBillPinCode ] = useState('');
 

   const [ custShipAddressLine1, setCustShipAddressLine1 ] = useState('');
   const [ custShipAddressLine2, setCustShipAddressLine2 ] = useState('');
   const [ custShipAddressLine3, setCustShipAddressLine3 ] = useState('');
   const [ custShipState, setCustShipState ] = useState('');
   const [ custShipCity, setCustShipCity ] = useState('');
   const [ custShipDistrict, setCustShipDistrict ] = useState('');
   const [ custShipPinCode, setCustShipPinCode ] = useState('');

   const [ addressButtonName, setAddressButtonName ] = useState('Add Address');
   const [ addressId, setAddressId ] = useState('');
   const [ addressType, setAddressType ] = useState('')
   const [ addressLine1, setAddressLine1 ] = useState('')
   const [ addressLine2, setAddressLine2 ] = useState('')
   const [ addressLine3, setAddressLine3 ] = useState('')
   const [ state, setState ] = useState('')
   const [ city, setCity ] = useState('')
   const [ district, setDistrict ] = useState('')
   const [ pinCode, setPinCode ] = useState('')
   const [ contactPersonName, setContactPersonName ] = useState('')
   const [ contactPersonNumber, setContactPersonNumber ] = useState('')

   const [ customerAddress, setCustomerAddress ] = useState([
      { 
         id: uuidv4(), 
         addressLine1:'', 
         addressLine2: '', 
         addressLine3: '',
         state: '',
         city: '',
         district: '',
         pinCode: '',
         contactPersonName: '',
	      contactPersonNumber: ''
      }
   ])

   const [ newAddress, setNewAddress ] = useState(
      {
         addressType: '',
         addressLine1: '',
         addressLine2: '',
         addressLine3: '',
         state: '',
         city: '',
         district: '',
         pinCode: '',
         contactPersonName: '',
         contactPersonNumber: ''
     }
   );

   const [ custContactPersonName, setCustContactPersonName ] = useState('');
   const [ custContactPersonDesignation, setCustContactPersonDesignation ] = useState('');
   const [ custContactPersonNumber, setCustContactPersonNumber ] = useState('');
   const [ custContactPersonAltNum, setCustContactPersonAltNum ] = useState('');
   const [ custContactPersonEmail, setCustContactPersonEmail ] = useState('');
   const [ isCustActive, setIsCustActive ] = useState('A');
   const [ custAlsoSupplier, setCustAlsoSupplier ] = useState('No');
   
   const [ custVendorCode, setCustVendorCode ] = useState('');

   const [ custBefName, setCustBefName ] = useState('');
   const [ custBankName, setCustBankName ] = useState('');
   const [ custAccountNumber, setCustAccountNumber ] = useState('');
   const [ custAccType, setCustAccType ] = useState('');
   const [ custBankIFSCCode, setCustBankIFSCCode ] = useState('');
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});
   //Tab Active Key
   const [ activeTabKey, setActiveTabKey ] = useState('home');

   const dispatch = useDispatch()

   const customerDetails = useSelector((state) => state.customerDetails)
   const { customer } = customerDetails
   //console .log("1. Inside EDIT CUSTOMER SCREEN ==== and customer details are ", customer)

   //post updated Job Card Record
   const customerUpdate = useSelector((state) => state.customerUpdate);
   const { success: successUpdate, error: errorUpdate } = customerUpdate

   const handleReset = () => {
      window.location.reload();
   }

   const handleForwardActiveTabKey = (e, key) => {
      e.preventDefault();
      e.currentTarget.blur()
      setActiveTabKey(key);
   }

   const handleBackwardActiveTabKey = (e, key) => {
      e.preventDefault();
      e.currentTarget.blur()
      setActiveTabKey(key);
   }

   const handleAddUpdateAddress = (e, btnName) => {
      e.preventDefault();
      e.currentTarget.blur()
      console.log("===== inside handleAddUpdateAddress and index is ==== ", btnName)
      if(btnName === "Add Address") {
        
         let i = {}
         i.id = uuidv4();
         i.addressType = addressType;
         i.addressLine1 = addressLine1;
         i.addressLine2 = addressLine2;
         i.addressLine3 = addressLine3;
         i.state = state;
         i.city = city;
         i.district = district;
         i.pinCode = pinCode;
         i.contactPersonName = contactPersonName;
         i.contactPersonNumber = contactPersonNumber;
         console.log("===== New Address is ==== ", i)
         setCustomerAddress([...customerAddress, i])
         NotificationManager.warning(`Address details added. Please don't forget to save the changes !`, 'Warning!', APPLICATION_NOTIFICATION_TIME_OUT);
      } else {
         const newInputFields = customerAddress.map(i => {
            if(addressId === i.id) {
               console.log("===== Matched Address is ==== ", i)
               i.addressType = addressType;
               i.addressLine1 = addressLine1;
               i.addressLine2 = addressLine2;
               i.addressLine3 = addressLine3;
               i.state = state;
               i.city = city;
               i.district = district;
               i.pinCode = pinCode;
               i.contactPersonName = contactPersonName;
               i.contactPersonNumber = contactPersonNumber;
            }
            return i;
         })
         setCustomerAddress(newInputFields);
         NotificationManager.warning(`Address details updated. Please don't forget to save the changes !`, 'Warning!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      clearAddressFields();
 }

   const clearAddress = (e) => {
      e.currentTarget.blur()
      clearAddressFields();
   }

   const clearAddressFields = () => {
      setAddressButtonName("Add Address");
      setAddressType('')
      setAddressLine1('')
      setAddressLine2('')
      setAddressLine3('')
      setState('')
      setCity('')
      setDistrict('')
      setPinCode('')
      setContactPersonName('')
      setContactPersonNumber('')
      setAddressId('')
   }

   const handleEditAddress = (e, index, id) => {
      e.preventDefault();
      e.currentTarget.blur()
      console.log("Index is ", index)
      console.log("And Index ID is ", id)
      const srs = [...customerAddress]
      const naam = srs[index]
      setAddressButtonName("Update Address");
      setAddressId(naam.id)
      setAddressType(naam.addressType)
      setAddressLine1(naam.addressLine1)
      setAddressLine2(naam.addressLine2)
      setAddressLine3(naam.addressLine3)
      setState(naam.state)
      setCity(naam.city)
      setDistrict(naam.district)
      setPinCode(naam.pinCode)
      setContactPersonName(naam.contactPersonName===undefined?custContactPersonName:naam.contactPersonName)
      setContactPersonNumber(naam.contactPersonNumber===undefined?custContactPersonNumber:naam.contactPersonNumber)
   }
   
   // 4. Validate the "FORM" before submit
   const findFormErrors = () => {
      const newErrors = {};
      if ( custName  === "" ) {
         newErrors.custName = 'Enter a Customer Name!'
      }

      return newErrors;
   }

   // 5.2 Submit The Form
   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();
      logger("--------------in submit -----------------")
      let custBillingAddress = [{
         custBillAddressLine1,
         custBillAddressLine2,
         custBillAddressLine3,
         custBillState,
         custBillCity,
         custBillDistrict,
         custBillPinCode
      }]
  
      let custShipingAddress = [{
         custShipAddressLine1,
         custShipAddressLine2,
         custShipAddressLine3,
         custShipState,
         custShipCity,
         custShipDistrict,
         custShipPinCode
      }]

      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
      } 
      else {
         logger("--------------in else submit -----------------")
         dispatch(
            updateCustomer({
               _id: customerId,
               custCode,
               custName,
               custCIN,
               custMSMENo,
               custURD,
               custNickName,
               custCompanyType,
               custGST,
               custPAN,
               custBillingAddress,
               custShipingAddress,
               customerAddress,
               custContactPersonName,
               custContactPersonDesignation,
               custContactPersonNumber,
               custContactPersonAltNum,
               custContactPersonEmail,
               isCustActive,
               custAlsoSupplier,
               custVendorCode,
               custBefName,
               custBankName,
               custAccountNumber,
               custAccType,
               custBankIFSCCode
            })
         )
      }
   }

   useEffect(() => {
      if (!customer.custName || customer._id !== customerId) {
         //logger("1. use effect IF condition ....")
         dispatch(getCustomerDetails(customerId))
      } else {
         setCustCode(customer.custCode);
         setCustName(customer.custName);
         setCustNickName(customer.custNickName);
         setCustCompanyType(customer.custCompanyType);
         setCustCIN(customer.custCIN);
         setCustMSMENo(customer.custMSMENo);
         setCustURD(customer.custURD);
         setCustGST(customer.custGST);
         setCustPAN(customer.custPAN);
         setCustBillingAddress(customer.custBillingAddress);
         setCustBillAddressLine1(customer.custBillingAddress[0].custBillAddressLine1)
         setCustBillAddressLine2(customer.custBillingAddress[0].custBillAddressLine2)
         setCustBillAddressLine3(customer.custBillingAddress[0].custBillAddressLine3)
         setCustBillState(customer.custBillingAddress[0].custBillState)
         setCustBillCity(customer.custBillingAddress[0].custBillCity)
         setCustBillDistrict(customer.custBillingAddress[0].custBillDistrict)
         setCustBillPinCode(customer.custBillingAddress[0].custBillPinCode)
         
         setCustShippingAddress(customer.custShipingAddress);
         setCustShipAddressLine1(customer.custShipingAddress[0].custShipAddressLine1)
         setCustShipAddressLine2(customer.custShipingAddress[0].custShipAddressLine2)
         setCustShipAddressLine3(customer.custShipingAddress[0].custShipAddressLine3)
         setCustShipState(customer.custShipingAddress[0].custShipState)
         setCustShipCity(customer.custShipingAddress[0].custShipCity)
         setCustShipDistrict(customer.custShipingAddress[0].custShipDistrict)
         setCustShipPinCode(customer.custShipingAddress[0].custShipPinCode)
         
         setCustContactPersonName(customer.custContactPersonName);
         setCustContactPersonDesignation(customer.custContactPersonDesignation);
         setCustContactPersonNumber(customer.custContactPersonNumber);
         setCustContactPersonAltNum(customer.custContactPersonAltNum);
         setCustContactPersonEmail(customer.custContactPersonEmail);
         setIsCustActive(customer.isCustActive === "A"?"Active":"Inactive");
         setCustAlsoSupplier(!customer.custAlsoSupplier?"No":"Yes");

         setCustVendorCode(customer.custVendorCode)

         setCustBefName(customer.custBefName)
         setCustBankName(customer.custBankName)
         setCustAccountNumber(customer.custAccountNumber)
         setCustAccType(customer.custAccType)
         setCustBankIFSCCode(customer.custBankIFSCCode)

         let newCustomerAddress = [...customer.customerAddress]
         let newCustomerAddress1 = newCustomerAddress.map(ca => {
            ca.id = uuidv4(); 
            ca.addressLine1 = ca.addressLine1; 
            ca.addressLine2 = ca.addressLine2; 
            ca.addressLine3 = ca.addressLine3;
            ca.state = ca.state;
            ca.city = ca.city;
            ca.district = ca.district;
            ca.pinCode = ca.pinCode;

            return ca;
         })
         //logger("--------> before setting data <----------- ", newSODetails1)
         setCustomerAddress(newCustomerAddress1);
      }
      
      if(successUpdate) {
         history.push('/customerlist');
         dispatch({ type: CUSTOMER_UPDATE_RESET })
         NotificationManager.success(`Customer ${customer.custName} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         NotificationManager.error(`Error in updating Customer # ${customer.custNo} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
         dispatch({ type: CUSTOMER_UPDATE_RESET })
      }

   }, [ dispatch, history, customerId, customer, successUpdate ])
   

   const handleTabSelect = (e) => {
      //e.preventDefault();
      setActiveTabKey(e);
   }

   return (
      <>
         <FormContainer>
            <Breadcrumb
               listPage = "customerlist"
            />
            <br></br>
            <FormFieldsContainer frameTitle = "Please Edit Customer Details !!!" >
               <Form onSubmit={submitHandler}>
                  <Col>
                     <Tabs activeKey={activeTabKey} id="customer" className="mb-3" onSelect={(e)=>handleTabSelect(e)}>
                        <Tab eventKey="home"  title="Customer Details">
                           <Row>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custCode'>
                                 <Form.Label>Customer Code</Form.Label>
                                 <Form.Control
                                    className="disabled"
                                    type='text'
                                    placeholder=''
                                    value={custCode}
                                    onChange={(e) => setCustCode(e.target.value)}
                                    readOnly
                                 ></Form.Control>
                                 </Form.Group>
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custName'>
                                    <Form.Label>Customer Name (Legal Entity)</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custName}
                                       onChange={(e) => setCustName(e.target.value)}
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='custCode'>
                                 <Form.Label>Customer Nick Name</Form.Label>
                                 <Form.Control
                                    type='text'
                                    placeholder=''
                                    value={custNickName}
                                    onChange={(e) => setCustNickName(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        { /* second row start */ }
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='custCompanyType'>
                              <Form.Label>Type of Company</Form.Label>
                              <Form.Control
                                 as='select'
                                 custom
                                 placeholder='Select Company Type'
                                 value={custCompanyType}
                                 onChange={(e) => setCustCompanyType(e.target.value)}
                              >
                                 <option value="PVT LTD">PVT LTD</option>
                                 <option value="OPC">OPC</option>
                                 <option value="Partnership Firm">Partnership Firm</option>
                                 <option value="LLP">LLP</option>
                                 <option value="Proprietor">Proprietor</option>
                                 <option value="LTD">LTD</option>
                              </Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='custCIN'>
                                 <Form.Label>Company Identification Number(CIN)</Form.Label>
                                 <Form.Control
                                    type='text'
                                    placeholder=''
                                    value={custCIN}
                                    onChange={(e) => setCustCIN(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='custMSME'>
                                 <Form.Label>MSME Enterprises</Form.Label>
                                 <Form.Control
                                    type='text'
                                    placeholder=''
                                    value={custMSMENo}
                                    onChange={(e) => setCustMSMENo(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        { /* second row end */ }
                           
                        { /* third row start */ }
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='custGST'>
                              <Form.Label>Goods and Services Tax(GST)</Form.Label>
                              <Form.Control
                                 type='text'
                                 placeholder=''
                                 value={custGST}
                                 onChange={(e) => setCustGST(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='custURD'>
                                 <Form.Label>Unregistered Dealer(URD)</Form.Label>
                                 <Form.Control
                                    type='text'
                                    placeholder=''
                                    value={custURD}
                                    onChange={(e) => setCustURD(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='custPAN'>
                                 <Form.Label>Permanent Account Number(PAN)</Form.Label>
                                 <Form.Control
                                    type='text'
                                    placeholder=''
                                    value={custPAN}
                                    onChange={(e) => setCustPAN(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='isCustActive'>
                                 <Form.Label>Customer Status</Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    placeholder='Select Customer Status'
                                    value={isCustActive}
                                    onChange={(e) => setIsCustActive(e.target.value)}
                                 >
                                    <option value="A">Active</option>
                                    <option value="I">Inactive</option>
                                 </Form.Control>
                              </Form.Group> 
                           </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custAlsoSupplier'>
                                    <Form.Label>Is Customer Supplier?</Form.Label>
                                    <Form.Control
                                       as='select'
                                       custom
                                       placeholder='Select Customer Status'
                                       value={custAlsoSupplier}
                                       onChange={(e) => setCustAlsoSupplier(e.target.value)}
                                    >
                                       <option value="No">No</option>
                                    </Form.Control>
                                 </Form.Group> 
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custVendorCode'>
                                    <Form.Label>Vendor Code</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custVendorCode}
                                       onChange={(e) => setCustVendorCode(e.target.value)}
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                           </Row>
                           { /* third row end */ }
                           <Row>
                              <Col style={{textAlign:"end"}}>
                                 <Button 
                                    type='button' 
                                    className='reset-button-class mx-3 my-3 btn-md' 
                                    onClick={(e)=>handleForwardActiveTabKey(e, "address")}>Next <i className="fas fa-forward"></i> 
                                 </Button>
                              </Col>
                           </Row>
                        </Tab>
                        <Tab eventKey="address" title="Customer Address">
                           <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                              <Col lg={12} md={12} xs={12} style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                                 <div className="address-cards">
                                    { customerAddress.map((inputField, index) => (
                                       <div>
                                             <Card key={index} style={{ paddingLeft: "10px", paddingRight: "0px" }}>
                                                <Card.Header style={{ fontWeight:"bold" }}>{inputField.addressType}</Card.Header>
                                                <Card.Body style={{ paddingLeft: "10px", paddingRight: "0px" }}>
                                                   <Card.Text style={{ fontSize:"12px" }}>
                                                      <b style={{color:"red"}}>Address Line 1:</b> {inputField.addressLine1}<br />
                                                      <b style={{color:"red"}}>Address Line 2:</b> {inputField.addressLine2}<br />
                                                      <b style={{color:"red"}}>Address Line 3:</b> {inputField.addressLine3}<br />
                                                      <b style={{color:"red"}}>State:</b> {inputField.state}<br />
                                                      <b style={{color:"red"}}>City:</b> {inputField.city}<br />
                                                      <b style={{color:"red"}}>District:</b> {inputField.district}<br />
                                                      <b style={{color:"red"}}>Pincode:</b> {inputField.pinCode}<br />
                                                      <b style={{color:"red"}}>Contact Person:</b> {inputField.contactPersonName===undefined?custContactPersonName:inputField.contactPersonName}<br />
                                                      <b style={{color:"red"}}>Contact Number:</b> {inputField.contactPersonNumber===undefined?custContactPersonNumber:inputField.contactPersonNumber}<br />
                                                      <Button 
                                                         className='my-3 btn-sm' 
                                                         onClick={(e) => handleEditAddress(e, index, inputField.id)}
                                                      >
                                                         Edit
                                                      </Button>
                                                   </Card.Text>
                                                </Card.Body>
                                             </Card>
                                             <br></br>
                                       </div>
                                    )) }
                                 </div>
                              </Col>
                           </Row>
                           <Row>
                              <Col lg={12} md={12} xs={12}>
                                 <Row>
                                    <h6 className="px-3 py-2">Add/Edit Customer Address</h6>
                                 </Row>
                                 <Row>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='addressType'>
                                          <Form.Label>Address Type<span className="mandatory">*</span></Form.Label>
                                          <Form.Control
                                             as='select'
                                             custom
                                             name='addressType'
                                             placeholder='Select'
                                             value={addressType}
                                             onChange={(e) => setAddressType(e.target.value)}
                                          >
                                             <option value="Billing">Billing</option>
                                             <option value="Shipping">Shipping</option>
                                          </Form.Control>
                                          <p className="validation-error">{errors.role}</p>
                                       </Form.Group>
                                    </Col>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='addressLine1'>
                                          <Form.Label>Address Line 1</Form.Label>
                                          <Form.Control
                                             type='text'
                                             placeholder=''
                                             value={addressLine1}
                                             onChange={(e) => setAddressLine1(e.target.value)}
                                          ></Form.Control>
                                       </Form.Group>
                                    </Col>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='addressLine2'>
                                          <Form.Label>Address Line 2</Form.Label>
                                          <Form.Control
                                             type='text'
                                             placeholder=''
                                             value={addressLine2}
                                             onChange={(e) => setAddressLine2(e.target.value)}
                                          ></Form.Control>
                                       </Form.Group>
                                    </Col>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='addressLine3'>
                                          <Form.Label>Address Line 3</Form.Label>
                                          <Form.Control
                                             type='text'
                                             placeholder=''
                                             value={addressLine3}
                                             onChange={(e) => setAddressLine3(e.target.value)}
                                          ></Form.Control>
                                       </Form.Group>
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='state'>
                                          <Form.Label>State - Place of Supply</Form.Label>
                                          <Form.Control
                                             type='text'
                                             placeholder=''
                                             value={state}
                                             onChange={(e) => setState(e.target.value)}
                                          ></Form.Control>
                                       </Form.Group>
                                    </Col>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='city'>
                                          <Form.Label>City</Form.Label>
                                          <Form.Control
                                             type='text'
                                             placeholder=''
                                             value={city}
                                             onChange={(e) => setCity(e.target.value)}
                                          ></Form.Control>
                                       </Form.Group>
                                    </Col>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='district'>
                                          <Form.Label>District</Form.Label>
                                          <Form.Control
                                             type='text'
                                             placeholder=''
                                             value={district}
                                             onChange={(e) => setDistrict(e.target.value)}
                                          ></Form.Control>
                                       </Form.Group>
                                    </Col>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='pinCode'>
                                          <Form.Label>Pincode</Form.Label>
                                          <Form.Control
                                             type='text'
                                             placeholder=''
                                             value={pinCode}
                                             onChange={(e) => setPinCode(e.target.value)}
                                          ></Form.Control>
                                       </Form.Group>
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='contactPersonName'>
                                          <Form.Label>Contact Person</Form.Label>
                                          <Form.Control
                                             type='text'
                                             placeholder=''
                                             value={contactPersonName}
                                             onChange={(e) => setContactPersonName(e.target.value)}
                                          ></Form.Control>
                                       </Form.Group>
                                    </Col>
                                    <Col lg={3} md={12} xs={12}>
                                       <Form.Group controlId='custContactPersonNumber'>
                                          <Form.Label>Contact Person Number</Form.Label>
                                          <Form.Control
                                             type='text'
                                             placeholder=''
                                             value={contactPersonNumber}
                                             onChange={(e) => setContactPersonNumber(e.target.value)}
                                          ></Form.Control>
                                       </Form.Group>
                                    </Col>
                                    <Col lg={6} md={12} xs={12} style={{textAlign:"end", marginTop:"10px"}}>
                                       <Button 
                                          type='button' 
                                          className='reset-button-class my-3 btn-md' 
                                          onClick={(e)=>clearAddress(e)}>Clear 
                                       </Button>
                                       <Button 
                                          type='button' 
                                          className='button-class mx-3 my-3 btn-md' 
                                          onClick={(e)=>handleAddUpdateAddress(e, addressButtonName)}>{addressButtonName} 
                                       </Button>
                                    </Col>
                                 </Row>
                              </Col>
                           </Row>
                           <br />
                           <Row>
                              <Col style={{textAlign:"end"}}>
                                 <Button 
                                    type='button' 
                                    className='reset-button-class mx-3 my-3 btn-md' 
                                    onClick={(e)=>handleBackwardActiveTabKey(e, "home")}>Back <i className="fas fa-backward"></i> 
                                 </Button>
                                 <Button 
                                    type='button' 
                                    className='reset-button-class mx-3 my-3 btn-md' 
                                    onClick={(e)=>handleForwardActiveTabKey(e, "contact")}>Next <i className="fas fa-forward"></i> 
                                 </Button>
                              </Col>
                           </Row>
                        </Tab>
                        <Tab eventKey="contact" title="Contact">
                           { /* 5th row start */ }
                           <Row>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custContactPersonName'>
                                 <Form.Label>Contact Person Name</Form.Label>
                                 <Form.Control
                                    type='text'
                                    placeholder=''
                                    value={custContactPersonName}
                                    onChange={(e) => setCustContactPersonName(e.target.value)}
                                 ></Form.Control>
                                 </Form.Group>
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custContactPersonDesignation'>
                                    <Form.Label>Designation</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custContactPersonDesignation}
                                       onChange={(e) => setCustContactPersonDesignation(e.target.value)}
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custContactPersonNumber'>
                                    <Form.Label>Contact No(Mobile No)</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custContactPersonNumber}
                                       onChange={(e) => setCustContactPersonAltNum(e.target.value)} 
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                           </Row>
                           { /* 5th row end */ }

                           { /* 6th row start */ }
                           <Row>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custContactPersonAltNum'>
                                 <Form.Label>Alternate No(Whatsapp No)</Form.Label>
                                 <Form.Control
                                    type='text'
                                    placeholder=''
                                    value={custContactPersonAltNum}
                                    onChange={(e) => setCustContactPersonAltNum(e.target.value)}
                                 ></Form.Control>
                                 </Form.Group>
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custContactPersonEmail'>
                                    <Form.Label>Email-ID</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custContactPersonEmail}
                                       onChange={(e) => setCustContactPersonEmail(e.target.value)}
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custTelephoneNumber'>
                                    <Form.Label>Telephone No</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value='-'
                                       
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                           </Row>
                           { /* 6th row end */ }
                           <Row>
                              <Col style={{textAlign:"end"}}>
                                 <Button 
                                    type='button' 
                                    className='reset-button-class mx-3 my-3 btn-md' 
                                    onClick={(e)=>handleBackwardActiveTabKey(e, "address")}>Back <i className="fas fa-backward"></i> 
                                 </Button>
                                 <Button 
                                    type='button' 
                                    className='reset-button-class mx-3 my-3 btn-md' 
                                    onClick={(e)=>handleForwardActiveTabKey(e, "bank")}>Next <i className="fas fa-forward"></i> 
                                 </Button>
                              </Col>
                           </Row>
                        </Tab>
                        <Tab eventKey="bank" title="Bank Details">
                           { /* 7th row start */ }
                           <Row>
                              <Col>
                                 <h5>Bank Details</h5>
                              </Col>
                           </Row>
                           { /* 7th row end */ }

                           { /* 8th row start */ }
                           <Row>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custBefName'>
                                    <Form.Label>Beneficiary Name</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custBefName}
                                       onChange={(e) => setCustBefName(e.target.value)}
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custBankName'>
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custBankName}
                                       onChange={(e) => setCustBankName(e.target.value)}
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custAccountNumber'>
                                    <Form.Label>Account No</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custAccountNumber}
                                       onChange={(e) => setCustAccountNumber(e.target.value)}
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                           </Row>
                           { /* 8th row end */ }

                           { /* 9th row start */ }
                           <Row>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custAccType'>
                                    <Form.Label>Account Type</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custAccType}
                                       onChange={(e) => setCustAccType(e.target.value)}
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='custBankIFSCCode'>
                                    <Form.Label>IFSC Code</Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={custBankIFSCCode}
                                       onChange={(e) => setCustBankIFSCCode(e.target.value)}
                                    ></Form.Control>
                                 </Form.Group>
                              </Col>
                           </Row>
                           { /* 9th row end */ }
                           { /* 10th row start */ }
                           <Row>
                              <Col style={{textAlign:"end"}}>
                                 <Button 
                                    type='button' 
                                    className='reset-button-class mx-3 my-3 btn-md' 
                                    onClick={(e)=>handleBackwardActiveTabKey(e, "contact")}>Back <i className="fas fa-backward"></i> 
                                 </Button>
                                 <Button 
                                    type='reset' 
                                    className='reset-button-class mx-3 my-3 btn-md' 
                                    onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                                 <Button 
                                    type='submit' 
                                    onClick={(e) => e.currentTarget.blur()}
                                    className=' my-3 btn-md button-class'
                                 >
                                    <i className="fas fa-save"></i> Save
                                 </Button>
                              </Col>
                           </Row>
                           { /* 10th row end */ }
                        </Tab>
                     </Tabs>
                  </Col>
               </Form>
            </FormFieldsContainer>
         </FormContainer>
      </>
   )
}

export default EditCustomerScreen
