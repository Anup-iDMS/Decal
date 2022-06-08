//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { format } from 'date-fns'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NotificationManager } from 'react-notifications';

//import User Redux "action(s)"
import { createMenuItem, getAllMasterDataForMenu } from '../../actions/masters/userActions';

//import Redux "constantc(s)"
import { MENU_CREATE_RESET } from '../../constants/masters/userConstants';

import { 
   APPLICATION_NOTIFICATION_TIME_OUT 
} from '../../constants/application/application';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import Breadcrumb from '../../components/app/Breadcrumb';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';

const MenuCreateScreen = ({ history, location }) => {
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   //2. Get the master data required for User generation
   
   const menuItemCreate = useSelector((state) => state.menuItemCreate)

   const { success, user, error: errorCreate } = menuItemCreate

   const masterDataForMenu = useSelector((state) => state.masterDataForMenu)

   const { loading: loadingMasterData } = masterDataForMenu;
   
   let roles = [];
   let options = [];

   if(masterDataForMenu !== undefined) {
      roles = masterDataForMenu.roles
      
      if(roles !== undefined) {
         roles.map(role => {
            let dropDownEle = { label: role.role, value: role._id };
            return options.push(dropDownEle);
         });
      }
   }

   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
      } else {
         dispatch(getAllMasterDataForMenu())
      }
		if (success) {
         history.push('/menulist')
		   dispatch({ type: MENU_CREATE_RESET })
         NotificationManager.success(`Record has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         dispatch({ type: MENU_CREATE_RESET })
         NotificationManager.error(`Error in creating the record !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      }

		// eslint-disable-next-line
	}, [ history, success ])

   return (
      <div>
         Menu create Screen....
      </div>
   )
}

export default MenuCreateScreen
