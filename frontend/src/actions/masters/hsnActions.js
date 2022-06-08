import axios from 'axios'
import { logout } from './userActions'

import { 
	HSN_CREATE_REQUEST,
	HSN_CREATE_SUCCESS,
	HSN_CREATE_FAIL,
	// HSN_CREATE_RESET,

	HSN_DETAILS_REQUEST,
	HSN_DETAILS_SUCCESS,
	HSN_DETAILS_FAIL,
	// HSN_DETAILS_RESET,

	HSN_UPDATE_REQUEST,
	HSN_UPDATE_SUCCESS,
	HSN_UPDATE_FAIL,
	// HSN_UPDATE_RESET,

	HSN_DELETE_REQUEST,
	HSN_DELETE_SUCCESS,
	HSN_DELETE_FAIL,
	// HSN_DELETE_RESET,

	HSN_LIST_REQUEST,
	HSN_LIST_SUCCESS,
	HSN_LIST_FAIL,
	// HSN_LIST_RESET,

} from '../../constants/masters/hsnConstants';

import { logger } from '../../util/ConsoleHelper';


//1. create a HSNSAC record action
export const createHSNSAC = (hsnsac) => async(dispatch, getState) => {
   //console .log("1. INside create HSNSAC of action ----", hsnsac)
   try {
     dispatch({
       type: HSN_CREATE_REQUEST,
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
     //console .log("2. INside create HSNSAC action Before inserting data  ----")
     const { data } = await axios.post('/api/hsnsac', hsnsac, config)
     //console .log("3. Inside create HSNSAC action and data inserted is ==== ", data)
     dispatch({
       type: HSN_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create HSNSAC Acion AFTER DISPATCH data  ----")
   } catch (error) {
    console .log("3. Inside HSN Action and Error Ocureed   ----")
    const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
      
    console .log("3. Inside HSN Action and Error Message is   ---- ", message)
    dispatch({
      type: HSN_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })  
  }
}

//2. get a single record action
export const getHSNSACDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get HSNSAC details +++++")
     dispatch({ type: HSN_DETAILS_REQUEST })
     //logger("2. ()()() inside hsnsac Details BEFORE GETTING hsnsac details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside HSNSAC Details BEFORE GETTING HSNSAC details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listHSNSACDetails BEFORE GETTING HSNSAC details ********* ")
     const { data } = await axios.get(`/api/hsnsac/${id}`, config)
     //logger("***** inside listHSNSACDetails and details are ********* ",data)
     dispatch({
       type: HSN_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: HSN_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateHSNSAC = (hsnsac) => async (dispatch, getState) => {
   try {
     dispatch({
       type: HSN_UPDATE_REQUEST,
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
       `/api/hsnsac/${hsnsac._id}`,
       hsnsac,
       config
     )
 
     dispatch({
       type: HSN_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: HSN_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: HSN_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteHSNSAC = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: HSN_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/hsnsac/${id}`, config)
 
     dispatch({
       type: HSN_DELETE_SUCCESS,
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
       type: HSN_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all hsnsac records
export const listAllHSNSACs = (pageNumber = '') => async (dispatch, getState) => {
   try {
     dispatch({
       type: HSN_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/hsnsac/all?pageNumber=${pageNumber}`, config)

     dispatch({
       type: HSN_LIST_SUCCESS,
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
       type: HSN_LIST_FAIL,
       payload: message,
     })
   }
}

