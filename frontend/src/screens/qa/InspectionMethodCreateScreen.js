//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'

import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import { INSPECTION_METHOD_CREATE_RESET } from '../../constants/qa/inspectionMethodConstants';
import { createInspectionMethod, getAllMasterDataForInspectionMethod } from './../../actions/qa/inspectionMethodActions';



const InspectionMethodCreateScreen = ({ history }) => {
   const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails)
  	const { user } = userDetails

  	const userLogin = useSelector((state) => state.userLogin)
  	const { userInfo } = userLogin

	const inspectionMethodCreate = useSelector((state) => state.inspectionMethodCreate)
	const { success, inspectionMethod, error: errorCreate } = inspectionMethodCreate

   const [ inspectionMethodCode, setInspectionMethodCode ] = useState("");
   const [ inspectionMethodName, setInspectionMethodName ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   const masterDataForInspectionMethod = useSelector((state) => state.masterDataForInspectionMethod)

   const { loading: loadingMasterData } = masterDataForInspectionMethod;

   let autoIncrementedInspectionMethodNo = "";
   if(masterDataForInspectionMethod !== undefined) {
      autoIncrementedInspectionMethodNo = masterDataForInspectionMethod.autoIncrementedInspectionMethodNo;
   }


   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForInspectionMethod())
      }
		if (success) {
         history.push('/pdirconfig')
		   dispatch({ type: INSPECTION_METHOD_CREATE_RESET })
         NotificationManager.success(`Record has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: INSPECTION_METHOD_CREATE_RESET })
         NotificationManager.error(`Error in creating Record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( inspectionMethodName.trim().length === 0 ) {
         newErrors.inspectionMethodName = 'Enter a Method Name!'
      }

      return newErrors;
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
            createInspectionMethod({
               inspectionMethodCode: autoIncrementedInspectionMethodNo,
               inspectionMethodName
            })
         );
      }
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

   return (
      <FormContainer>
         <Breadcrumb listPage = "pdirconfig" />
         <br></br>
         <Row>
            <Col>
               <h4>Add Inspection Method</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Enter The Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='inspectionMethodCode'>
                        <Form.Label>Inspection Method Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              readOnly
                              name='inspectionMethodCode'
                              value={autoIncrementedInspectionMethodNo}
                              onChange={(e) => setInspectionMethodCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.inspectionMethodCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='inspectionMethodName'>
                        <Form.Label>Inspection Method Name<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='inspectionMethodName'
                              value={inspectionMethodName}
                              onChange={(e) => setInspectionMethodName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.inspectionMethodName}</p>
                        </Form.Group>
                     </Col>
                  </Row>
                   {/* START of LAST row in the form */}
                   <Row>
                     <Col style={{textAlign:"end"}}>
                        <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                        <Button type='submit' className=' my-3 btn-md button-class' onClick={(e) => e.currentTarget.blur()}><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
      </FormContainer>
   )
}

export default InspectionMethodCreateScreen
