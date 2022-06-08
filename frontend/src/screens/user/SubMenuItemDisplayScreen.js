//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
// import Select from 'react-select'
import { format } from 'date-fns'
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// React Notification
import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from '../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from '../../components/app/Breadcrumb';

//import User Redux "action(s)"
import { listAllSubMenuItems } from '../../actions/masters/userActions';

//import Redux "constantc(s)"
import { SUBMENU_LIST_RESET } from '../../constants/masters/userConstants';

const SubMenuItemDisplayScreen = ({ history, match }) => {
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const menuItemId = match.params.id;

   //console.log("Menu Item ID ===================== ", menuItemId)
   const allSubMenuItemList = useSelector((state) => state.allSubMenuItemList)
	const { loading, error, menuItems } = allSubMenuItemList;
  
   let submenus = [];
   if(allSubMenuItemList !== undefined) {
      if(menuItems !== undefined) {
         if(menuItems[0] !== undefined) {
            submenus = menuItems[0].subMenuItems.reduce(function (rows, key, index) { 
               return (index % 4 == 0 ? rows.push([key]) 
                 : rows[rows.length-1].push(key)) && rows;
             }, []);
         }

      }
   }
   

   useEffect(() => {
   
      console .log("2. Inside useEffect Before Getting MenuItem ==== ")
      dispatch(listAllSubMenuItems(menuItemId))
      
   }, [menuItemId]);
	
   return (
      <React.Fragment>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row className="screenContainer" style={{height:"100%"}}>
                  <Col className="loginContainer">
                     <Row>
                        <Col lg={12} md={12} xs={12}>
                           <h5 className="dash-title my-2 mx-2">You Are ON "{menuItems[0] !== undefined?menuItems[0].name: ""}" MENU</h5>
                        </Col>
                     </Row>
                     <br></br>
                     {submenus.map((menu, index) => 
                        <React.Fragment>
                           <Row key={menu._id} style={{marginBottom:"20px"}}>
                              {menu.map((submenu, index1) => 
                                 <Col xl={3} lg={4} md={12} xs={12} style={{textAlign:"center"}}>
                                    <div style={{color:"#0645AD", marginTop:"10px"}}>
                                       <Link to={submenu.subMenuLink} style={{color:"#0000FF"}}>
                                          <div style={{marginBottom:"10px"}}>
                                             <i className={submenu.subMenuStyleClass}  style={{ color: "red" }}></i>
                                          </div>
                                          {submenu.subMenuName}
                                       </Link>
                                    </div>
                                 </Col>
                              )}
                           </Row>
                           <br />
                        </React.Fragment>
                     )}
                  </Col>
               </Row>
            </React.Fragment>
         )}
      </React.Fragment>
   )
}

export default SubMenuItemDisplayScreen
