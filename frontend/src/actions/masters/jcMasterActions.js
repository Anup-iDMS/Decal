import axios from 'axios'
import { logout } from './userActions'
import { logger } from './../../util/ConsoleHelper';

import {
	JC_CREATE_REQUEST,
	JC_CREATE_SUCCESS,
	// JC_CREATE_FAIL,
	// JC_CREATE_RESET,

	JC_DETAILS_REQUEST,
	JC_DETAILS_SUCCESS,
	JC_DETAILS_FAIL,
	// JC_DETAILS_RESET,

	JC_UPDATE_REQUEST,
	JC_UPDATE_SUCCESS,
	JC_UPDATE_FAIL,
	// JC_UPDATE_RESET,

	JC_DELETE_REQUEST,
	JC_DELETE_SUCCESS,
	JC_DELETE_FAIL,
	// JC_DELETE_RESET,

	JC_LIST_REQUEST,
	JC_LIST_SUCCESS,
	JC_LIST_FAIL,
	// JC_LIST_RESET,

  JC_MASTER_LIST_REQUEST,
  JC_MASTER_LIST_SUCCESS,
  JC_MASTER_LIST_FAIL,
  // JC_MASTER_LIST_RESET,

  JC_ALL_LIST_REQUEST,
  JC_ALL_LIST_SUCCESS,
  JC_ALL_LIST_FAIL,
  // JC_ALL_LIST_RESET,

  JC_MASTER_CUSTOMER_LIST_REQUEST,
  JC_MASTER_CUSTOMER_LIST_SUCCESS,
  JC_MASTER_CUSTOMER_LIST_FAIL,
  // JC_MASTER_CUSTOMER_LIST_RESET
  JC_MASTER_REPORT_REQUEST,
  JC_MASTER_REPORT_SUCCESS,
  JC_MASTER_REPORT_FAIL,

  JC_MASTER_CUSTOMER_PO_LIST_REQUEST,
  JC_MASTER_CUSTOMER_PO_LIST_SUCCESS,
  JC_MASTER_CUSTOMER_PO_LIST_FAIL,
} from './../../constants/masters/jcMasterConstants';

//1. create a jcMaster record action
export const createJCMaster = (jcMaster) => async(dispatch, getState) => {
  //console .log("1. INside create JCMaster of action ----", jcMaster)
  try {
    dispatch({
      type: JC_CREATE_REQUEST,
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
    //console .log("2. INside create JCMaster action Before inserting data  ----")
    const { data } = await axios.post('/api/jcmasters', jcMaster, config)
    //console .log("3. Inside create JCMaster action and data inserted is ==== ", data)
    dispatch({
      type: JC_CREATE_SUCCESS,
      payload: data,
    })
    //console .log("4. INside create JCMaster Acion AFTER DISPATCH data  ----")
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
export const getJCMasterDetails = (id) => async (dispatch, getState) => {
  try {
    //logger("1. +++ inside a function to get JC details +++++")
    dispatch({ type: JC_DETAILS_REQUEST })
    //logger("2. ()()() inside jcMaster Details BEFORE GETTING jcMaster details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //logger("3. ()()() inside JCMaster Details BEFORE GETTING JC details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //logger("4. ()()() inside listJCMasterDetails BEFORE GETTING JC details ********* ")
    const { data } = await axios.get(`/api/jcmasters/${id}`, config)
    //logger("***** inside listJCMasterDetails and details are ********* ",data)
    dispatch({
      type: JC_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //logger("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: JC_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
   //  if (message === 'Not authorized, token failed') {
   //    dispatch(logout())
   //  }
  }
}

//3. update a single record action
export const updateJCMaster = (jcMaster) => async (dispatch, getState) => {
  try {
    dispatch({
      type: JC_UPDATE_REQUEST,
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
    //console .log(">>> Inside JC Master Edit Option. Updating the record for id ", jcMaster._id)
    const { data } = await axios.put(
      `/api/jcmasters/${jcMaster._id}`,
      jcMaster,
      config
    )

    dispatch({
      type: JC_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: JC_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: JC_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteJCMaster = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: JC_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/jcmasters/${id}`, config)

    dispatch({
      type: JC_DELETE_SUCCESS,
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
      type: JC_DELETE_FAIL,
      payload: message,
    })
  }
}
//5. get all jcMaster records for JC Master Listing Screen
export const listJCMasters = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: JC_ALL_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //logger("2. Here inside Action JC LIST.............")
    const { data } = await axios.get('/api/jcmasters', config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside listJCMasters.............", data)
    dispatch({
      type: JC_ALL_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //logger("<<<<<< ERROR >>>>>>>>>>>> ", error)
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: JC_ALL_LIST_FAIL,
      payload: message,
    })
  }
}

//5.1 get all jcMaster records for Reports filter
export const listAllJCMasters = (pageNumber = '', pageName='') => async (dispatch, getState) => {
  try {
    dispatch({
      type: JC_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //logger("2. Here inside Action JC LIST.............")
    const { data } = await axios.get(`/api/jcmasters/all?pageNumber=${pageNumber}&pageName=${pageName}`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside customersList.............", data)
    dispatch({
      type: JC_LIST_SUCCESS,
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
      type: JC_LIST_FAIL,
      payload: message,
    })
  }
}

//5.2 get all jcMaster records for Reports filter
export const getJCMastersReport = (customerId, jcId) => async (dispatch, getState) => {
  console.log("Inside Action getJCMastersReport and customer id ", customerId)
  console.log("Inside Action getJCMastersReport and jcId id ", jcId)
  try {
    dispatch({
      type: JC_MASTER_REPORT_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //logger("2. Here inside Action JC LIST.............")
    //const { data } = await axios.get('/api/jcmasters/jcmasterreport', config)
    const { data } = await axios.get(`/api/jcmasters/jcmasterreport/?customerId=${customerId}&jcId=${jcId}`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside customersList.............", data)
    dispatch({
      type: JC_MASTER_REPORT_SUCCESS,
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
      type: JC_MASTER_REPORT_FAIL,
      payload: message,
    })
  }
}


//6. get all all master data for JC records
export const getAllMasterDataForJC = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: JC_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/jcmasters/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside customersList.............", data)
    dispatch({
      type: JC_MASTER_LIST_SUCCESS,
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
      type: JC_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

//7 get all customer specific JC data
export const getCustomerJCs = (customerId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: JC_MASTER_CUSTOMER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //console .log("2. @@@@@@@@@@@@@@@@@@@@ Here inside Action to get CustomerJCs .............")
    const { data } = await axios.get(`/api/jcmasters/customer/${customerId}`, config)
    //console .log("3.~~~~~~~~~~~~~~~~~~~ Here inside getCustomerJCs.............", data)
    dispatch({
      type: JC_MASTER_CUSTOMER_LIST_SUCCESS,
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
      type: JC_MASTER_CUSTOMER_LIST_FAIL,
      payload: message,
    })
  }
}

//9 get all customer specific JC data
export const getCustomerJCPOs = (customerId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: JC_MASTER_CUSTOMER_PO_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //console .log("2. @@@@@@@@@@@@@@@@@@@@ Here inside Action to get CustomerJCs .............")
    const { data } = await axios.get(`/api/jcmasters/po/customer/${customerId}`, config)
    //console .log("3.~~~~~~~~~~~~~~~~~~~ Here inside getCustomerJCPOs.............", data)
    dispatch({
      type: JC_MASTER_CUSTOMER_PO_LIST_SUCCESS,
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
      type: JC_MASTER_CUSTOMER_PO_LIST_FAIL,
      payload: message,
    })
  }
}