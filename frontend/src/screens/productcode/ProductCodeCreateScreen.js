//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'

import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';
import { createProductCode, getAllMasterDataForProductCode } from './../../actions/masters/prodCodeActions';
import { PRODUCT_CODE_CREATE_RESET } from '../../constants/masters/prodCodeConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import FormFieldsContainer from '../../components/form/FormFieldsContainer';

const ProductCodeCreateScreen = ({ history }) => {
   // 1. Get all the master data and dependent data required to create a form

	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails)
  	const { user } = userDetails

  	const userLogin = useSelector((state) => state.userLogin)
  	const { userInfo } = userLogin

	const productCodeCreate = useSelector((state) => state.productCodeCreate)
	const { success, productCode, error: errorCreate } = productCodeCreate

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
   // 4.1 Validation Errors
   const [ errors, setErrors, salesOrders ] = useState({});

   //9. Trigger useEffect hook to get all the form details
   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForProductCode())
      }
		if (success) {
         history.push('/productcodelist')
		   dispatch({ type: PRODUCT_CODE_CREATE_RESET })
         NotificationManager.success(`Product Code has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: PRODUCT_CODE_CREATE_RESET })
         NotificationManager.error(`Error in creating Product Code !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

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
         dispatch(
            createProductCode({
               hsn: hsnCode,
               name
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
                     <Col lg={6} md={12} xs={12}>
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
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='hsnCode'>
                           <Form.Label>Select HSN Code<span className="mandatory">*</span></Form.Label>
                           <Select
                              style={{background:"#e84347", color:"white"}} 
                              options={options}
                              onChange={(e) => setHSNCode(e.value)}
                           />
                           <p className="validation-error">{errors.hsnCode}</p>
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

export default ProductCodeCreateScreen
