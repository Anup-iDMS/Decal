import React, { useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { useSelector } from 'react-redux'
//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from './../../components/app/Breadcrumb';
import { Link } from 'react-router-dom';

const UtilitySettingsScreen = () => {
   
   const userDetails = useSelector((state) => state.userDetails)

   const userLogin = useSelector((state) => state.userLogin)
   //flag to show/hide "Welcome" message   
   const userSetWelcomeNotification = localStorage.getItem('showWelcomeMessage')
   const [ showWelcomeMessage, setShowWelcomeMessage ] = useState(userSetWelcomeNotification !== null ? userSetWelcomeNotification === "false"? false:true: true);
   //flag to hide/show DRN creation help
   const showDRNCreationModalNotification = localStorage.getItem('showDRNCreationModal')
   const [ showDRNCreationModal, setShowDRNCreationModal ] = useState(showDRNCreationModalNotification !== null ? showDRNCreationModalNotification === "false"? false:true: true);

   const showOldMenuStyleNotification = localStorage.getItem('menustyle')
   const [ showOldMenuStyle, setShowOldMenuStyle ] = useState(showOldMenuStyleNotification !== null ? showOldMenuStyleNotification === "old"? false:true: true);

   const handleWelcomeSwitch = () => {
      setShowWelcomeMessage(!showWelcomeMessage)
      localStorage.setItem('showWelcomeMessage', !showWelcomeMessage)
   }

   const handleDRNCreationSwitch = () => {
      setShowDRNCreationModal(!showDRNCreationModal)
      localStorage.setItem('showDRNCreationModal', !showDRNCreationModal)
   }

   const handleMenuStyle = () => {
      setShowOldMenuStyle(!showOldMenuStyle)
      if(showOldMenuStyle) {
         localStorage.setItem('menustyle', "old")
      } else {
         localStorage.setItem('menustyle', "new")
      }
      
   }
   
   return (
      <FormContainer>
         <Row className='align-items-center'>
            <Col lg={12}>
               <h4>User Notifications Settings</h4>
            </Col>
         </Row>
         <br></br>
         <Row className='align-items-center'>
            <Col lg={4}>
            <h6 className="my-3" style={{ color: "rgba(87, 84, 84)"}}><i className="fas fa-bell"></i>  Show Welcome Message</h6>
            </Col>
            <Col lg={2}>
               <BootstrapSwitchButton 
                  checked={showWelcomeMessage} 
                  onstyle="outline-success" 
                  offstyle="outline-danger"
                  width={90}
                  onChange={handleWelcomeSwitch}
               />
            </Col>
         </Row>
         <br />
         <Row className='align-items-center'>
            <Col lg={4}>
            <h6 className="my-3" style={{ color: "rgba(87, 84, 84)"}}><i className="fas fa-bell"></i>  Show DRN Creation Help Message</h6>
            </Col>
            <Col lg={2}>
               <BootstrapSwitchButton 
                  checked={showDRNCreationModal} 
                  onstyle="outline-success" 
                  offstyle="outline-danger"
                  width={90}
                  onChange={handleDRNCreationSwitch}
               />
            </Col>
         </Row>
         <br />
         <Row className='align-items-center'>
            <Col lg={4}>
            <h6 className="my-3" style={{ color: "rgba(87, 84, 84)"}}><i className="fas fa-bars"></i>  Hide Old Menu Style</h6>
            </Col>
            <Col lg={2}>
               <BootstrapSwitchButton 
                  checked={showOldMenuStyle} 
                  onstyle="outline-success" 
                  offstyle="outline-danger"
                  width={90}
                  onChange={handleMenuStyle}
               />
            </Col>
         </Row>
      </FormContainer>
   )
}

export default UtilitySettingsScreen
