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
//import Issue Redux "action(s)"
import { createIssue, getAllMasterDataForIssue } from '../../actions/masters/issueActions';

//import Redux "constantc(s)"
import { ISSUE_CREATE_RESET } from '../../constants/masters/issueConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

import FormFieldsContainer from '../../components/form/FormFieldsContainer';

const IssueCreateScreen = ({ history }) => {

	// 1. Get all the master data and dependent data required to create a form

	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails)
  	const { user } = userDetails

  	const userLogin = useSelector((state) => state.userLogin)
  	const { userInfo } = userLogin

	const issueCreate = useSelector((state) => state.issueCreate)
	const { success, issue, error: errorCreate } = issueCreate

	const masterDataForIssue = useSelector((state) => state.masterDataForIssue)

   const { loading: loadingMasterData } = masterDataForIssue;

	let autoIncrementedIssueNo = "";
   if(masterDataForIssue !== undefined) {
      autoIncrementedIssueNo = masterDataForIssue.autoIncrementedIssueNo;
   }
   
	// 2. Define All Form Variables and their state
	const [ issueNumber, setIssueNo ] = useState(autoIncrementedIssueNo);
	const [ issueTitle, setIssueTitle ] = useState("");
	const [ issueDescription, setIssueDescription ] = useState("");
	// 4.1 Validation Errors
	const [ errors, setErrors, drns ] = useState({});
	//disable button on click
	const [executing, setExecuting] = useState(false);

	//9. Trigger useEffect hook to get all the form details
   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForIssue())
      }
		if (success) {
         history.push('/issuelist')
		   dispatch({ type: ISSUE_CREATE_RESET })
         NotificationManager.success(`Issue # ${issue.issueNumber} has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: ISSUE_CREATE_RESET })
         NotificationManager.error(`Error in creating Issue !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

	}, [ history, success ])

   // 3. Define all handler functions to change the state of FORM variables

   
   // 4. Validate the "FORM" before submit
   
   
   // 5. Reset and Submit Form functions

   // 5.1 Reset The FORM
   const handleReset = () => {
      window.location.reload();
   }

  	//6. Form Validation
	  const findFormErrors = () => {

		const newErrors = {};
      if ( issueTitle.trim().length === 0 ) {
      	newErrors.issueTitle = 'Enter Issue Title!'
      }
      if ( issueDescription.trim().length === 0 ) {
      	newErrors.issueDescription = 'Enter Issue Description!'
      }

		return newErrors;
	}

	// 6.2 Submit The Form
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
         dispatch(
            createIssue({
               issueNumber: autoIncrementedIssueNo,
               issueTitle,
               issueDescription
            })
			)
   	}
	}
   //7. Form Reset
   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }
	
	return (
      <FormContainer>
         <Breadcrumb
            listPage = "issuelist"
         />
         <br></br>
         <React.Fragment>
				<br></br>
				<Row>
					<Col>
						<h4>Issue Details Entry</h4>
					</Col>
				</Row>
				<br></br>
				<FormFieldsContainer frameTitle = "Please Enter Issue Details !!!" >
					<Form onSubmit={submitHandler}>
						<Col>
							{/* START of 1st row in the form */}
							<Row>
								<Col lg={3} md={12} xs={12}>
									<Form.Group controlId='issueNumber'>
									<Form.Label>Ticket #<span className="mandatory">*</span></Form.Label>
										<Form.Control
											type='text'
											name='issueNumber'
											readOnly
											value={autoIncrementedIssueNo}
											onChange={(e) => setIssueNo(e.target.value)}
										></Form.Control>
                              <p className="validation-error">{errors.issueNumber}</p>
									</Form.Group>
								</Col>
                        <Col lg={9} md={12} xs={12}>
									<Form.Group controlId='issueTitle'>
									<Form.Label>Module Name<span className="mandatory">*</span></Form.Label>
										<Form.Control
											type='text'
											name='issueTitle'
											value={issueTitle}
											onChange={(e) => setIssueTitle(e.target.value)}
										></Form.Control>
                              <p className="validation-error">{errors.issueTitle}</p>
									</Form.Group>
								</Col>
							</Row>
                     <Row>
                        <Col lg={12} md={12} xs={12}>
                           <Form.Group controlId='issueDescription'>
                           <Form.Label>Issue Description<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 as='textarea'
											rows={3}
                                 name='issueDescription'
                                 value={issueDescription}
                                 onChange={(e) => setIssueDescription(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.issueDescription}</p>
                           </Form.Group>
                        </Col>
                     </Row>
							 {/* START of LAST row in the form */}
							 <Row>
								<Col style={{textAlign:"end"}}>
									<Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
									<Button 
										type='submit'
										disabled={executing} 
										className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
								</Col>
						 	</Row>
						</Col>
					</Form>
				</FormFieldsContainer>
			</React.Fragment>
		</FormContainer>
	)
}

export default IssueCreateScreen