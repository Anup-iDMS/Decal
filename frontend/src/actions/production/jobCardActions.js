import axios from 'axios'
import { logout } from './../masters/userActions'
import { logger } from './../../util/ConsoleHelper';

import { 
	JOB_CARD_CREATE_REQUEST,
	JOB_CARD_CREATE_SUCCESS,
	// JOB_CARD_CREATE_FAIL,
	// JOB_CARD_CREATE_RESET,

	JOB_CARD_DETAILS_REQUEST,
	JOB_CARD_DETAILS_SUCCESS,
	JOB_CARD_DETAILS_FAIL,
	// JOB_CARD_DETAILS_RESET,

	JOB_CARD_UPDATE_REQUEST,
	JOB_CARD_UPDATE_SUCCESS,
	JOB_CARD_UPDATE_FAIL,
	// JOB_CARD_UPDATE_RESET,

	JOB_CARD_DELETE_REQUEST,
	JOB_CARD_DELETE_SUCCESS,
	JOB_CARD_DELETE_FAIL,
	// JOB_CARD_DELETE_RESET,

	JOB_CARD_LIST_REQUEST,
	JOB_CARD_LIST_SUCCESS,
	JOB_CARD_LIST_FAIL,
	// JOB_CARD_LIST_RESET,

  JOB_CARD_MASTER_LIST_REQUEST,
  JOB_CARD_MASTER_LIST_SUCCESS,
  JOB_CARD_MASTER_LIST_FAIL,
  // JOB_CARD_MASTER_LIST_RESET,
  YIELD_REPORT_REQUEST,
  YIELD_REPORT_SUCCESS,
  YIELD_REPORT_FAIL,
  YIELD_REPORT_RESET

} from './../../constants/production/jobCardConstants';

//1. create a JobCard record action
export const createJobCard = (jobCard) => async(dispatch, getState) => {
   //console .log("1. INside create JobCard of action ----", jobCard)
   try {
     dispatch({
       type: JOB_CARD_CREATE_REQUEST,
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
     //console .log("2. INside create JobCard action Before inserting data  ----")
     const { data } = await axios.post('/api/jobcards', jobCard, config)
     //console .log("3. Inside create JobCard action and data inserted is ==== ", data)
     dispatch({
       type: JOB_CARD_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create JobCard Acion AFTER DISPATCH data  ----")
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
export const getJobCardDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get JOB_CARD details +++++")
     dispatch({ type: JOB_CARD_DETAILS_REQUEST })
     //logger("2. ()()() inside jobCard Details BEFORE GETTING jobCard details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside JobCard Details BEFORE GETTING JOB_CARD details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listJobCardDetails BEFORE GETTING JOB_CARD details ********* ")
     const { data } = await axios.get(`/api/jobcards/${id}`, config)
     //logger("***** inside listJobCardDetails and details are ********* ",data)
     dispatch({
       type: JOB_CARD_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: JOB_CARD_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateJobCard = (jobCard) => async (dispatch, getState) => {
   try {
     dispatch({
       type: JOB_CARD_UPDATE_REQUEST,
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
       `/api/jobcards/${jobCard._id}`,
       jobCard,
       config
     )
 
     dispatch({
       type: JOB_CARD_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: JOB_CARD_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: JOB_CARD_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteJobCard = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: JOB_CARD_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/jobcards/${id}`, config)
 
     dispatch({
       type: JOB_CARD_DELETE_SUCCESS,
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
       type: JOB_CARD_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all job cards records
export const listAllJobCards = (pageNumber = '', jobStatus = 'All') => async (dispatch, getState) => {
   try {
     dispatch({
       type: JOB_CARD_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //console .log("!!!!!>>>> Inside SO Action sales order list aaahe ==== ")
     const { data } = await axios.get(`/api/jobcards/all?pageNumber=${pageNumber}&jobStatus=${jobStatus}`, config)
     //console .log("!!!!!>>>> Inside SO Action sales order list aaahe ==== ", data)
     dispatch({
       type: JOB_CARD_LIST_SUCCESS,
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
       type: JOB_CARD_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for Job Card Screens
export const getAllMasterDataForJobCard = () => async (dispatch, getState) => {
  //logger("*********** inside getAllMasterDataForJobCard ***********")
  try {
    dispatch({
      type: JOB_CARD_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/jobcards/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Job Cards.............", data)
    
    dispatch({
      type: JOB_CARD_MASTER_LIST_SUCCESS,
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
      type: JOB_CARD_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

//8. get all Yield Report
export const getYieldReport = (jcId, startDate, endDate) => async (dispatch, getState) => {
  try {
    dispatch({
      type: YIELD_REPORT_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.get(`/api/jobcards/yieldreport/?jcId=${jcId}&startDate=${startDate}&endDate=${endDate}`, config)
    dispatch({
      type: YIELD_REPORT_SUCCESS,
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
      type: YIELD_REPORT_FAIL,
      payload: message,
    })
  }
}