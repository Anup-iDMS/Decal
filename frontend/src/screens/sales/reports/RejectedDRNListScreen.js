//import standard React Components
import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import NumberFormat from 'react-number-format';
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//import Custom Application Components
import Message from '../../../components/app/Message'
import Loader from '../../../components/app/Loader'

//import Sales Order Specific Redux "action(s)" 

import RejectedDRNTable from '../../../components/tables/production/RejectedDRNTable';
import { listAllRejectedDRNs } from '../../../actions/production/drnActions';


const RejectedDRNListScreen = ({ location, history, match }) => {
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error:errorUser } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const allRejectedDRNList = useSelector((state) => state.allRejectedDRNList)
	const { loading, drns, error } = allRejectedDRNList;

   const [ startDate, setStartDate ] = useState("");
   const [ endDate, setEndDate ] = useState("");

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         dispatch(listAllRejectedDRNs())
		}
	}, [history, userInfo, dispatch])

   const submitHandler = (e) => {
      e.preventDefault();
      dispatch(listAllRejectedDRNs(startDate, endDate))
   }

   const handleReset = (e) => {
      window.location.reload();
   }

   return (
      <React.Fragment>
         <br></br>
         <div style={{border:"0px solid black", borderRadius:"5px", background:"white"}}>
            <br></br>
            <Row className='align-items-center mx-1'>
               <Col lg={6} md={12} xs={12}>
                  <h4 ><i className="fas fa-list"></i> Rejected DRN List</h4>
               </Col>
            </Row>
            <br></br>
            <hr></hr>
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
                  <Col lg={6} md={12} xs={12} style={{textAlign:"end"}}>
                     <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                     <Button type='submit' onClick={(e) => e.currentTarget.blur()} className=' my-3 mx-2 btn-md button-class' ><i className="fas fa-save"></i> Search</Button>
                  </Col>
               </Row>
            </Form>
            {loading ? (
               <Loader />
            ) : error ? (
               <Message variant='danger'>{error}</Message>
            ) : (
               <>
                  {drns === undefined? (<p className="text-center"><b>No Records Found</b></p>) : (
                     <RejectedDRNTable data={drns} />
                  )}
                  
               </>
            )}
         </div>
      </React.Fragment>
      
   )
}

export default RejectedDRNListScreen
