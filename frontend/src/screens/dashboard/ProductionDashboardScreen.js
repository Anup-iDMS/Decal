import React, { useState, useEffect }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashCards from '../../components/app/DashCards';
import Loader from '../../components/app/Loader';
import WelcomeModal from '../../components/modals/WelcomeModal';
import { getProductionDashboardChartData } from './../../actions/dashboard/dashboardActions';
import Message from './../../components/app/Message';
import { Form, Button, Row, Col } from 'react-bootstrap'
import GenericChart from '../../components/charts/GenericChart';
import {Bar, Line, Pie } from 'react-chartjs-2';

const ProductionDashboardScreen = ({ location, history, match }) => {
  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const dashboardProductionData = useSelector((state) => state.dashboardProductionData)
	const { 
    loading, 
    fgmiInventoryData,
    error 
  } = dashboardProductionData;

  useEffect(() => {
    if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			  dispatch(getProductionDashboardChartData())
          
         }
		}
  }, [dispatch, history, userInfo, user])
  
  window.scrollTo(0, 0); 

   return(
      <React.Fragment>
      <h2 className="dash-title">Dashboard</h2>
      { loading ? (
        <Loader />
      ):( error? (
        <Message variant='danger'>{ error }</Message>
      ): (
        <React.Fragment>
          <br></br>
          <Row>
            <Col lg={8}>
               <h5>Finished Goods Material Inventory</h5>
               <GenericChart
                  chartTitle = {["Finished Goods Material Inventory"]}
                  TypeOfChart = {Bar}
                  showlegends = {true}
                  monthlySalesData={fgmiInventoryData}
                  chartLables = {fgmiInventoryData!==undefined?fgmiInventoryData['JC']:[]}
                  chartData = {fgmiInventoryData!==undefined?fgmiInventoryData['Qty']:[]}
               />
            </Col>
            {/*<Col lg={6}>
               <h4>Top 5 Ordered JCs</h4>
               <MonthlySalesChart
                  chartTitle = {["Top 5 Ordered JCs"]}
                  TypeOfChart = {Pie}
                  showlegends = {true}
                  monthlySalesData={fgmiInventoryData}
                  chartLables = {fgmiInventoryData!==undefined?fgmiInventoryData['JC']:[]}
                  chartData = {fgmiInventoryData!==undefined?fgmiInventoryData['Sales']:[]}
               />
            </Col>*/}
          </Row>
        </React.Fragment>
      ))}
    </React.Fragment>
   )
}

export default ProductionDashboardScreen
