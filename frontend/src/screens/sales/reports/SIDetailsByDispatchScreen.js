//import standard React Components
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Form, Button } from 'react-bootstrap'
import NumberFormat from 'react-number-format';
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//import Custom Application Components
import Message from '../../../components/app/Message'
import Loader from '../../../components/app/Loader'


//import Sales Order Specific Redux "action(s)" 
import { 
   getAllMasterDataForSalesOrder 
} from './../../../actions/sales/salesOrderActions';

//import Sales Invoice Specific Redux "action(s)" 
import { getSIDetailsByDispatch } from './../../../actions/sales/salesInvoiceActions';
import SalesInvoiceDispatchDetailsTable from './../../../components/tables/sales/SalesInvoiceDispatchDetailsTable';
import TableContainer from './../../../components/app/TableContainer';

const SIDetailsByDispatchScreen = ({ location, history, match }) => {
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const siDetailsByDispatch = useSelector((state) => state.siDetailsByDispatch)
	const { loading, salesInvoices, error:errorLoad } = siDetailsByDispatch;

   const masterDataForSalesOrder = useSelector((state) => state.masterDataForSalesOrder)

   const [ customerId, setCustomerId ] = useState("");
   const [ startDate, setStartDate ] = useState("");
   const [ endDate, setEndDate ] = useState("");


   let customers = [];
   let options = [];

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         dispatch(getAllMasterDataForSalesOrder())
         dispatch(getSIDetailsByDispatch(customerId, startDate, endDate))
		}
      window.scrollTo(0, 0)
	}, [dispatch, history, userInfo])

   if(masterDataForSalesOrder !== undefined) {
      customers = masterDataForSalesOrder.customers

      if(customers !== undefined) {
         customers.map(customer => {
            let dropDownEle = { label: customer.custName, value: customer._id };
            return options.push(dropDownEle);
         });
      }
      //setSoNo(autoIncrementedSalesOrderNo);
   }

   const handleCustomer = (e) => {
      if(e.value.trim() === "") {
         setCustomerId("")
      } else {
         setCustomerId(e.value);
      }
   }

   const submitHandler = (e) => {
      e.preventDefault();
      dispatch(getSIDetailsByDispatch(customerId, startDate, endDate))
   }

   const handleReset = (e) => {
      window.location.reload();
   }

   return (
      <React.Fragment>
         <Form onSubmit={submitHandler}>
            <Row className="mx-2">
               <Col lg={4} md={12} xs={12}>
                  <Form.Group controlId='customer'>
                     <Form.Label>Select Customer<span className="mandatory">*</span></Form.Label>
                     <Select
                        style={{background:"#e84347", color:"white"}} 
                        options={options}
                        onChange={(e) => handleCustomer(e)}
                     />
                  </Form.Group>
               </Col>
               <Col lg={4} md={12} xs={12}>
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
            </Row>
            <Row>
               <Col style={{textAlign:"end"}}>
                  <Button type='reset' onClick={(e) => e.currentTarget.blur()} className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                  <Button type='submit' onClick={(e) => e.currentTarget.blur()} className=' my-3 mx-2 btn-md button-class' ><i className="fas fa-save"></i> Search</Button>
               </Col>
            </Row>
         </Form>
         <br></br>
         <TableContainer
            title = "Dispatch By Tax Invoice Report"
            listPage = "#"
            actionName = "Sales Invoice Line Details"
            data = {salesInvoices}
            TableName = {SalesInvoiceDispatchDetailsTable}
            loading = {loading}
            error = {errorLoad}
            showActionButton = {false}
         />
      </React.Fragment>
      
   )
}

export default SIDetailsByDispatchScreen
