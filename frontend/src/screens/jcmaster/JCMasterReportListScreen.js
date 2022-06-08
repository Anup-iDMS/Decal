//import standard React Components
import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Form } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'

//import Redux "action(s)" 
import { 
   getJCMastersReport, 
} from '../../actions/masters/jcMasterActions'

import JCMasterReportTable from '../../components/tables/masters/JCMasterReportTable'
import TableContainer from './../../components/app/TableContainer';
import { JC_MASTER_REPORT_RESET } from '../../constants/masters/jcMasterConstants'
import { getAllMasterDataForSalesOrder } from './../../actions/sales/salesOrderActions';


const JCMasterReportListScreen = ({ history, match }) => {
   const pageNumber = match.params.pageNumber || 1
	
	const dispatch = useDispatch()
	
	const userDetails = useSelector((state) => state.userDetails)
	const { user } = userDetails
	
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin
	
	const jcl = useSelector((state) => state.jcMastersReport)
	const { loading, error: errorLoad, jcMasters } = jcl;

	//const jcmasterDataForSalesOrder = useSelector((state) => state.jcmasterDataForSalesOrder)

	
   const masterDataForSalesOrder = useSelector((state) => state.masterDataForSalesOrder)

   const { loading: loadingMasterData } = masterDataForSalesOrder;

   const [ jcId, setJCId ] = useState("");
	const [ customerId, setCustomerId ] = useState("");
	//JC Master Dropdown
   const [ selectedJCNo, setSelectedJCNo ] = useState([{}]);
   const [ selectedJCDescription, setSelectedJCDescription ] = useState([{}]);

   let customers = [];
   let options = [];

	useEffect(() => {
		if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			//console .log("1. Inside JC MS Screen useEffect ==== ", pageNumber)
			dispatch(getJCMastersReport())
			dispatch(getAllMasterDataForSalesOrder())
			//dispatch({ type: JC_MASTER_REPORT_RESET })
		  }
		}
	}, [dispatch, history])

	   
	// if(jcMasters !== undefined) {
	// 	jcMasters.map(jc => {
	// 		let dropDownEle = { label: jc.jcDescription, value: jc._id };
	// 		return options.push(dropDownEle);
	// 	});
	// }

	if(masterDataForSalesOrder !== undefined) {
      customers = masterDataForSalesOrder.customers
      if(customers !== undefined) {
         customers.map(customer => {
            let dropDownEle = { label: customer.custName, value: customer._id };
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
		e.currentTarget.blur()
		console.log("customerId ==== ", customerId)
		console.log("jcId ==== ", jcId)
		//return;
      e.preventDefault();
      dispatch(getJCMastersReport(customerId, jcId))
   }

   const handleReset = (e) => {
		e.currentTarget.blur()
      window.location.reload();
   }

	const handleCustomerName = (e) => {
		console.log(">>>> handleCustomerName ==== ", e.value)
		if(e.value.trim() === "") {
         setCustomerId("")
      } else {
         setCustomerId(e.value);
		}
	}

   return (
      <React.Fragment>
			<Form onSubmit={submitHandler}>
				{/*<Row className="mx-2">
					<Col lg={4} md={12} xs={12}>
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
				</Row>*/}
				<Row>
					<Col lg={6} md={12} xs={12}>
						<Form.Group controlId='customer'>
							<Form.Label>Select Customer<span className="mandatory"></span></Form.Label>
							<Select
								style={{background:"#e84347", color:"white"}} 
								options={options}
								onChange={(e) => handleCustomerName(e)}
							/>
						</Form.Group>
					</Col>
					<Col  lg={6} md={12} xs={12} style={{textAlign:"end"}}>
						<Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={(e)=>handleReset(e)}><i className="fas fa-undo"></i> Reset</Button>
						<Button type='button' className='button-class mx-2 my-3 btn-md' onClick={(e)=>submitHandler(e)}><i className="fas fa-save"></i> Search</Button>
					</Col>
				</Row>
			</Form>
			<br></br>
			<TableContainer
				title = "Job Master Report"
				listPage = "#"
				actionName = "Add JC Master"
				data = {jcMasters}
				TableName = {JCMasterReportTable}
				loading = {loading}
				error = {errorLoad}
				showActionButton = {false}
			/>
		</React.Fragment>
   )
}

export default JCMasterReportListScreen
