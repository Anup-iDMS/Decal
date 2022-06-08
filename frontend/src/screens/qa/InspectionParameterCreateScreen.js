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
import { INSPECTION_PARAM_CREATE_RESET } from '../../constants/qa/inspectionParameterConstants';
import { createInspectionParameter, getAllMasterDataForInspectionParameter } from './../../actions/qa/inspectionParameterActions';



const InspectionParameterCreateScreen = ({ history }) => {
   const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails)
  	const { user } = userDetails

  	const userLogin = useSelector((state) => state.userLogin)
  	const { userInfo } = userLogin

	const inspectionParameterCreate = useSelector((state) => state.inspectionParameterCreate)
	const { success, inspectionParameter, error: errorCreate } = inspectionParameterCreate

   const [ inspectionParameterCode, setInspectionParameterCode ] = useState("");
   const [ inspectionParameterName, setInspectionParameterName ] = useState("");
   // 4.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   const masterDataForInspectionParameter = useSelector((state) => state.masterDataForInspectionParameter)

   const { loading: loadingMasterData } = masterDataForInspectionParameter;

   let autoIncrementedInspectionParameterNo = "";
   if(masterDataForInspectionParameter !== undefined) {
      autoIncrementedInspectionParameterNo = masterDataForInspectionParameter.autoIncrementedInspectionParameterNo;
   }


   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForInspectionParameter())
      }
		if (success) {
         history.push('/pdirconfig')
		   dispatch({ type: INSPECTION_PARAM_CREATE_RESET })
         NotificationManager.success(`Record has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: INSPECTION_PARAM_CREATE_RESET })
         NotificationManager.error(`Error in creating Record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

   const findFormErrors = () => {
      const newErrors = {};
      
      if ( inspectionParameterName.trim().length === 0 ) {
         newErrors.inspectionParameterName = 'Enter a Parameter Name!'
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
            createInspectionParameter({
               inspectionParameterCode: autoIncrementedInspectionParameterNo,
               inspectionParameterName
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
               <h4>Add Inspection Parameter</h4>
            </Col>
         </Row>
         <br></br>
         <FormFieldsContainer frameTitle = "Please Enter The Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='inspectionParameterCode'>
                        <Form.Label>Inspection Parameter Code<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              readOnly
                              name='inspectionParameterCode'
                              value={autoIncrementedInspectionParameterNo}
                              onChange={(e) => setInspectionParameterCode(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.inspectionParameterCode}</p>
                        </Form.Group>
                     </Col>
                     <Col lg={6} md={12} xs={12}>
                        <Form.Group controlId='inspectionParameterName'>
                        <Form.Label>Inspection Parameter Name<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='inspectionParameterName'
                              value={inspectionParameterName}
                              onChange={(e) => setInspectionParameterName(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.inspectionParameterName}</p>
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

export default InspectionParameterCreateScreen
