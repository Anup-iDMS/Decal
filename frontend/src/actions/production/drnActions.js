import axios from 'axios'
import { logger } from './../../util/ConsoleHelper';

import { 
	DRN_CREATE_REQUEST,
	DRN_CREATE_SUCCESS,
	// DRN_CREATE_FAIL,
	// DRN_CREATE_RESET,

	DRN_DETAILS_REQUEST,
	DRN_DETAILS_SUCCESS,
	DRN_DETAILS_FAIL,
	// DRN_DETAILS_RESET,

	DRN_UPDATE_REQUEST,
	DRN_UPDATE_SUCCESS,
	DRN_UPDATE_FAIL,
	// DRN_UPDATE_RESET,

	DRN_DELETE_REQUEST,
	DRN_DELETE_SUCCESS,
	DRN_DELETE_FAIL,
	// DRN_DELETE_RESET,

	DRN_LIST_REQUEST,
	DRN_LIST_SUCCESS,
	DRN_LIST_FAIL,
	// DRN_LIST_RESET,

  DRN_MASTER_LIST_REQUEST,
  DRN_MASTER_LIST_SUCCESS,
  DRN_MASTER_LIST_FAIL,
  // DRN_MASTER_LIST_RESET,

  BACK_ORDER_LIST_REQUEST,
  BACK_ORDER_LIST_SUCCESS,
  BACK_ORDER_LIST_FAIL,
  // BACK_ORDER_LIST_RESET,

  SO_DETAILS_LIST_REQUEST,
  SO_DETAILS_LIST_SUCCESS,
  SO_DETAILS_LIST_FAIL,
  // SO_DETAILS_LIST_RESET,

  BACK_ORDER_BY_JC_LIST_REQUEST,
  BACK_ORDER_BY_JC_LIST_SUCCESS,
  BACK_ORDER_BY_JC_LIST_FAIL,
  BACK_ORDER_BY_JC_LIST_RESET,

  DRN_JC_MASTER_LIST_REQUEST,
  DRN_JC_MASTER_LIST_SUCCESS,
  DRN_JC_MASTER_LIST_FAIL,
  DRN_JC_MASTER_LIST_RESET,
  
  DRN_OPEN_LIST_REQUEST, 
  DRN_OPEN_LIST_SUCCESS,
  DRN_OPEN_LIST_FAIL,
  DRN_OPEN_LIST_RESET,

  DRN_APPROVED_LIST_REQUEST,
  DRN_APPROVED_LIST_SUCCESS,
  DRN_APPROVED_LIST_FAIL,

  DRN_REJECTED_LIST_REQUEST,
  DRN_REJECTED_LIST_SUCCESS,
  DRN_REJECTED_LIST_FAIL

} from '../../constants/production/drnConstants';
import { logout } from '../masters/userActions';

//1. create a DRN record action
export const createDRN = (drn) => async(dispatch, getState) => {
   //console .log("1. INside create DRN of action ----", drn)
   try {
     dispatch({
       type: DRN_CREATE_REQUEST,
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
     //console .log("2. INside create DRN action Before inserting data  ----")
     const { data } = await axios.post('/api/drn', drn, config)
     //console .log("3. Inside create DRN action and data inserted is ==== ", data)
     dispatch({
       type: DRN_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create DRN Acion AFTER DISPATCH data  ----")
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       //dispatch(logout())
     }
   }
}

//2. get a single record action
export const getDRNDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get DRN details +++++")
     dispatch({ type: DRN_DETAILS_REQUEST })
     ////logger("2. ()()() inside drn Details BEFORE GETTING drn details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     ////logger("3. ()()() inside DRN Details BEFORE GETTING DRN details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listDRNDetails BEFORE GETTING DRN details ********* ")
     const { data } = await axios.get(`/api/drn/${id}`, config)
     //logger("***** inside listDRNDetails and details are ********* ",data)
     dispatch({
       type: DRN_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: DRN_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateDRN = (drn) => async (dispatch, getState) => {
   try {
     dispatch({
       type: DRN_UPDATE_REQUEST,
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
       `/api/drn/${drn._id}`,
       drn,
       config
     )
 
     dispatch({
       type: DRN_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: DRN_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: DRN_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteDRN = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: DRN_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/drn/${id}`, config)
 
     dispatch({
       type: DRN_DELETE_SUCCESS,
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
       type: DRN_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all module records
export const listAllDRNs = (pageNumber = '') => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: DRN_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     console .log("!!!!!>>>> Inside SO Action DRN  list aaahe ==== ")
     const { data } = await axios.get(`/api/drn/all?pageNumber=${pageNumber}`, config)
     console .log("!!!!!>>>> Inside SO Action DRN list aaahe ==== ", data)
     dispatch({
       type: DRN_LIST_SUCCESS,
       payload: data,
     })
   } catch (error) {
     logger("Inside eror ----------- ", error.response.data)
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: DRN_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for DRN Screens
export const getAllMasterDataForDRN = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DRN_MASTER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //logger("2. Here inside Action to get master data for JC .............")
    const { data } = await axios.get(`/api/drn/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside DRN.............", data)
    dispatch({
      type: DRN_MASTER_LIST_SUCCESS,
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
      type: DRN_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

/** Below are the functions for DRN Approval */
//5. get all module records
export const listAllOpenDRNs = (pageNumber = '') => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: DRN_OPEN_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/drn/open?pageNumber=${pageNumber}`, config)
     dispatch({
       type: DRN_OPEN_LIST_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Inside eror ----------- ", error.response.data)
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: DRN_OPEN_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all "APPROVED" DRN records
export const listAllApprovedDRNs = (pageNumber = '') => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: DRN_APPROVED_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/drn/approved?pageNumber=${pageNumber}`, config)
     dispatch({
       type: DRN_APPROVED_LIST_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Inside eror ----------- ", error.response.data)
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: DRN_APPROVED_LIST_FAIL,
       payload: message,
     })
   }
}

//7. get all "REJECTED" DRN records
export const listAllRejectedDRNs = (startDate, endDate) => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: DRN_REJECTED_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/drn/rejected/?startDate=${startDate}&endDate=${endDate}`, config)
     dispatch({
       type: DRN_REJECTED_LIST_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Inside eror ----------- ", error.response.data)
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: DRN_REJECTED_LIST_FAIL,
       payload: message,
     })
   }
}