import axios from 'axios'
import { logout } from './../masters/userActions'
import { logger } from './../../util/ConsoleHelper';

import { 
	MACHINE_MASTER_CREATE_REQUEST,
	MACHINE_MASTER_CREATE_SUCCESS,
	MACHINE_MASTER_CREATE_FAIL,
	// MACHINE_MASTER_CREATE_RESET,

	MACHINE_MASTER_DETAILS_REQUEST,
	MACHINE_MASTER_DETAILS_SUCCESS,
	MACHINE_MASTER_DETAILS_FAIL,
	// MACHINE_MASTER_DETAILS_RESET,

	MACHINE_MASTER_UPDATE_REQUEST,
	MACHINE_MASTER_UPDATE_SUCCESS,
	MACHINE_MASTER_UPDATE_FAIL,
	// MACHINE_MASTER_UPDATE_RESET,

	MACHINE_MASTER_DELETE_REQUEST,
	MACHINE_MASTER_DELETE_SUCCESS,
	MACHINE_MASTER_DELETE_FAIL,
	// MACHINE_MASTER_DELETE_RESET,

	MACHINE_MASTER_LIST_REQUEST,
	MACHINE_MASTER_LIST_SUCCESS,
	MACHINE_MASTER_LIST_FAIL,
	// MACHINE_MASTER_LIST_RESET,

} from './../../constants/masters/machineConstants';

//1. create a MachineMaster record action
export const createMachineMaster = (machineMaster) => async(dispatch, getState) => {
   //console .log("1. INside create MachineMaster of action ----", machineMaster)
   try {
     dispatch({
       type: MACHINE_MASTER_CREATE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState();
 
     const config = {
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
     //console .log("2. INside create MachineMaster action Before inserting data  ----")
     const { data } = await axios.post('/api/appdata/machineMaster', machineMaster, config)
     //console .log("3. Inside create MachineMaster action and data inserted is ==== ", data)
     dispatch({
       type: MACHINE_MASTER_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create MachineMaster Acion AFTER DISPATCH data  ----")
   } catch (error) {
    console .log("3. Inside MACHINE MASTER Action and Error Ocureed   ----")
    const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
      
    console .log("3. Inside MACHINE MASTER and Error Message is   ---- ", message)
    dispatch({
      type: MACHINE_MASTER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })  
  }
}

//2. get a single record action
export const getMachineMasterDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get MachineMaster details +++++")
     dispatch({ type: MACHINE_MASTER_DETAILS_REQUEST })
     //logger("2. ()()() inside machineMaster Details BEFORE GETTING machineMaster details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside MachineMaster Details BEFORE GETTING MachineMaster details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listMachineMasterDetails BEFORE GETTING MachineMaster details ********* ")
     const { data } = await axios.get(`/api/appdata/machineMaster/${id}`, config)
     //logger("***** inside listMachineMasterDetails and details are ********* ",data)
     dispatch({
       type: MACHINE_MASTER_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: MACHINE_MASTER_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateMachineMaster = (machineMaster) => async (dispatch, getState) => {
   try {
     dispatch({
       type: MACHINE_MASTER_UPDATE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.put(
       `/api/appdata/machineMaster/${machineMaster._id}`,
       machineMaster,
       config
     )
 
     dispatch({
       type: MACHINE_MASTER_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: MACHINE_MASTER_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: MACHINE_MASTER_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteMachineMaster = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: MACHINE_MASTER_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/appdata/machineMaster/${id}`, config)
 
     dispatch({
       type: MACHINE_MASTER_DELETE_SUCCESS,
     })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: MACHINE_MASTER_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all machineMaster records
export const listAllMachineMasters = (pageNumber = '') => async (dispatch, getState) => {
   try {
     dispatch({
       type: MACHINE_MASTER_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/appdata/machineMaster`, config)

     dispatch({
       type: MACHINE_MASTER_LIST_SUCCESS,
       payload: data,
     })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: MACHINE_MASTER_LIST_FAIL,
       payload: message,
     })
   }
}

