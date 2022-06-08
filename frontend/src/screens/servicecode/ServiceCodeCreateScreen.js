//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'

import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';
import { createServiceCode, getAllMasterDataForServiceCode } from './../../actions/masters/serviceCodeActions';
import { SERVICE_CODE_CREATE_RESET } from '../../constants/masters/serviceCodeConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import FormFieldsContainer from '../../components/form/FormFieldsContainer';

const ServiceCodeCreateScreen = ({ history }) => {
   // 1. Get all the master data and dependent data required to create a form

	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails)
  	const { user } = userDetails

  	const userLogin = useSelector((state) => state.userLogin)
  	const { userInfo } = userLogin

	const serviceCodeCreate = useSelector((state) => state.serviceCodeCreate)
	const { success, serviceCode, error: errorCreate } = serviceCodeCreate

	const masterDataForServiceCode = useSelector((state) => state.masterDataForServiceCode)

   const { loading: loadingMasterData } = masterDataForServiceCode;

   let sacs = [];
   let options = [];
   let autoIncrementeServiceCodeNo = ";"

   if(masterDataForServiceCode !== undefined) {
      sacs = masterDataForServiceCode.sacs
      autoIncrementeServiceCodeNo = masterDataForServiceCode.autoIncrementeServiceCodeNo
      if(sacs !== undefined) {
         sacs.map(sac => {
            let dropDownEle = { label: sac.sacCode, value: sac._id };
            return options.push(dropDownEle);
         });
      }
   }

   const [ code, setCode ] = useState("");
   const [ name, setName ] = useState("");
   const [ sacCode, setSACCode ] = useState("");
   const [ sacId, setSACId ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors, salesOrders ] = useState({});
   
   //disable button on click
   const [executing, setExecuting] = useState(false);

   //9. Trigger useEffect hook to get all the form details
   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForServiceCode())
      }
		if (success) {
         history.push('/servicecodelist')
		   dispatch({ type: SERVICE_CODE_CREATE_RESET })
         NotificationManager.success(`Service Code has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: SERVICE_CODE_CREATE_RESET })
         NotificationManager.error(`Error in creating Service Code !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( name.trim().length === 0 ) {
         newErrors.name = 'Enter a Name!'
      }
      if ( sacCode.trim().length === 0 ) {
         newErrors.sacCode = 'Select a HSN Code!'
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

   const handleSACSelection = (e) => {
      setSACCode(e.label)
      setSACId(e.value)
   }

   //

   const handleReset = (e) => {
      e.currentTarget.blur()
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
         setExecuting(true);
         dispatch(
            createServiceCode({
               code: autoIncrementeServiceCodeNo,
               sac: sacCode,
               name,
               sacId
            })
         );
      }
   }


   return (
      <FormContainer>
         <Breadcrumb listPage = "servicecodelist" />
         <br></br>
         <Row>
            <Col>
               <h4>Add Service Code</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Enter Service Code Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='code'>
                        <Form.Label>Service Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='code'
                              readOnly
                              value={autoIncrementeServiceCodeNo}
                              onChange={(e) => setName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.code}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='name'>
                        <Form.Label>Service Name<span className="mandatory">*</span></Form.Label>
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
                        <Form.Group controlId='sacCode'>
                           <Form.Label>Select HSN Code<span className="mandatory">*</span></Form.Label>
                           <Select
                              style={{background:"#e84347", color:"white"}} 
                              options={options}
                              onChange={(e) => handleSACSelection(e)}
                           />
                           <p className="validation-error">{errors.sacCode}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                   {/* START of LAST row in the form */}
                   <Row>
                     <Col style={{textAlign:"end"}}>
                        <Button 
                           type='reset' 
                           className='reset-button-class mx-3 my-3 btn-md' 
                           onClick={(e)=>handleReset(e)}><i className="fas fa-undo"></i> Reset</Button>
                        <Button 
                           type='submit'
                           disabled={executing}
                           onClick={(e) => e.currentTarget.blur()}
                           className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
      </FormContainer>
   )
}

export default ServiceCodeCreateScreen