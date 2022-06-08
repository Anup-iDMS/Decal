//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
// import Select from 'react-select'
import { format } from 'date-fns'
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// React Notification
import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from '../../components/app/Breadcrumb';
import { updateProductCode, getProductCodeDetails, getAllMasterDataForProductCode } from './../../actions/masters/prodCodeActions';
import { PRODUCT_CODE_UPDATE_RESET } from '../../constants/masters/prodCodeConstants';
import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';
import { logger } from './../../util/ConsoleHelper';

const ProductCodeEditScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const prodCodeId = match.params.id;
   
   const productCodeDetails = useSelector((state) => state.productCodeDetails)

   const { loading, productCode, error } = productCodeDetails;

   //post updated JC record
   const productCodeUpdate = useSelector((state) => state.productCodeUpdate);
   const { success: successUpdate, error: errorUpdate } = productCodeUpdate

   const masterDataForProductCode = useSelector((state) => state.masterDataForProductCode)

   const { loading: loadingMasterData } = masterDataForProductCode;

   let hsnCodes = [];
   let options = [];

   if(masterDataForProductCode !== undefined) {
      hsnCodes = masterDataForProductCode.hsnCodes
      if(hsnCodes !== undefined) {
         hsnCodes.map(hsn => {
            let dropDownEle = { label: hsn.hsnCode, value: hsn.hsnCode };
            return options.push(dropDownEle);
         });
      }
   }

   const [ name, setName] = useState("");
   const [ hsnCode, setHSNCode ] = useState("");
   const [ active, setActive ] = useState("");
   const [ isActive, setIsActive ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   useEffect(() => {
      
      if (productCode._id !== prodCodeId) {
         dispatch(getAllMasterDataForProductCode())
         dispatch(getProductCodeDetails(prodCodeId))
      } else {
         //logger("user.role._id ", user.isActive)
         setName(productCode.name);
         console.log("productCode.hsn ", productCode.hsn)
         setHSNCode(productCode.hsn);
         setActive(productCode.isActive?"Yes":"No");
         setIsActive(productCode.active==="Yes"?true:false);
      }
      if(successUpdate) {
         history.push('/productcodelist');
         dispatch({ type: PRODUCT_CODE_UPDATE_RESET })
         NotificationManager.success(`Product Code has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         dispatch({ type: PRODUCT_CODE_UPDATE_RESET })
         NotificationManager.error(`Error in updating Product Code !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [prodCodeId, productCode, successUpdate]);

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( name.trim().length === 0 ) {
         newErrors.name = 'Enter a Name!'
      }
      if ( hsnCode.trim().length === 0 ) {
         newErrors.hsnCode = 'Select a HSN Code!'
      }
      
      return newErrors;
   }

   const handleProductCodeActive = (e) => {
      setActive(e.target.value)
      setIsActive(e.target.value === "Yes"?true:false)
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

   //8. Form Submit
   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();
      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
         NotificationManager.error(`Please fill in the required details !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      } else {
         console.log("User Active === ", active)
         console.log("User Active === isActive ", isActive)
         
         dispatch(
            updateProductCode({
               _id: prodCodeId,
               name,
               hsn: hsnCode,
               isActive
            })
         );
      }
   }


   return (
      <FormContainer>
         <Breadcrumb listPage = "configuration" />
         <br></br>
         <Row>
            <Col>
               <h4>Add Product Code</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Enter Product Code Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='name'>
                        <Form.Label>Product Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='name'
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.name}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='hsnCode'>
                           <Form.Label>Select HSN Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              as='select'
                              custom
                              name='hsnCode'
                              value={hsnCode}
                              onChange={(e) => setHSNCode(e.target.value)}
                           >
                              {hsnCodes!==undefined?(hsnCodes.map(hsn => {
                                 return <option key={hsn.hsnCode} value={hsn.hsnCode}>{hsn.hsnCode}</option>
                              })):null}
                           </Form.Control>
                           <p className="validation-error">{errors.hsnCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='active'>
                           <Form.Label>Active<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              as='select'
                              custom
                              name='active'
                              placeholder='Select'
                              value={active}
                              onChange={(e) => handleProductCodeActive(e)}
                           >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                           </Form.Control>
                           <p className="validation-error">{errors.role}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                  {/* START of LAST row in the form */}
                  <Row>
                     <Col style={{textAlign:"end"}}>
                        <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                        <Button type='submit' className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
      </FormContainer>
   )
}

export default ProductCodeEditScreen
