import React, { useState, useEffect }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashCards from '../../components/app/DashCards';
import Loader from '../../components/app/Loader';
import WelcomeModal from '../../components/modals/WelcomeModal';
import { getDashboardData } from './../../actions/dashboard/dashboardActions';
import Message from './../../components/app/Message';
import { Form, Button, Row, Col } from 'react-bootstrap'
import GenericChart from '../../components/charts/GenericChart';
import {Bar, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { logger } from './../../util/ConsoleHelper';

const DashboardScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dashboardData = useSelector((state) => state.dashboardData)
	const { 
    loading, 
    ytdNetSale, 
    mtdNetSale, 
    mtdCreditNote, 
    ytdCreditNote,
    soValue, 
    dispatchValue, 
    soBalanceValue, 
    monthlySalesData,
    monthlySalesOrderData,
    error 
  } = dashboardData;

  useEffect(() => {
    if (!userInfo) {
		  history.push('/')
		} else {
		  if (!user || !user.name ) {
			  dispatch(getDashboardData())
        setTimeout(() => handleShow(), 2000);
        setTimeout(() => handleClose(), 8000);
      }
		}
    window.scrollTo(0, 0)
  }, [dispatch, history, userInfo, user])

  let showWelcomeFlag = localStorage.getItem('showWelcomeMessage')=== "false"? false:true;
  //console.log("1. ytdNetSale ======== ", ytdNetSale)
  //console.log("2. ytdCreditNote ======== ", ytdCreditNote)
  //console.log("3. Diff ======== ", (ytdNetSale-ytdCreditNote))

  return (
    <React.Fragment>
      { showWelcomeFlag ? <WelcomeModal onShow={show} onClose={handleClose} userInfo={userInfo} />:null}
      <Row className="screenContainer">
        <Col className="loginContainer">
          <Row>
            <Col lg={8} md={12} xs={12}>
              <h2 className="dash-title my-2 mx-2">Overview</h2>
            </Col>
            <Col className="d-none d-md-none d-lg-block" lg={4} md={12} xs={12} style={{textAlign:"end"}}>
              <Link to= '/chartdashboard'>
                <Button className='btn-md my-2'>
                  <i className="fas fa-chart-bar"></i> Chart Dashboard
                </Button>
              </Link>
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
                  headerTitle= 'YTD NET SALE (₹)' 
                  cardTitleValue= {(ytdNetSale-ytdCreditNote)}
                  showLink={true}
                  pageLink={"/taxinvoicelist"}
                  false
                />
                <DashCards 
                  headerBackgroundColor= '#e84347' 
                  headerIcon= 'fas fa-exclamation-trianglee' 
                  headerTitle= 'MTD NET SALE (₹)' 
                  cardTitleValue= {mtdNetSale}
                  false
                  false
                />
                <DashCards 
                  headerBackgroundColor= '#e84347' 
                  headerIcon= 'fas fa-exclamation-trianglee' 
                  headerTitle= 'MTD CREDIT NOTE (₹)' 
                  cardTitleValue= {mtdCreditNote}
                  showLink={true}
                  pageLink={"/creditnotelist"}
                  false
                />
                <DashCards 
                  headerBackgroundColor= 'blue' 
                  headerIcon= 'fas fa-exclamation-trianglee' 
                  headerTitle= 'SO VALUE (₹)' 
                  cardTitleValue= {soValue}
                  showLink={true}
                  pageLink={"/sodetails"}
                  false
                />
                <DashCards 
                  headerBackgroundColor= 'blue' 
                  headerIcon= 'fas fa-exclamation-trianglee' 
                  headerTitle= 'DISPATCH VALUE (₹)' 
                  cardTitleValue= {dispatchValue}
                  showLink={true}
                  pageLink={"/sodetails"}
                  false
                />
                <DashCards 
                  headerBackgroundColor= 'blue' 
                  headerIcon= 'fas fa-exclamation-trianglee' 
                  headerTitle= 'SO BAL VALUE (₹)' 
                  cardTitleValue= {soBalanceValue}
                  showLink={true}
                  pageLink={"/backorder"}
                  false
                />
              </div>
              <br></br>
              <Row className="d-none d-md-none d-lg-block">
                <Col xl={12} lg={12} md={12} xs={12}>
                  <h4>Monthly Sales Data [AMOUNT IN "LAKH"]</h4>
                  <GenericChart
                    chartTitle = {["Monthly Sales Chart"]}
                    TypeOfChart = {Bar}
                    monthlySalesData={monthlySalesData}
                    showlegends = {false}
                    chartLables = {monthlySalesData!==undefined?monthlySalesData['Months']:[]}
                    chartData = {monthlySalesData!==undefined?monthlySalesData['Sales']:[]}
                  />
                </Col>
              </Row>
              <br></br>
              <Row className="d-none d-md-none d-lg-block">
                <Col xl={12} lg={12} md={12} xs={12}>
                  <h4>Monthly Booked Orders Data [AMOUNT IN "LAKH"]</h4>
                  <GenericChart
                    chartTitle = {"Monthly Booked Ordered Chart"}
                    TypeOfChart = {Line}
                    monthlySalesData={monthlySalesOrderData}
                    showlegends = {false}
                    chartLables = {monthlySalesOrderData!==undefined?monthlySalesOrderData['Months']:[]}
                    chartData = {monthlySalesOrderData!==undefined?monthlySalesOrderData['Orders']:[]}
                  />
                </Col>
              </Row>
            </React.Fragment>
          ))}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default DashboardScreen
