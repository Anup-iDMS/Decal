//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

//import Custom Application Components
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Loader from './../../components/app/Loader';
import Message from './../../components/app/Message';
import FormContainer from '../../components/form/FormContainer';
//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';

//import Redux "action(s)" 
import { getCompanyDetails, updateCompany } from './../../actions/masters/companyActions';

//import Redux "constantc(s)" 
import { COMPANY_UPDATE_RESET } from './../../constants/masters/companyConstants';
import { NotificationManager } from 'react-notifications';
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application'
import { logger } from './../../util/ConsoleHelper';
import Breadcrumb from './../../components/app/Breadcrumb';

const CompanyMasterEditScreen = ({ match, history }) => {
	
	const dispatch = useDispatch();
	
	const companyId = match.params.id;
	
	const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

	const companyDetails = useSelector((state) => state.companyDetails)
	const { loading, company, error } = companyDetails;

   const companyUpdate = useSelector((state) => state.companyUpdate)
	const { success: successUpdate, error: errorUpdate } = companyUpdate

	// 2. Define All Form Variables and their state
	const [ name, setName ] = useState("");
	const [ address, setAddress ] = useState("");
	const [ pinCode, setPinCode ] = useState("");
	const [ logo, setLogo ] = useState("");
	const [ contactNumber, setContactNumber ] = useState("");
	const [ alternateContactNumber, setAlternateContactNumber ] = useState("");
	const [ website, setWebsite ] = useState("");
	const [ contactPerson, setContactPerson ] = useState("");
   //office address
   const [companyAddress, setCompanyAddress] = useState([
      { 
         id: uuidv4(), 
         addressType:'', 
         addressLine1:'', 
         addressLine2:'', 
         addressLine3:'', 
         state:'', 
         city:'', 
         district:'', 
         pinCode:'' 
      },
   ]);

   // const [ officeAddressLine1, setCustBillAddressLine1 ] = useState('');
   // const [ officeAddressLine2, setCustBillAddressLine2 ] = useState('');
   // const [ officeAddressLine3, setCustBillAddressLine3 ] = useState('');
   // const [ officeState, setCustBillState ] = useState('');
   // const [ officeCity, setCustBillCity ] = useState('');
   // const [ officeDistrict, setCustBillDistrict ] = useState('');
   // const [ officePinCode, setCustBillPinCode ] = useState('');
	// 4.1 Validation Errors
	const [ errors, setErrors, drns ] = useState({});
	
	useEffect(() => {
      console.log("<<<<<<<<<< successUpdate >>>>>>>>>>>> ", successUpdate)
	
		if (company._id !== companyId) {
         //console .log("2. Edit Sales Order Screen and Inside useEffect. Before getting SO Details ==== ")
         dispatch(getCompanyDetails(companyId))
      } else {
         setFormData();
      }
      if(successUpdate) {
         history.push('/companylist');
         dispatch({ type: COMPANY_UPDATE_RESET })
         NotificationManager.success(`The record for # ${company.name} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         NotificationManager.error(`Error in updating record for # ${company.name} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
	},[ dispatch, history, companyId, company, successUpdate ])

   const handleReset = () => {
      window.location.reload();
   }

   const setFormData = () => {
      setName(company.name);
      setAddress(company.address);
      setPinCode(company.pinCode);
      setLogo(company.logo);
      setContactNumber(company.contactNumber);
      setAlternateContactNumber(company.alternateContactNumber);
      setWebsite(company.website);
      setContactPerson(company.contactPerson);
      let newCompanyAddress = [...company.companyAddress]
      let newCompanyAddress1 = newCompanyAddress.map(offadd => {
         offadd.id = uuidv4(); 
         offadd.addressType = offadd.addressType; 
         offadd.addressLine1 = offadd.addressLine1; 
         offadd.addressLine2 = offadd.addressLine2; 
         offadd.addressLine3 = offadd.addressLine3; 
         offadd.state = offadd.state; 
         offadd.city = offadd.city; 
         offadd.district = offadd.district; 
         offadd.pinCode = offadd.pinCode; 
         
         
         return offadd;
      })
      setCompanyAddress(newCompanyAddress1);

      //setOfficeAddress(company.officeAddress);
      //setFactoryAddress(company.factoryAddress);
   }

   // 4. Validate the "FORM" before submit
   const findFormErrors = () => {
      const newErrors = {};
      if ( name  === "" ) {
         newErrors.name = 'Enter a Company Name!'
      }

      return newErrors;
   }

   // 5.2 Submit The Form
   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();

      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
      } 
      else {
         dispatch(
            updateCompany({
               _id: companyId,
               name,
               address,
               pinCode,
               contactNumber,
               alternateContactNumber,
               website,
               contactPerson,
               companyAddress
            })
         )
      }
   }

   const handleChangeInput = (id, event) => {
      const newInputFields = companyAddress.map(i => {
         if(id === i.id) {
            i[event.target.name] = event.target.value
         }
         return i;
      })
      setCompanyAddress(newInputFields);
   }

	return(
		<FormContainer>
         <Breadcrumb
            listPage = "companylist"
         />
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col>
                     <h4>Edit Company Details</h4>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Edit Company Details !!!">
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='name'>
                              <Form.Label>Company Name</Form.Label>
                              <Form.Control
                                 className="disabled"
                                 type='text'
                                 placeholder=''
                                 value={name}
                                 onChange={(e) => setName(e.target.value)}
                                 readOnly
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='website'>
                                 <Form.Label>Website</Form.Label>
                                 <Form.Control
                                    type='text'
                                    placeholder=''
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                 ></Form.Control>     
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='contactNumber'>
                              <Form.Label>Contact Number</Form.Label>
                              <Form.Control
                                 type='text'
                                 placeholder=''
                                 value={contactNumber}
                                 onChange={(e) => setContactNumber(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
								</Row>
                        <Row>
                           <Col lg={12} md={12} xs={12}>
                              <Form.Group controlId='address'>
                              <Form.Label>Address</Form.Label>
                              <Form.Control
                                 className="disabled"
                                 type='text'
                                 placeholder=''
                                 value={address}
                                 onChange={(e) => setAddress(e.target.value)}
                                 readOnly
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        <hr style={{border:"1px solid red"}}></hr>
                        { companyAddress.map((inputField, index) => (
                           <React.Fragment>
                              <Row>
                                 <Col lg={12} md={12} xs={12}>
                                    <Form.Group controlId='addressType'>
                                       <Form.Label><h6>{inputField.addressType} Address</h6></Form.Label>
                                       <Form.Control
                                          type='text'
                                          readOnly
                                          name='addressType'
                                          placeholder=''
                                          value={inputField.addressType}
                                          onChange={(event) => handleChangeInput(inputField.id, event)}
                                       ></Form.Control>
                                    </Form.Group>
                                 </Col>
                              </Row>
                              <Row>
                                 <Col lg={4} md={12} xs={12}>
                                    <Form.Group controlId='addressLine1'>
                                       <Form.Label>Address Line 1</Form.Label>
                                       <Form.Control
                                          type='text'
                                          name='addressLine1'
                                          placeholder=''
                                          value={inputField.addressLine1}
                                          onChange={(event) => handleChangeInput(inputField.id, event)}
                                       ></Form.Control>
                                    </Form.Group>
                                 </Col>
                                 <Col lg={4} md={12} xs={12}>
                                    <Form.Group controlId='addressLine2'>
                                       <Form.Label>Address Line 2</Form.Label>
                                       <Form.Control
                                          type='text'
                                          name='addressLine2'
                                          placeholder=''
                                          value={inputField.addressLine2}
                                          onChange={(event) => handleChangeInput(inputField.id, event)}
                                       ></Form.Control>
                                    </Form.Group>
                                 </Col>
                                 <Col lg={4} md={12} xs={12}>
                                    <Form.Group controlId='addressLine3'>
                                       <Form.Label>Address Line 3</Form.Label>
                                       <Form.Control
                                          type='text'
                                          name='addressLine3'
                                          placeholder=''
                                          value={inputField.addressLine3}
                                          onChange={(event) => handleChangeInput(inputField.id, event)}
                                       ></Form.Control>
                                    </Form.Group>
                                 </Col>
                              </Row>
                              <Row>
                                 <Col lg={3} md={12} xs={12}>
                                    <Form.Group controlId='state'>
                                       <Form.Label>State</Form.Label>
                                       <Form.Control
                                          type='text'
                                          name='state'
                                          placeholder=''
                                          value={inputField.state}
                                          onChange={(event) => handleChangeInput(inputField.id, event)}
                                       ></Form.Control>
                                    </Form.Group>
                                 </Col>
                                 <Col lg={3} md={12} xs={12}>
                                    <Form.Group controlId='city'>
                                       <Form.Label>City</Form.Label>
                                       <Form.Control
                                          type='text'
                                          name='city'
                                          placeholder=''
                                          value={inputField.city}
                                          onChange={(event) => handleChangeInput(inputField.id, event)}
                                       ></Form.Control>
                                    </Form.Group>
                                 </Col>
                                 <Col lg={3} md={12} xs={12}>
                                    <Form.Group controlId='district'>
                                       <Form.Label>District</Form.Label>
                                       <Form.Control
                                          type='text'
                                          name='district'
                                          placeholder=''
                                          value={inputField.district}
                                          onChange={(event) => handleChangeInput(inputField.id, event)}
                                       ></Form.Control>
                                    </Form.Group>
                                 </Col>
                                 <Col lg={3} md={12} xs={12}>
                                    <Form.Group controlId='pinCode'>
                                       <Form.Label>Pincode</Form.Label>
                                       <Form.Control
                                          type='text'
                                          placeholder=''
                                          name='pinCode'
                                          value={inputField.pinCode}
                                          onChange={(event) => handleChangeInput(inputField.id, event)}
                                       ></Form.Control>
                                    </Form.Group>
                                 </Col>
                              </Row>
                              <hr style={{border:"1px solid red"}}></hr>
                           </React.Fragment>
                        ))}
								<Row>
                           <Col lg={12} md={12} xs={12} style={{textAlign:"end"}}>
                              <Button 
                                 type='submit' 
                                 className=' mx-2 my-3 btn-md button-class' style={{background:"red"}} >
                                 <i className="fas fa-save fa-1x"></i> Save
                              </Button>
                              <Button 
                                 type='button' 
                                 onClick={handleReset}
                                 className=' reset-button-class mx-2 my-3 btn-md button-class' style={{background:"green"}} >
                                 <i className="fas fa-undo fa-1x"></i> Reset
                              </Button>
                           </Col>
                        </Row>
							</Col>
						</Form>
					</FormFieldsContainer>
				</React.Fragment>
			)}
			<br></br>
		</FormContainer>
	)
	
}

export default CompanyMasterEditScreen;
