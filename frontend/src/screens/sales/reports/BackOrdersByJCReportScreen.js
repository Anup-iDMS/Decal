//import standard React Components
import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import NumberFormat from 'react-number-format';

//import Custom Application Components
import Message from '../../../components/app/Message'
import Loader from '../../../components/app/Loader'

//import Sales Order Specific Redux "action(s)" 
import { 
   getBackOrdersByJC,
   getAllJCMasterDataForSalesOrder 
} from './../../../actions/sales/salesOrderActions';

//import Redux "constantc(s)"
import { SALES_ORDER_JC_MASTER_LIST_RESET } from './../../../constants/sales/salesOrderConstants';

//Table component
import BackOrdersByJCTable from './../../../components/tables/sales/BackOrdersByJCTable';

const BackOrdersByJCReportScreen = ({ location, history, match }) => {
   const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { error } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

   const backOrdersByJC = useSelector((state) => state.backOrdersByJC)
	const { loading, salesOrders, totalBackOrderValue } = backOrdersByJC;

   const jcmasterDataForSalesOrder = useSelector((state) => state.jcmasterDataForSalesOrder)

   const [ jcId, setJCId ] = useState("");

   //JC Master Dropdown
   const [ selectedJCNo, setSelectedJCNo ] = useState([{}]);
   const [ selectedJCDescription, setSelectedJCDescription ] = useState([{}]);

	//const { jcMasters } = jcmasterDataForSalesOrder;

   // 3. Set Master Data on The Screen

   let jcMasters = [];
   let options = [];

   //let jcId = "";

   useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
         dispatch(getAllJCMasterDataForSalesOrder())
         dispatch(getBackOrdersByJC(jcId))
         dispatch({ type: SALES_ORDER_JC_MASTER_LIST_RESET })
		}
	}, [jcId, dispatch, history, userInfo])

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
      //logger("--- search criteria slected and id is ===== ", jcId)
      dispatch(getBackOrdersByJC(jcId))
   }

   const handleReset = (e) => {
      // setJCId("");
      // dispatch(getAllJCMasterDataForSalesOrder())
      // dispatch(getBackOrdersByJC(jcId))
      // dispatch({ type: SALES_ORDER_JC_MASTER_LIST_RESET })
      window.location.reload();
   }

   return (
      <React.Fragment>
         <br></br>
         <div style={{border:"0px solid black", borderRadius:"5px", background:"white"}}>
         <br></br>
         <Row className='align-items-center mx-1'>
            <Col lg={6} md={12} xs={12}>
               <h4 ><i className="fas fa-list"></i> Back Order Report by JC#</h4>
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
               <Col lg={4} md={12} xs={12}>
                  <Form.Group controlId='jcNo'>
                  <Form.Label>Select JC #<span className="mandatory"></span></Form.Label>
                  <Select 
                     name="jcNo"
                     options = {jcMasters!==undefined?(jcMasters.map(jc => {
                        return { value: jc._id, label: jc.jcno }
                     })):null} 
                     onChange={e => handleJC(e)}
                     value={selectedJCNo}
                  />
                  </Form.Group>
               </Col>
               <Col lg={6} md={12} xs={12}>
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
            </Row>
            <Row>
               <Col style={{textAlign:"end"}}>
                  <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                  <Button type='submit' className=' my-3 mx-2 btn-md button-class' ><i className="fas fa-save"></i> Search</Button>
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
                  <BackOrdersByJCTable data={salesOrders} />
               )}
               
            </>
         )}
         </div>
      </React.Fragment>
   )
}

export default BackOrdersByJCReportScreen
