import React, { useState, useEffect }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashCards from '../../components/app/DashCards';
import Loader from '../../components/app/Loader';
import WelcomeModal from '../../components/modals/WelcomeModal';
import { getQADashboardChartData } from './../../actions/dashboard/dashboardActions';
import Message from './../../components/app/Message';
import { Form, Button, Row, Col } from 'react-bootstrap'
import GenericChart from '../../components/charts/GenericChart';
import {Bar, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

const QADashboardScreen = ({ history }) => {
   const dispatch = useDispatch()

   const userDetails = useSelector((state) => state.userDetails)
   const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   
   const dashboardQAData = useSelector((state) => state.dashboardQAData)
   const { 
      loading, 
      pendingcount,
      mothlyRejectedCount,
      monthlyRejectedDRNCountData,
      error 
   } = dashboardQAData;

   useEffect(() => {
      if (!userInfo) {
          history.push('/')
      } 
      else 
      {
          if (!user || !user.name ) {
             dispatch(getQADashboardChartData())
           }
      }
   }, [dispatch, history, userInfo, user])

   return (
      <React.Fragment>
         <Row>
            <Col lg={8} md={12} xs={12}>
               <h2 className="dash-title">Overview</h2>
            </Col>
         </Row>
         <br></br>
         { loading ? (
            <Loader />
          ):( error? (
            <Message variant='danger'>{ error }</Message>
          ): (
               <React.Fragment>
                  <div className="dash-cards">
                     <DashCards 
                        headerBackgroundColor= '#e84347' 
                        headerIcon= 'fas fa-exclamation-trianglee' 
                        headerTitle= 'DRN PENDING APPROVAL COUNT' 
                        cardTitleValue= {pendingcount}
                        showLink={true}
                        pageLink={"/drnapprovallist"}
                        false
                        showDecimal = {false}
                     />
                     <DashCards 
                        headerBackgroundColor= '#e84347' 
                        headerIcon= 'fas fa-exclamation-trianglee' 
                        headerTitle= 'MTD REJECTED DRN COUNT' 
                        cardTitleValue= {mothlyRejectedCount}
                        showLink={true}
                        pageLink={"#"}
                        false
                        showDecimal = {false}
                     />
                  </div>
                  <br></br>
                  <Row>
                     <Col lg={12}>
                     <h4>Monthly Rejected DRN Count</h4>
                     <GenericChart
                        chartTitle = {["Monthly Rejected DRN Count"]}
                        TypeOfChart = {Line}
                        monthlySalesData={monthlyRejectedDRNCountData}
                        showlegends = {false}
                        chartLables = {monthlyRejectedDRNCountData!==undefined?monthlyRejectedDRNCountData['Months']:[]}
                        chartData = {monthlyRejectedDRNCountData!==undefined?monthlyRejectedDRNCountData['RejectedDRN']:[]}
                     />
                     </Col>
                  </Row>
               </React.Fragment>
            )
         )}
      </React.Fragment>
   )
}

export default QADashboardScreen
