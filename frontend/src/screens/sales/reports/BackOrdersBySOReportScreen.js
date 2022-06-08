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
import { 
   getBackOrdersBySO, 
   getAllJCMasterDataForSalesOrder 
} from './../../../actions/sales/salesOrderActions';

import BackOrdersBySOTable from './../../../components/tables/sales/BackOrdersBySOTable';

// import { 
//    BACK_ORDER_LIST_RESET 
// } from '../../../constants/sales/salesOrderConstants';

const BackOrdersBySOReportScreen = ({ location, history, match }) => {
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const backOrdersBySO = useSelector((state) => state.backOrdersBySO)
	const { loading, salesOrders, totalBackOrderValue } = backOrdersBySO;

   const jcmasterDataForSalesOrder = useSelector((state) => state.jcmasterDataForSalesOrder)

   const [ jcId, setJCId ] = useState("");
   const [ startDate, setStartDate ] = useState("");
   const [ endDate, setEndDate ] = useState("");
   //JC Master Dropdown
   const [ selectedJCNo, setSelectedJCNo ] = useState([{}]);
   const [ selectedJCDescription, setSelectedJCDescription ] = useState([{}]);

   let jcMasters = [];
   let options = [];

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         dispatch(getAllJCMasterDataForSalesOrder())
         dispatch(getBackOrdersBySO())
         //dispatch({ type: BACK_ORDER_LIST_RESET })
		}
	}, [history, userInfo, dispatch])

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
         let srs = [...jcMasters];
         let naam = srs.filter(pc=>{
            return pc._id.trim() === e.value;
         })
         if(naam !== undefined && naam[0] !== undefined && naam[0].jcCustomerDetails[0] !== undefined) {
            let dropDownJCDescEle = { label: naam[0].jcDescription, value: e.value };
            let dropDownJCNoEle = { label: naam[0].jcno, value: e.value };
            setSelectedJCDescription(dropDownJCDescEle);
            setSelectedJCNo(dropDownJCNoEle);
         }
      }
   }

   const submitHandler = (e) => {
      e.preventDefault();
      dispatch(getBackOrdersBySO(jcId, startDate, endDate))
   }

   const handleReset = (e) => {
      // setJCId("");
      // dispatch(getAllJCMasterDataForSalesOrder())
      // dispatch(getBackOrdersBySO(jcId, startDate, endDate ))
      //dispatch({ type: BACK_ORDER_LIST_RESET })
      window.location.reload();
   }

   return (
      <React.Fragment>
         <br></br>
         <div style={{border:"0px solid black", borderRadius:"5px", background:"white"}}>
         <br></br>
         <Row className='align-items-center mx-1'>
            <Col lg={6} md={12} xs={12}>
               <h4 ><i className="fas fa-list"></i> Back Order Report by SO#</h4>
            </Col>
            <Col lg={6} md={12} xs={12} className="text-right">
               <h5>
                  Back Order Balance Value (₹):&nbsp;  
                  <NumberFormat
                     thousandsGroupStyle="lakh"
                     value = {totalBackOrderValue!==undefined?totalBackOrderValue.toFixed(2):"0.00"}
                     decimalSeparator="."
                     displayType="text"
                     type="text"
                     thousandSeparator={true}
                     allowNegative={true} 
                  />
               </h5>
            </Col>
         </Row>
         <br></br>
         <hr></hr>
         <Form onSubmit={submitHandler}>
            <Row className="mx-2">
               <Col lg={2} md={12} xs={12}>
                  <Form.Group controlId='customerId'>
                     <Form.Label>Select JC #<span className="mandatory"></span></Form.Label>
                     <Select 
                        name="jcNo"
                        options = {jcMasters!==undefined?(jcMasters.map(jc => {
                           return { value: jc._id, label: jc.jcno }
                        })):null} 
                        onChange={event => handleJC(event)}
                        value={selectedJCNo}
                     />
                  </Form.Group>
               </Col>
               <Col lg={4} md={12} xs={12}>
                  <Form.Group controlId='jcNo'>
                     <Form.Label>Select JC Description<span className="mandatory">*</span></Form.Label>
                     <Select
                        style={{background:"#e84347", color:"white"}} 
                        options={options}
                        onChange={(e) => handleJC(e)}
                        value={selectedJCDescription}
                     />
                  </Form.Group>
               </Col>
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
            </Row>
            <Row>
               <Col style={{textAlign:"end"}}>
                  <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                  <Button type='submit' onClick={(e) => e.currentTarget.blur()} className=' my-3 mx-2 btn-md button-class' ><i className="fas fa-save"></i> Search</Button>
               </Col>
            </Row>
         </Form>
         <br></br>
         {loading ? (
            <Loader />
         ) : error ? (
            <Message variant='danger'>{error}</Message>
         ) : (
            <>
               {salesOrders === undefined? (<p className="text-center"><b>No Records Found</b></p>) : (
                  <BackOrdersBySOTable data={salesOrders} />
               )}
               
            </>
         )}
         </div>
      </React.Fragment>
   )
}

export default BackOrdersBySOReportScreen
