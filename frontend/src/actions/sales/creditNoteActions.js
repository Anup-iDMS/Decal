import axios from 'axios'
import { logger } from '../../util/ConsoleHelper';

import { 
	CREDIT_NOTE_CREATE_REQUEST,
	CREDIT_NOTE_CREATE_SUCCESS,
	// CREDIT_NOTE_CREATE_FAIL,
	// CREDIT_NOTE_CREATE_RESET,

	CREDIT_NOTE_DETAILS_REQUEST,
	CREDIT_NOTE_DETAILS_SUCCESS,
	CREDIT_NOTE_DETAILS_FAIL,
	// CREDIT_NOTE_DETAILS_RESET,

	CREDIT_NOTE_UPDATE_REQUEST,
	CREDIT_NOTE_UPDATE_SUCCESS,
	CREDIT_NOTE_UPDATE_FAIL,
	// CREDIT_NOTE_UPDATE_RESET,

	CREDIT_NOTE_DELETE_REQUEST,
	CREDIT_NOTE_DELETE_SUCCESS,
	CREDIT_NOTE_DELETE_FAIL,
	// CREDIT_NOTE_DELETE_RESET,

	CREDIT_NOTE_LIST_REQUEST,
	CREDIT_NOTE_LIST_SUCCESS,
	CREDIT_NOTE_LIST_FAIL,
	// CREDIT_NOTE_LIST_RESET,

  CREDIT_NOTE_MASTER_LIST_REQUEST,
  CREDIT_NOTE_MASTER_LIST_SUCCESS,
  CREDIT_NOTE_MASTER_LIST_FAIL,
  // CREDIT_NOTE_MASTER_LIST_RESET,

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

  CREDIT_NOTE_JC_MASTER_LIST_REQUEST,
  CREDIT_NOTE_JC_MASTER_LIST_SUCCESS,
  CREDIT_NOTE_JC_MASTER_LIST_FAIL,
  CREDIT_NOTE_JC_MASTER_LIST_RESET,
  
  CREDIT_NOTE_OPEN_LIST_REQUEST, 
  CREDIT_NOTE_OPEN_LIST_SUCCESS,
  CREDIT_NOTE_OPEN_LIST_FAIL,
  CREDIT_NOTE_OPEN_LIST_RESET,

  CREDIT_NOTE_APPROVED_LIST_REQUEST,
  CREDIT_NOTE_APPROVED_LIST_SUCCESS,
  CREDIT_NOTE_APPROVED_LIST_FAIL,

  CREDIT_NOTE_WITH_TAX_LIST_REQUEST,
  CREDIT_NOTE_WITH_TAX_LIST_SUCCESS,
  CREDIT_NOTE_WITH_TAX_LIST_FAIL,

} from '../../constants/sales/creditNoteConstants';
import { logout } from '../masters/userActions';

//1. create a CreditNote record action
export const createCreditNote = (creditNote) => async(dispatch, getState) => {
   //console .log("1. INside create CreditNote of action ----", creditNote)
   try {
     dispatch({
       type: CREDIT_NOTE_CREATE_REQUEST,
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
     //console .log("2. INside create CreditNote action Before inserting data  ----")
     const { data } = await axios.post('/api/creditnote', creditNote, config)
     //console .log("3. Inside create CreditNote action and data inserted is ==== ", data)
     dispatch({
       type: CREDIT_NOTE_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create CreditNote Acion AFTER DISPATCH data  ----")
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
export const getCreditNoteDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get CreditNote details +++++")
     dispatch({ type: CREDIT_NOTE_DETAILS_REQUEST })
     ////logger("2. ()()() inside creditNote Details BEFORE GETTING creditNote details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     ////logger("3. ()()() inside CreditNote Details BEFORE GETTING CreditNote details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listCreditNoteDetails BEFORE GETTING CreditNote details ********* ")
     const { data } = await axios.get(`/api/creditnote/${id}`, config)
     //logger("***** inside listCreditNoteDetails and details are ********* ",data)
     dispatch({
       type: CREDIT_NOTE_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: CREDIT_NOTE_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateCreditNote = (creditNote) => async (dispatch, getState) => {
   try {
     dispatch({
       type: CREDIT_NOTE_UPDATE_REQUEST,
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
       `/api/creditnote/${creditNote._id}`,
       creditNote,
       config
     )
 
     dispatch({
       type: CREDIT_NOTE_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: CREDIT_NOTE_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: CREDIT_NOTE_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteCreditNote = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: CREDIT_NOTE_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/creditnote/${id}`, config)
 
     dispatch({
       type: CREDIT_NOTE_DELETE_SUCCESS,
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
       type: CREDIT_NOTE_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all module records
export const listAllCreditNotes = (pageNumber = '') => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: CREDIT_NOTE_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
    // console .log("!!!!!>>>> Inside SO Action CreditNote  list aaahe ==== ")
     const { data } = await axios.get(`/api/creditnote/all?pageNumber=${pageNumber}`, config)
     //console .log("!!!!!>>>> Inside SO Action CreditNote list aaahe ==== ", data)
     dispatch({
       type: CREDIT_NOTE_LIST_SUCCESS,
       payload: data,
     })
   } catch (error) {
     logger("Inside eror ----------- ", error)
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: CREDIT_NOTE_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for CreditNote Screens
export const getAllMasterDataForCreditNote = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CREDIT_NOTE_MASTER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //logger("2. Here inside Action to get master data for Sales Invoice .............")
    const { data } = await axios.get(`/api/creditnote/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside CreditNote.............", data)
    dispatch({
      type: CREDIT_NOTE_MASTER_LIST_SUCCESS,
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
      type: CREDIT_NOTE_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

//7 get all module records
export const listAllCreditNotesWithTax = (pageNumber = '', jcId, customerId, startDate, endDate) => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: CREDIT_NOTE_WITH_TAX_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
    // console .log("!!!!!>>>> Inside SO Action CreditNote  list aaahe ==== ?jcId=${jcId}&startDate=${startDate}&endDate=${endDate} ")
     const { data } = await axios.get(`/api/creditnote/withtax?pageNumber=${pageNumber}&jcId=${jcId}&customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`, config)
     //console .log("!!!!!>>>> Inside SO Action CreditNote list aaahe ==== ", data)
     dispatch({
       type: CREDIT_NOTE_WITH_TAX_LIST_SUCCESS,
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
       type: CREDIT_NOTE_WITH_TAX_LIST_FAIL,
       payload: message,
     })
   }
}