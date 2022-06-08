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
import Goback from './../../components/app/Goback';


const AppConfigurationScreen = ({ history, match }) => {
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

  
   let menus = [
      {
         "subMenuName": "Manage Product Category", 
         "subMenuLink":"/productcategorylist", 
         "subMenuStyleClass": "fab fa-product-hunt icon-color fa-3x"
      },
      {
         "subMenuName": "Manage Product Code", 
         "subMenuLink":"/productcodelist", 
         "subMenuStyleClass": "fab fa-creative-commons icon-color fa-3x"
      },
      {
         "subMenuName": "Manage Service Code", 
         "subMenuLink":"/servicecodelist", 
         "subMenuStyleClass": "fas fa-strikethrough icon-color fa-3x"
      },
      {
         "subMenuName": "Manage UOM", 
         "subMenuLink":"/uomlist", 
         "subMenuStyleClass": "fas fa-tasks icon-color fa-3x"
      },
      {
         "subMenuName": "Manage Auto Increment", 
         "subMenuLink":"/autoincrementlist", 
         "subMenuStyleClass": "fas fa-plus-circle icon-color fa-3x"
      },
      {
         "subMenuName": "Manage Application Parameters", 
         "subMenuLink":"/parameterslist", 
         "subMenuStyleClass": "fas fa-clipboard-list icon-color fa-3x"
      }
   ]

   return (
      <React.Fragment>
         <Goback history = {history} />
         <Row className="screenContainer" style={{height:"100%"}}>
            <Col className="loginContainer">
               <Row>
                  <Col lg={12} md={12} xs={12}>
                     <h5 className="dash-title my-2 mx-2">You Are ON Application Configuration Screen MENU</h5>
                  </Col>
               </Row>
               <br></br>
                  <React.Fragment>
                     <Row key={1} style={{marginBottom:"20px"}}>
                        {menus.map((submenu, index) => 
                        <Col xl={4} lg={4} md={12} xs={12} style={{textAlign:"center"}}>
                              <div style={{color:"#0645AD", marginTop:"10px"}}>
                                 <Link to={submenu.subMenuLink} style={{color:"#0000FF"}}>
                                    <div style={{marginBottom:"10px"}}>
                                       <i className={submenu.subMenuStyleClass}  style={{ color: "red" }}></i>
                                    </div>
                                    {submenu.subMenuName}
                                 </Link>
                              </div>
                              <br />
                           </Col>
                        )}
                     
                     </Row>
                  </React.Fragment>
            </Col>
         </Row>
      </React.Fragment>
   )
}

export default AppConfigurationScreen
