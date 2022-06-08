import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';

//import Redux action to create HSN record
import { updateIssue, getIssueDetails } from './../../actions/masters/issueActions';

//import Redux "constantc(s)"
import { ISSUE_UPDATE_RESET } from '../../constants/masters/issueConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

const IssueEditScreen = ({ match, history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   
   //const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin
   
   const issueId = match.params.id;
   
   const issueDetails = useSelector((state) => state.issueDetails)

   const { loading, issue, error } = issueDetails;
   if(!loading)
      console.log("---------- found issue details ------------ ", issue)

   //post updated Job Card Record
   const issueUpdate = useSelector((state) => state.issueUpdate);
   const { success: successUpdate, error: errorUpdate } = issueUpdate

   // 2. Define All Form Variables and their state
	const [ issueNumber, setIssueNo ] = useState("");
	const [ issueTitle, setIssueTitle ] = useState("");
	const [ issueDescription, setIssueDescription ] = useState("");
	const [ issueDate, setIssueDate ] = useState("");
	const [ issueStatus, setIssueStatus ] = useState("");
	const [ issueResolution, setIssueResolution ] = useState("");
	// 4.1 Validation Errors
	const [ errors, setErrors, drns ] = useState({});
   //disable button on click
   const [executing, setExecuting] = useState(false);

   useEffect(() => {
      
      if (issue._id !== issueId) {
         //console .log("2. Edit Sales Order Screen and Inside useEffect. Before getting SO Details ==== ")
         dispatch(getIssueDetails(issueId))
      } else {
         setFormData();
      }

		if (successUpdate) {
         //history.replace(`/hsnsac/${hsnsac._id}/edit`)
         history.push('/issuelist');
         dispatch({ type: ISSUE_UPDATE_RESET })
         NotificationManager.success(`Issue Entry has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorUpdate) {
         dispatch({ type: ISSUE_UPDATE_RESET })
         NotificationManager.error(`Error while updating Issue Entry !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      
		// eslint-disable-next-line
	}, [history, issueId, issue, successUpdate])

   const setFormData = () => {
      setIssueNo(issue.issueNumber);
      setIssueTitle(issue.issueTitle);
      setIssueDescription(issue.issueDescription);
      setIssueDate(new Date(issue.issueDate));
      setIssueStatus(issue.issueStatus);
      setIssueResolution(issue.issueResolution);
   }

   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const findFormErrors = () => {
      const newErrors = {};
      if (issueTitle.trim().length === 0 ) {
         newErrors.issueTitle = 'Enter Issue Title!'
      }
      if (issueDescription.trim().length === 0 ) {
         newErrors.issueDescription = 'Enter Issue Description!'
      }

      return newErrors;
   }

   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();

      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
      } 
      else {
         setExecuting(true);
         dispatch(
            updateIssue({
               _id:issueId,
               issueNumber,
               issueTitle,
               issueDescription,
               issueDate,
               issueStatus,
               issueResolution
            })
         )
      }
   }

   const handleReset = () => {
      window.location.reload();
   }

   return (
      <FormContainer>
         <Breadcrumb listPage = "issuelist" />
         <br></br>
         <Row>
            <Col>
               <h4>Edit Application Issue</h4>
            </Col>
         </Row>
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
         <FormFieldsContainer frameTitle = "Please Enter Issue Details !!!" >
            <Form onSubmit={submitHandler}>
               <Col>
                  <Row>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='issueNumber'>
                        <Form.Label>Ticket #<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              type='text'
                              name='issueNumber'
                              readOnly
                              value={issueNumber}
                              onChange={(e) => setIssueNo(e.target.value)}
                           ></Form.Control>
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='issueDate'>
                           <Form.Label>Issue Reported Date<span className="mandatory">*</span></Form.Label>
                           <DatePicker 
                              dateFormat="dd-MMM-yy"
                              className="form-control"
                              selected={issueDate} 
                              onChange={(date) => setIssueDate(date)} 
                              readOnly
                           />
                        </Form.Group>
                     </Col>
                     <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='issueStatus'>
                           <Form.Label>Issue Status<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              as='select'
                              custom
                              name='issueStatus'
                              placeholder='Select'
                              value={issueStatus}
                              onChange={(e) => setIssueStatus(e.target.value)}
                           >
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Fixed">Fixed</option>
                              <option value="Deployed on Production">Deployed on Production</option>
                              <option value="Verified">Verified</option>
                              <option value="Closed">Closed</option>
                              <option value="Reopen">Reopen</option>
                           </Form.Control>
                        </Form.Group>
                     </Col>
                  </Row>
                  <Row>
                     <Col lg={12} md={12} xs={12}>
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
                  <Row>
                     <Col lg={12} md={12} xs={12}>
                        <Form.Group controlId='issueResolution'>
                        <Form.Label>Issue Resolution<span className="mandatory">*</span></Form.Label>
                           <Form.Control
                              as='textarea'
                              rows={3}
                              name='issueResolution'
                              value={issueResolution}
                              onChange={(e) => setIssueResolution(e.target.value)}
                           ></Form.Control>
                           <p className="validation-error">{errors.issueResolution}</p>
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
                           onClick={(e) => e.currentTarget.blur()} className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                     </Col>
                  </Row>
               </Col>
            </Form>
         </FormFieldsContainer>
         )}
      </FormContainer>
   )
}

export default IssueEditScreen
