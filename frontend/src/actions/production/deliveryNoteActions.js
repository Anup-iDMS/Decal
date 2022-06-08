import axios from 'axios'
import { logger } from './../../util/ConsoleHelper';

import { 
	DELIVERY_NOTE_CREATE_REQUEST,
	DELIVERY_NOTE_CREATE_SUCCESS,
	// DELIVERY_NOTE_CREATE_FAIL,
	// DELIVERY_NOTE_CREATE_RESET,

	DELIVERY_NOTE_DETAILS_REQUEST,
	DELIVERY_NOTE_DETAILS_SUCCESS,
	DELIVERY_NOTE_DETAILS_FAIL,
	// DELIVERY_NOTE_DETAILS_RESET,

	DELIVERY_NOTE_UPDATE_REQUEST,
	DELIVERY_NOTE_UPDATE_SUCCESS,
	DELIVERY_NOTE_UPDATE_FAIL,
	// DELIVERY_NOTE_UPDATE_RESET,

	DELIVERY_NOTE_DELETE_REQUEST,
	DELIVERY_NOTE_DELETE_SUCCESS,
	DELIVERY_NOTE_DELETE_FAIL,
	// DELIVERY_NOTE_DELETE_RESET,

	DELIVERY_NOTE_LIST_REQUEST,
	DELIVERY_NOTE_LIST_SUCCESS,
	DELIVERY_NOTE_LIST_FAIL,
	// DELIVERY_NOTE_LIST_RESET,

  DELIVERY_NOTE_MASTER_LIST_REQUEST,
  DELIVERY_NOTE_MASTER_LIST_SUCCESS,
  DELIVERY_NOTE_MASTER_LIST_FAIL,
  // DELIVERY_NOTE_MASTER_LIST_RESET,
} from '../../constants/production/deliveryNoteConstants';
import { logout } from '../masters/userActions';

//1. create a DeliveryNote record action
export const createDeliveryNote = (deliveryNote) => async(dispatch, getState) => {
   //console .log("1. INside create DeliveryNote of action ----", deliveryNote)
   try {
     dispatch({
       type: DELIVERY_NOTE_CREATE_REQUEST,
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
     //console .log("2. INside create DeliveryNote action Before inserting data  ----")
     const { data } = await axios.post('/api/deliverynote', deliveryNote, config)
     //console .log("3. Inside create DeliveryNote action and data inserted is ==== ", data)
     dispatch({
       type: DELIVERY_NOTE_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create DeliveryNote Acion AFTER DISPATCH data  ----")
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
export const getDeliveryNoteDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get DeliveryNote details +++++")
     dispatch({ type: DELIVERY_NOTE_DETAILS_REQUEST })
     ////logger("2. ()()() inside deliveryNote Details BEFORE GETTING deliveryNote details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     ////logger("3. ()()() inside DeliveryNote Details BEFORE GETTING DeliveryNote details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listDeliveryNoteDetails BEFORE GETTING DeliveryNote details ********* ")
     const { data } = await axios.get(`/api/deliverynote/${id}`, config)
     //logger("***** inside listDeliveryNoteDetails and details are ********* ",data)
     dispatch({
       type: DELIVERY_NOTE_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: DELIVERY_NOTE_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateDeliveryNote = (deliveryNote) => async (dispatch, getState) => {
   try {
     dispatch({
       type: DELIVERY_NOTE_UPDATE_REQUEST,
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
       `/api/deliverynote/${deliveryNote._id}`,
       deliveryNote,
       config
     )
 
     dispatch({
       type: DELIVERY_NOTE_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: DELIVERY_NOTE_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: DELIVERY_NOTE_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteDeliveryNote = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: DELIVERY_NOTE_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/deliverynote/${id}`, config)
 
     dispatch({
       type: DELIVERY_NOTE_DELETE_SUCCESS,
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
       type: DELIVERY_NOTE_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all module records
export const listAllDeliveryNotes = (pageNumber = '') => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: DELIVERY_NOTE_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     console .log("!!!!!>>>> Inside SO Action DeliveryNote  list aaahe ==== ")
     const { data } = await axios.get(`/api/deliverynote/all?pageNumber=${pageNumber}`, config)
     console .log("!!!!!>>>> Inside SO Action DeliveryNote list aaahe ==== ", data)
     dispatch({
       type: DELIVERY_NOTE_LIST_SUCCESS,
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
       type: DELIVERY_NOTE_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for DeliveryNote Screens
export const getAllMasterDataForDeliveryNote = () => async (dispatch, getState) => {
  //logger("2. Here inside Action to get master data for DELIVERY NOTE .............")
  try {
    dispatch({
      type: DELIVERY_NOTE_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/deliverynote/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside DeliveryNote.............", data)
    dispatch({
      type: DELIVERY_NOTE_MASTER_LIST_SUCCESS,
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
      type: DELIVERY_NOTE_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}