import axios from 'axios'
import { logout } from './userActions'

import { 
	SAC_CREATE_REQUEST,
	SAC_CREATE_SUCCESS,
	SAC_CREATE_FAIL,
	// SAC_CREATE_RESET,

	SAC_DETAILS_REQUEST,
	SAC_DETAILS_SUCCESS,
	SAC_DETAILS_FAIL,
	// SAC_DETAILS_RESET,

	SAC_UPDATE_REQUEST,
	SAC_UPDATE_SUCCESS,
	SAC_UPDATE_FAIL,
	// SAC_UPDATE_RESET,

	SAC_DELETE_REQUEST,
	SAC_DELETE_SUCCESS,
	SAC_DELETE_FAIL,
	// SAC_DELETE_RESET,

	SAC_LIST_REQUEST,
	SAC_LIST_SUCCESS,
	SAC_LIST_FAIL,
	// SAC_LIST_RESET,

} from '../../constants/masters/sacConstants';

import { logger } from '../../util/ConsoleHelper';


//1. create a SAC record action
export const createSAC = (sac) => async(dispatch, getState) => {
   console .log("1. INside create SAC of action ----", sac)
   try {
     dispatch({
       type: SAC_CREATE_REQUEST,
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
     console .log("2. INside create SAC action Before inserting data  ----")
     const { data } = await axios.post('/api/sac', sac, config)
     console .log("3. Inside create SAC action and data inserted is ==== ", data)
     dispatch({
       type: SAC_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create SAC Acion AFTER DISPATCH data  ----")
   } catch (error) {
    console .log("3. Inside HSN Action and Error Ocureed   ----")
    const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
      
    console .log("3. Inside HSN Action and Error Message is   ---- ", message)
    dispatch({
      type: SAC_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })  
  }
}

//2. get a single record action
export const getSACDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get SAC details +++++")
     dispatch({ type: SAC_DETAILS_REQUEST })
     //logger("2. ()()() inside sac Details BEFORE GETTING sac details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside SAC Details BEFORE GETTING SAC details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listSACDetails BEFORE GETTING SAC details ********* ")
     const { data } = await axios.get(`/api/sac/${id}`, config)
     //logger("***** inside listSACDetails and details are ********* ",data)
     dispatch({
       type: SAC_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: SAC_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateSAC = (sac) => async (dispatch, getState) => {
   console.log("************** SAC in actions +++++++++++++++ ", sac)
   try {
     dispatch({
       type: SAC_UPDATE_REQUEST,
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
       `/api/sac/${sac._id}`,
       sac,
       config
     )
 
     dispatch({
       type: SAC_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: SAC_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: SAC_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteSAC = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: SAC_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/sac/${id}`, config)
 
     dispatch({
       type: SAC_DELETE_SUCCESS,
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
       type: SAC_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all sac records
export const listAllSACs = (pageNumber = '') => async (dispatch, getState) => {
   try {
     dispatch({
       type: SAC_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/sac/all?pageNumber=${pageNumber}`, config)

     dispatch({
       type: SAC_LIST_SUCCESS,
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
       type: SAC_LIST_FAIL,
       payload: message,
     })
   }
}

