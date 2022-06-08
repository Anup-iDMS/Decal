//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// React Notification
import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';
import { getMenuItemDetails, updateMenuItem } from '../../actions/masters/userActions';
import { MENU_UPDATE_RESET } from './../../constants/masters/userConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';

const MenuEditScreen = ({ history, match }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const menuItemId = match.params.id;
  // console.log("Menu Item ID ===================== ", menuItemId)
   const menuItemDetails = useSelector((state) => state.menuItemDetails)
	//console.log("Menu Item Details from Store ===================== ")
	const { loading, error, menuItem } = menuItemDetails;
  // console.log(menuItem)
   
   //post updated Menu Item record
    const menuItemUpdate = useSelector((state) => state.menuItemUpdate);
    const { success: successUpdate, error: errorUpdate } = menuItemUpdate

   // 2. Define All Form Variables and their state
   const [ name, setName ] = useState("");
   const [ link, setLink ] = useState("");
   const [ styleclass, setStyleclass ] = useState("");
   const [ hasSubMenu, setHasSubMenu ] = useState(false);
   //const [ subMenuItems, subMenuItems ] = useState("");
   const [subMenuItems, setSubMenuItems] = useState([
      { 
         id: uuidv4(), 
         subMenuName: '', 
         subMenuLink: '',
         subMenuStyleClass: 'fas fa-listt icon-color' 
      },
   ]);

   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});

   useEffect(() => {
      
      if (menuItem._id !== menuItemId) {
         console .log("2. Inside useEffect Before Getting MenuItem ==== ")
         //console.log(menuItem)
         dispatch(getMenuItemDetails(menuItemId))
      } else {
         setFormData();
      }
      if(successUpdate) {
         history.push('/menulist');
         dispatch({ type: MENU_UPDATE_RESET })
         NotificationManager.success(`Menu Item # ${menuItem.name} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
      if(errorUpdate) {
         NotificationManager.error(`Error in updating Menu Item # ${menuItem.name} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }
   }, [menuItemId, menuItem, successUpdate]);

   const setFormData = () => {
      setName(menuItem.name);
      setLink(menuItem.link);
      setStyleclass(menuItem.styleclass);
      setHasSubMenu(menuItem.hasSubMenu);
      //setSubMenuItems(menuItem.);
      let newMenuItemDetails = [...menuItem.subMenuItems]
      let newMenuItemDetails1 = newMenuItemDetails.map(mi => {
         mi.id = uuidv4(); 
         mi.subMenuName = mi.subMenuName; 
         mi.subMenuLink = mi.subMenuLink;
         mi.subMenuStyleClass = mi.subMenuStyleClass;
         return mi;
      })
      //console.log("--------> before setting newMenuItemDetails1 <----------- ", newMenuItemDetails1)
      setSubMenuItems(newMenuItemDetails1);
   }

   // 5. Reset and Submit Form functions
   // 5.1 Reset The FORM
   const handleReset = () => {
      window.location.reload();
   }

   // 5.2 Submit The Form
   const submitHandler = (e) => {
      e.preventDefault();
   }

   const handleChangeInput = (id, event) => {
      console.log("handle Change Event subMenuItems ============ ", subMenuItems)
      console.log("Event Name ============ ", event.target.name)
      console.log("Event VALUE ============ ", event.target.value)
      const newInputFields = subMenuItems.map(i => {
         if(id === i.id) {
            console.log("When both IDs are matching ============ ", id)
            if(event.target.name === "subMenuName") {
               i.subMenuName = event.target.value
               //i.subMenuLink = i.subMenuLink 
               //i.subMenuStyleClass = i.subMenuStyleClass 
            }
            if(event.target.name === "subMenuLink") {
               i.subMenuLink = event.target.value
            }
            if(event.target.name === "subMenuStyleClass") {
               i.subMenuStyleClass = event.target.value
               //i.subMenuName =  i.subMenuName
               //i.subMenuStyleClass =  i.subMenuStyleClass
            }
            return i;
         } else {
            console.log("_________________ ELSE ______________")
            return i;
         }
      })
      console.log("Before setting new Data ============ ", newInputFields)
      setSubMenuItems(newInputFields);
   }

   const handleRemoveFields = id => {
      const values  = [...subMenuItems];
      values.splice(values.findIndex(value => value.id === id), 1);
      setSubMenuItems(values);
   }

   /** styling start */
   let tableStyle = {
      border: "1px solid black",
      width: "100%",
      height: "100%",
      fontFamily:"Arial"
   }
   /** styling end */

   return (
      <FormContainer>
         <Breadcrumb
            listPage = "menulist"
         />
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col>
                     <h3>Menu Item Details Edit</h3>
                  </Col>
               </Row>
               <br></br>
               <div style={{border:"1px solid black", borderRadius:"5px", background:"white"}}>
                  <h6 className="px-2 py-2" style={{background:"#e84347", color:"white"}}>Please Edit Menu Item Details !!!</h6>
                  <br></br>
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='name'>
                                 <Form.Label>Menu Name<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='name'
                                    readOnly
                                    value={name}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Group controlId='link'>
                                 <Form.Label>Menu Link<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='link'
                                    readOnly
                                    value={link}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={5} md={12} xs={12}>
                              <Form.Group controlId='styleclass'>
                                 <Form.Label>Menu Name<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='styleclass'
                                    value={styleclass}
                                    onChange={(e) => setStyleclass(e.target.value)}                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={2} md={12} xs={12}>
                              <Form.Group controlId='hasSubMenu'>
                                 <Form.Label>Has Sub Menu<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='hasSubMenu'
                                    readOnly
                                    value={hasSubMenu?"Yes":"No"}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        <br></br>
                        {hasSubMenu?(
                           <React.Fragment>
                              <Row>
                                 <Col><h5>Sub Menu Details</h5></Col>
                              </Row>
                              <Row>
                                 <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                    <table style={{ ...tableStyle, width:"100%" }}>
                                       <thead>
                                          <tr>
                                             <th className="col-1" style={{ ...tableStyle, color:"black" }}>#</th>
                                             <th className="col-2" style={{ ...tableStyle, color:"black" }}>Sub Menu Name</th>
                                             <th className="col-2" style={{ ...tableStyle, color:"black" }}>Sub Menu Link</th>
                                             <th className="col-1" style={{ ...tableStyle, color:"black" }}>Delete</th>
                                          </tr>
                                       </thead>
                                    </table>
                                 </Col>
                              </Row>
                           </React.Fragment>
                        ):null}
                        { subMenuItems.map((inputField, index) => (
                           <React.Fragment>
                              <Row key={index}>
                                 <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                                    <table style={{ ...tableStyle, width:"100%", marginTop:index===0?"0px":"0px" }}>
                                       <tbody>
                                          <tr>
                                             <td style={tableStyle} className="col-1">
                                                {<Form.Label style={{marginTop:"10px"}}><b>{index+1}</b></Form.Label>}
                                             </td>
                                             <td style={tableStyle} className="col-2">
                                                <Form.Group controlId='subMenuName'>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={inputField.subMenuName !==undefined? inputField.subMenuName:""}
                                                      name="subMenuName"
                                                      onChange={event => handleChangeInput(inputField.id, event)}
                                                   ></Form.Control>
                                                   <p className="validation-error">{errors.subMenuName}</p>
                                                </Form.Group>
                                             </td>
                                             <td style={tableStyle} className="col-2">
                                                <Form.Group controlId='subMenuLink'>
                                                   <Form.Control
                                                      type='text'
                                                      placeholder=''
                                                      value={inputField.subMenuLink !==undefined? inputField.subMenuLink:""}
                                                      name="subMenuLink"
                                                      readOnly
                                                      onChange={event => handleChangeInput(inputField.id, event)}
                                                   ></Form.Control>
                                                   <p className="validation-error">{errors.subMenuLink}</p>
                                                </Form.Group>
                                             </td>
                                             <td style={tableStyle} className="col-1">
                                                <Button
                                                   variant="danger" 
                                                   className="btn-md"
                                                   style={{marginTop:"10px"}}
                                                   disabled={subMenuItems.length === 1} 
                                                   onClick={() => handleRemoveFields(inputField.id)}
                                                >X
                                                </Button>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </Col>
                              </Row>
                           </React.Fragment>
                         )) }
                         {/* START of 7th row in the form */}
                         <Row>
                         <Col style={{textAlign:"end"}}>
                            <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                            <Button type='submit' className=' my-3 btn-md button-class'><i className="fas fa-save"></i> Save</Button>
                         </Col>
                      </Row>
                     </Col>
                  </Form>
               </div>
            </React.Fragment>
            )}
         </FormContainer>
   )
}

export default MenuEditScreen
