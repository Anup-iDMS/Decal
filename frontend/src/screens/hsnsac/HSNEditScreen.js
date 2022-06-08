import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from '../../components/app/Breadcrumb';

//import Redux action to create HSN record
import { updateHSNSAC, getHSNSACDetails } from '../../actions/masters/hsnActions';

//import Redux "constantc(s)"
import { HSN_UPDATE_RESET } from '../../constants/masters/hsnConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

const HSNEditScreen = ({ history, location, match }) => {

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   
   //const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin
   
   const hsnsacId = match.params.id;
   
   const hsnDetails = useSelector((state) => state.hsnDetails)

   const { loading, hsnsac, error } = hsnDetails;

   //post updated Job Card Record
   const hsnUpdate = useSelector((state) => state.hsnUpdate);
   const { success: successUpdate, error: errorUpdate } = hsnUpdate

   // 2. Define All Form Variables and their state
   const [ company, setCompany ] = useState(userInfo.companyId);
   const [ provisionType, setProvisionType ] = useState("Goods");
   const [ hsnCode, setHSNCode ] = useState("");
   const [ isActive, setIsActive ] = useState("Y");
   const [ goodsDescription, setGoodsDescription ] = useState("");
   const [ sacCode, setSACCode ] = useState("");
   const [ serviceDescription, setServiceDescription ] = useState("");
   const [ gstRate, setGSTRate ] = useState(0);
   const [ igstRate, setIGSTRate ] = useState(0);
   const [ sgstRate, setSGSTRate ] = useState(0);
   const [ cgstRate, setCGSTRate ] = useState(0);
   const [ ugstRate, setUGSTRate ] = useState(0);
   
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   useEffect(() => {
      
      if (hsnsac._id !== hsnsacId) {
         //console .log("2. Edit Sales Order Screen and Inside useEffect. Before getting SO Details ==== ")
         dispatch(getHSNSACDetails(hsnsacId))
      } else {
         setFormData();
      }

		if (successUpdate) {
         //history.replace(`/hsnsac/${hsnsac._id}/edit`)
         history.push('/hsnlist');
         dispatch({ type: HSN_UPDATE_RESET })
         NotificationManager.success(`HSN Entry has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorUpdate) {
         dispatch({ type: HSN_UPDATE_RESET })
         NotificationManager.error(`Error while updating HSN Entry !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      
		// eslint-disable-next-line
	}, [history, hsnsacId, hsnsac, successUpdate])

   const setFormData = () => {
      setProvisionType(hsnsac.provisionType);
      setHSNCode(hsnsac.hsnCode);
      setIsActive(hsnsac.isActive);
      setGoodsDescription(hsnsac.goodsDescription);
      setSACCode(hsnsac.sacCode);
      setServiceDescription(hsnsac.serviceDescription)
      setGSTRate(hsnsac.gstRate)
      setIGSTRate(hsnsac.igstRate)
      setSGSTRate(hsnsac.sgstRate)
      setCGSTRate(hsnsac.cgstRate);
      setUGSTRate(hsnsac.ugstRate);
      setCompany(userInfo.companyId);
   }

   

   // 3. Define all handler functions to change the state of FORM variables
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   // 4. Validate the "FORM" before submit
   const findFormErrors = () => {
      const newErrors = {};
      if (hsnCode.trim().length === 0 ) {
         newErrors.hsnCode = 'Enter HSN Code!'
      }

      if (goodsDescription.trim().length === 0 ) {
         newErrors.goodsDescription = 'Enter Description of Goods!'
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
         resetErrorMessage("hsnCode");
         dispatch(
            updateHSNSAC({
               _id:hsnsacId,
               company,
               hsnCode,
               provisionType,
               goodsDescription,
               sacCode,
               serviceDescription,
               gstRate,
               igstRate,
               sgstRate,
               cgstRate,
               ugstRate,
               isActive
            })
         )
      }
   }

   const handleReset = () => {
      window.location.reload();
   }

   const handleActiveStatus = (e) => {
      setIsActive(e.target.value)
   }

   return (
      <FormContainer>
         <Breadcrumb
            listPage = "hsnlist"
         />
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <>
               <Row>
                  <Col>
                     <h3>Edit HSN Registration</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Edit HSN Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           {/*<Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='provisionType'>
                                 <Form.Label>Provision Type<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='provisionType'
                                    placeholder='Select a Batch Category'
                                    value={provisionType}
                                    onChange={(e) => setProvisionType(e.target.value)}
                                    disabled
                                 >
                                    <option value="Goods">Goods</option>
                                    <option value="Services">Services</option>
                                 </Form.Control>
                              </Form.Group>
                           Col>*/}
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='hsnCode'>
                              <Form.Label>HSN Code<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='hsnCode'
                                 value={hsnCode}
                                 onChange={(e) => setHSNCode(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={8} md={12} xs={12}>
                              <Form.Group controlId='goodsDescription'>
                              <Form.Label>Description of Goods<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 as='textarea'
                                 name='goodsDescription'
                                 value={goodsDescription}
                                 onChange={(e) => setGoodsDescription(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of 2nd row in the form */}
                        <Row>
                           {/*<Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='sacCode'>
                              <Form.Label>SAC Code<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='sacCode'
                                 value={sacCode}
                                 onChange={(e) => setSACCode(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='serviceDescription'>
                              <Form.Label>Description of Services<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 as='textarea'
                                 name='serviceDescription'
                                 value={serviceDescription}
                                 onChange={(e) => setServiceDescription(e.target.value)}
                              />
                              </Form.Group>
                           </Col>*/}
                        </Row>
                        {/* START of 3rd row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='gstRate'>
                              <Form.Label>GST Rate (%)<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='number'
                                 name='gstRate'
                                 value={gstRate}
                                 onChange={(e) => setGSTRate(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Group controlId='igstRate'>
                              <Form.Label>I-GST Rate (%)<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='number'
                                 name='igstRate'
                                 value={igstRate}
                                 onChange={(e) => setIGSTRate(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Group controlId='sgstRate'>
                              <Form.Label>S-GST Rate (%)<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='number'
                                 name='sgstRate'
                                 value={sgstRate}
                                 onChange={(e) => setSGSTRate(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Group controlId='cgstRate'>
                              <Form.Label>C-GST Rate (%)<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='number'
                                 name='cgstRate'
                                 value={cgstRate}
                                 onChange={(e) => setCGSTRate(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Group controlId='ugstRate'>
                              <Form.Label>U-GST Rate (%)<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='number'
                                 name='ugstRate'
                                 value={ugstRate}
                                 onChange={(e) => setUGSTRate(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of 4th row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='active'>
                                 <Form.Label>Active<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='active'
                                    placeholder='Select'
                                    value={isActive}
                                    onChange={(e) => handleActiveStatus(e)}
                                 >
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                 </Form.Control>
                                 <p className="validation-error">{errors.role}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of last row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button type='submit' className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                           </Col>
                        </Row>
                     </Col>
                  </Form>
               </FormFieldsContainer>
            </>
         )}
      </FormContainer>
   )
}

export default HSNEditScreen
