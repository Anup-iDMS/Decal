import React, { useState, useEffect }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashCards from '../../components/app/DashCards';
import Loader from '../../components/app/Loader';
import { getDashboardChartData } from './../../actions/dashboard/dashboardActions';
import Message from './../../components/app/Message';
import { Form, Button, Row, Col } from 'react-bootstrap'
import GenericChart from './../../components/charts/GenericChart';
import {Bar, Line, Pie } from 'react-chartjs-2';
import { logger } from './../../util/ConsoleHelper';
import Goback from './../../components/app/Goback';

const ChartDashboardScreen = ({ history }) => {

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const dashboardChartData = useSelector((state) => state.dashboardChartData)
	const { 
    loading, 
    customerSalesOrderData,
    topOrderedJCData,
    error 
  } = dashboardChartData;

  logger("1.... customerSalesOrderData ", customerSalesOrderData)

  useEffect(() => {
    if (!userInfo) {
		  history.push('/login')
		} else {
		  if (!user || !user.name ) {
			  dispatch(getDashboardChartData())
          
         }
		}
    window.scrollTo(0, 0); 
  }, [dispatch, history, userInfo, user])
  
  return (
    <React.Fragment>
      <h2 className="dash-title">Chart Dashboard</h2>
      <Goback history = {history} />
      { loading ? (
        <Loader />
      ):( error? (
        <Message variant='danger'>{ error }</Message>
      ): (
        <Row className="screenContainer">
          <Col className="loginContainer">
            <React.Fragment>
              <br></br>
              <Row>
                <Col lg={12}>
                  <h4>Top 5 Customers Orders [Amount in "Lakh"]</h4>
                  <GenericChart
                    chartTitle = {["Top 5 Customers Sales Order Booking"]}
                    TypeOfChart = {Bar}
                    showlegends = {true}
                    monthlySalesData={customerSalesOrderData}
                    chartLables = {customerSalesOrderData!==undefined?customerSalesOrderData['Customers']:[]}
                    chartData = {customerSalesOrderData!==undefined?customerSalesOrderData['Sales']:[]}
                  />
                </Col>
              </Row>
              <br></br>
              <br></br>
              <Row>
                <Col lg={12}>
                  <h5>Top 5 Ordered JCs [Amount in "Lakh"]</h5>
                  <GenericChart
                      chartTitle = {["Top 5 Ordered JCs"]}
                      TypeOfChart = {Bar}
                      showlegends = {true}
                      monthlySalesData={topOrderedJCData}
                      chartLables = {topOrderedJCData!==undefined?topOrderedJCData['JC']:[]}
                      chartData = {topOrderedJCData!==undefined?topOrderedJCData['Sales']:[]}
                  />
                </Col>
                {/*<Col lg={6}>
                  <h4>Top 5 Ordered JCs</h4>
                  <GenericChart
                      chartTitle = {["Top 5 Ordered JCs"]}
                      TypeOfChart = {Pie}
                      showlegends = {true}
                      monthlySalesData={topOrderedJCData}
                      chartLables = {topOrderedJCData!==undefined?topOrderedJCData['JC']:[]}
                      chartData = {topOrderedJCData!==undefined?topOrderedJCData['Sales']:[]}
                  />
                </Col>*/}
              </Row>
              <br></br>
            </React.Fragment>
          </Col>
        </Row>
      ))}
    </React.Fragment>
  )
}

export default ChartDashboardScreen
