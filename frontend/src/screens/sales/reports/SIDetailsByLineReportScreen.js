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
   getAllJCMasterDataForSalesOrder 
} from './../../../actions/sales/salesOrderActions';

//import Sales Invoice Specific Redux "action(s)" 
import { getSIDetailsByLine } from './../../../actions/sales/salesInvoiceActions';
import SalesInvoiceLineDetailsTable from './../../../components/tables/sales/SalesInvoiceLineDetailsTable';
import TableContainer from './../../../components/app/TableContainer';

const SIDetailsByLineReportScreen = ({ location, history, match }) => {
   
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const siDetailsByLine = useSelector((state) => state.siDetailsByLine)
	const { loading, salesInvoices, error:errorLoad } = siDetailsByLine;

   const jcmasterDataForSalesOrder = useSelector((state) => state.jcmasterDataForSalesOrder)

   const [ jcId, setJCId ] = useState("");
   const [ startDate, setStartDate ] = useState("");
   const [ endDate, setEndDate ] = useState("");


   let jcMasters = [];
   let options = [];

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         dispatch(getAllJCMasterDataForSalesOrder())
         dispatch(getSIDetailsByLine(jcId, startDate, endDate))
		}
      window.scrollTo(0, 0)
	}, [dispatch, history, userInfo])

   if(jcmasterDataForSalesOrder !== undefined) {
      jcMasters = jcmasterDataForSalesOrder.jcMasters
      
      if(jcMasters !== undefined) {
         jcMasters.map(jc => {
            let dropDownEle = { label: jc.jcDescription, value: jc._id };
            return options.push(dropDownEle);
         });
      }
   }

   const handleJC = (e) => {
      if(e.value.trim() === "") {
         setJCId("")
      } else {
         setJCId(e.value);
      }
   }

   const submitHandler = (e) => {
      e.preventDefault();
      dispatch(getSIDetailsByLine(jcId, startDate, endDate))
   }

   const handleReset = (e) => {
      window.location.reload();
   }

   return (
      <React.Fragment>
         <Form onSubmit={submitHandler}>
            <Row className="mx-2">
               <Col lg={4} md={12} xs={12}>
                  <Form.Group controlId='jcNo'>
                     <Form.Label>Select JC Description<span className="mandatory">*</span></Form.Label>
                     <Select
                        style={{background:"#e84347", color:"white"}} 
                        options={options}
                        onChange={(e) => handleJC(e)}
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
            title = "Sales Invoice List"
            listPage = "#"
            actionName = "Sales Invoice Line Details"
            data = {salesInvoices}
            TableName = {SalesInvoiceLineDetailsTable}
            loading = {loading}
            error = {errorLoad}
            showActionButton = {false}
         />
      </React.Fragment>
      
   )
}

export default SIDetailsByLineReportScreen
