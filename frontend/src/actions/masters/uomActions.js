import axios from 'axios'
import { logout } from './../masters/userActions'
import { logger } from './../../util/ConsoleHelper';

import { 
	UOM_CREATE_REQUEST,
	UOM_CREATE_SUCCESS,
	UOM_CREATE_FAIL,
	// UOM_CREATE_RESET,

	UOM_DETAILS_REQUEST,
	UOM_DETAILS_SUCCESS,
	UOM_DETAILS_FAIL,
	// UOM_DETAILS_RESET,

	UOM_UPDATE_REQUEST,
	UOM_UPDATE_SUCCESS,
	UOM_UPDATE_FAIL,
	// UOM_UPDATE_RESET,

	UOM_DELETE_REQUEST,
	UOM_DELETE_SUCCESS,
	UOM_DELETE_FAIL,
	// UOM_DELETE_RESET,

	UOM_LIST_REQUEST,
	UOM_LIST_SUCCESS,
	UOM_LIST_FAIL,
	// UOM_LIST_RESET,

} from './../../constants/masters/uomConstants';

//1. create a UOM record action
export const createUOM = (uom) => async(dispatch, getState) => {
   //console .log("1. INside create UOM of action ----", uom)
   try {
     dispatch({
       type: UOM_CREATE_REQUEST,
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
     //console .log("2. INside create UOM action Before inserting data  ----")
     const { data } = await axios.post('/api/appdata/uom', uom, config)
     //console .log("3. Inside create UOM action and data inserted is ==== ", data)
     dispatch({
       type: UOM_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create UOM Acion AFTER DISPATCH data  ----")
   } catch (error) {
    console .log("3. Inside MACHINE MASTER Action and Error Ocureed   ----")
    const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
      
    console .log("3. Inside MACHINE MASTER and Error Message is   ---- ", message)
    dispatch({
      type: UOM_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })  
  }
}

//2. get a single record action
export const getUOMDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get UOM details +++++")
     dispatch({ type: UOM_DETAILS_REQUEST })
     //logger("2. ()()() inside uom Details BEFORE GETTING uom details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside UOM Details BEFORE GETTING UOM details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listUOMDetails BEFORE GETTING UOM details ********* ")
     const { data } = await axios.get(`/api/appdata/uom/${id}`, config)
     //logger("***** inside listUOMDetails and details are ********* ",data)
     dispatch({
       type: UOM_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: UOM_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateUOM = (uom) => async (dispatch, getState) => {
   try {
     dispatch({
       type: UOM_UPDATE_REQUEST,
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
       `/api/appdata/uom/${uom._id}`,
       uom,
       config
     )
 
     dispatch({
       type: UOM_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: UOM_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: UOM_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteUOM = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: UOM_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/appdata/uom/${id}`, config)
 
     dispatch({
       type: UOM_DELETE_SUCCESS,
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
       type: UOM_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all uom records
export const listAllUOMs = (pageNumber = '') => async (dispatch, getState) => {
   try {
     dispatch({
       type: UOM_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/appdata/uom`, config)

     dispatch({
       type: UOM_LIST_SUCCESS,
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
       type: UOM_LIST_FAIL,
       payload: message,
     })
   }
}

