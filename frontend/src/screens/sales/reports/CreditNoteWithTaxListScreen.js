//import standard React Components
import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import NumberFormat from 'react-number-format';
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import Custom Application Components
import { listAllCreditNotesWithTax } from './../../../actions/sales/creditNoteActions';
import TableContainer from './../../../components/app/TableContainer';
import FormContainer from './../../../components/form/FormContainer';
import Goback from './../../../components/app/Goback';
import CreditNoteWithTaxTable from './../../../components/tables/sales/CreditNoteWithTaxTable';

const CreditNoteWithTaxListScreen = ({ match, history }) => {
   const pageNumber = match.params.pageNumber || 1

   const [ startDate, setStartDate ] = useState("");
   const [ endDate, setEndDate ] = useState("");
   const [ jcId, setJCId ] = useState("");
   const [ customerId, setCustomerId ] = useState("");
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error: errorUser, user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allCreditNoteWithTaxList = useSelector((state) => state.allCreditNoteWithTaxList)
	const { loading, creditNotes, error } = allCreditNoteWithTaxList;

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			dispatch(listAllCreditNotesWithTax(pageNumber))
		  }
		}
      window.scrollTo(0, 0)
	}, [dispatch, history, userInfo, user, pageNumber])

   const submitHandler = (e) => {
      e.preventDefault();
      dispatch(listAllCreditNotesWithTax(pageNumber, jcId, customerId, startDate, endDate))
   }

   const handleReset = (e) => {
      window.location.reload();
   }

   return (
      <React.Fragment>
         <FormContainer>
            <Goback
               history = {history}
            />
            <Form onSubmit={submitHandler}>
               <Row className="mx-2">
                  <Col lg={3} md={12} xs={12}>
                     <Form.Group controlId='startDate'>
                        <Form.Label>From Date<span className="mandatory"></span></Form.Label>
                        <DatePicker 
                           className="form-control"
                           dateFormat="dd-MMM-yyyy"
                           selected={startDate} 
                           onChange={(date) => setStartDate(date)} 
                        />
                     </Form.Group>
                  </Col>
                  <Col lg={3} md={12} xs={12}>
                     <Form.Group controlId='endDate'>
                        <Form.Label>To Date<span className="mandatory"></span></Form.Label>
                        <DatePicker 
                           className="form-control"
                           dateFormat="dd-MMM-yyyy"
                           selected={endDate} 
                           onChange={(date) => setEndDate(date)} 
                        />
                     </Form.Group>
                  </Col>
                  <Col lg={6} md={12} xs={12} style={{textAlign:"end", marginTop:"10px"}}>
                     <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                     <Button type='submit' onClick={(e) => e.currentTarget.blur()} className=' my-3 mx-2 btn-md button-class' ><i className="fas fa-save"></i> Search</Button>
                  </Col>
               </Row>
            </Form>
            <TableContainer
               title = "Credit Note With Tax"
               listPage = "#"
               actionName = ""
               data = {creditNotes}
               TableName = {CreditNoteWithTaxTable}
               loading = {loading}
               error = {error}
               showActionButton = {false}
            />
         </FormContainer>
      </React.Fragment>
      
   )
}

export default CreditNoteWithTaxListScreen
