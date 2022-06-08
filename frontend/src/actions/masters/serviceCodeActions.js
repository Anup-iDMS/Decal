import axios from 'axios'
import { logout } from './../masters/userActions'
import { logger } from './../../util/ConsoleHelper';

import { 
	SERVICE_CODE_CREATE_REQUEST,
	SERVICE_CODE_CREATE_SUCCESS,
	SERVICE_CODE_CREATE_FAIL,
	// SERVICE_CODE_CREATE_RESET,

	SERVICE_CODE_DETAILS_REQUEST,
	SERVICE_CODE_DETAILS_SUCCESS,
	SERVICE_CODE_DETAILS_FAIL,
	// SERVICE_CODE_DETAILS_RESET,

	SERVICE_CODE_UPDATE_REQUEST,
	SERVICE_CODE_UPDATE_SUCCESS,
	SERVICE_CODE_UPDATE_FAIL,
	// SERVICE_CODE_UPDATE_RESET,

	SERVICE_CODE_DELETE_REQUEST,
	SERVICE_CODE_DELETE_SUCCESS,
	SERVICE_CODE_DELETE_FAIL,
	// SERVICE_CODE_DELETE_RESET,

	SERVICE_CODE_LIST_REQUEST,
	SERVICE_CODE_LIST_SUCCESS,
	SERVICE_CODE_LIST_FAIL,
  
  SERVICE_CODE_MASTER_DATA_REQUEST,
  SERVICE_CODE_MASTER_DATA_SUCCESS,
  SERVICE_CODE_MASTER_DATA_FAIL,
	// SERVICE_CODE_LIST_RESET,

} from './../../constants/masters/serviceCodeConstants';

//1. create a ProdCat record action
export const createServiceCode = (serviceCode) => async(dispatch, getState) => {
   //console .log("1. INside create ServiceCode of action ----", serviceCode)
   try {
     dispatch({
       type: SERVICE_CODE_CREATE_REQUEST,
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
     //console .log("2. INside create ServiceCode action Before inserting data  ----")
     const { data } = await axios.post('/api/servicecode', serviceCode, config)
     //console .log("3. Inside create ServiceCode action and data inserted is ==== ", data)
     dispatch({
       type: SERVICE_CODE_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create ServiceCode Acion AFTER DISPATCH data  ----")
   } catch (error) {
    console .log("3. Inside Service Code Action and Error Ocureed   ----", error)
    const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
      
    console .log("3. Inside Service Code and Error Message is   ---- ", message)
    dispatch({
      type: SERVICE_CODE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })  
  }
}

//2. get a single record action
export const getServiceCodeDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get ServiceCode details +++++")
     dispatch({ type: SERVICE_CODE_DETAILS_REQUEST })
     //logger("2. ()()() inside serviceCode Details BEFORE GETTING serviceCode details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside ServiceCode Details BEFORE GETTING ServiceCode details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listServiceCodeDetails BEFORE GETTING ServiceCode details ********* ")
     const { data } = await axios.get(`/api/servicecode/${id}`, config)
     //logger("***** inside listServiceCodeDetails and details are ********* ",data)
     dispatch({
       type: SERVICE_CODE_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: SERVICE_CODE_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateServiceCode = (serviceCode) => async (dispatch, getState) => {
   try {
     dispatch({
       type: SERVICE_CODE_UPDATE_REQUEST,
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
       `/api/servicecode/${serviceCode._id}`,
       serviceCode,
       config
     )
 
     dispatch({
       type: SERVICE_CODE_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: SERVICE_CODE_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: SERVICE_CODE_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteServiceCode = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: SERVICE_CODE_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/servicecode/${id}`, config)
 
     dispatch({
       type: SERVICE_CODE_DELETE_SUCCESS,
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
       type: SERVICE_CODE_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all serviceCode records
export const listAllServiceCodes = (pageNumber = '') => async (dispatch, getState) => {
   try {
     dispatch({
       type: SERVICE_CODE_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/servicecode/all`, config)

     dispatch({
       type: SERVICE_CODE_LIST_SUCCESS,
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
       type: SERVICE_CODE_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for Service Code records
export const getAllMasterDataForServiceCode = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVICE_CODE_MASTER_DATA_REQUEST,
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
    const { data } = await axios.get(`/api/servicecode/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside customersList.............", data)
    dispatch({
      type: SERVICE_CODE_MASTER_DATA_SUCCESS,
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
      type: SERVICE_CODE_MASTER_DATA_FAIL,
      payload: message,
    })
  }
}