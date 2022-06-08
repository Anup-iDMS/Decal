import axios from 'axios'
import { 
   CUSTOMER_CREATE_REQUEST,
   CUSTOMER_CREATE_SUCCESS,
   CUSTOMER_CREATE_FAIL,
  //  CUSTOMER_CREATE_RESET,
   CUSTOMER_DETAILS_REQUEST,
   CUSTOMER_DETAILS_SUCCESS,
   CUSTOMER_DETAILS_FAIL,
   CUSTOMER_UPDATE_REQUEST,
   CUSTOMER_UPDATE_SUCCESS,
   CUSTOMER_UPDATE_FAIL,
   CUSTOMER_UPDATE_RESET,
  //  CUSTOMER_DELETE_REQUEST,
  //  CUSTOMER_DELETE_SUCCESS,
  //  CUSTOMER_DELETE_FAIL,
   CUSTOMER_LIST_REQUEST,
   CUSTOMER_LIST_SUCCESS,
   CUSTOMER_LIST_FAIL,
   CUSTOMER_MASTER_LIST_REQUEST,
   CUSTOMER_MASTER_LIST_SUCCESS,
   CUSTOMER_MASTER_LIST_FAIL,
   CUSTOMER_MASTER_LIST_RESET,
  //  CUSTOMER_LIST_RESET 
} from "./../../constants/masters/customerConstants";

import { logout } from './userActions'
import { logger } from './../../util/ConsoleHelper';

export const customersList = (pageNumber = '') => async (dispatch, getState) => {
   //logger("1. Here inside customersList.............")
   try {
     dispatch({
       type: CUSTOMER_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
     //logger("2. Here inside customersList.............")
     const { data } = await axios.get(`/api/customers?pageNumber=${pageNumber}`, config)
     //logger("3. Here inside customersList.............", data)
     dispatch({
       type: CUSTOMER_LIST_SUCCESS,
       payload: data,
     })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       //dispatch(logout())
     }
     dispatch({
       type: CUSTOMER_LIST_FAIL,
       payload: message,
     })
   }
}

export const getCustomerDetails = (id) => async (dispatch, getState) => {
  try {
    //logger("1. +++ inside lead Action and method listLeadDetails +++++")
    dispatch({ type: CUSTOMER_DETAILS_REQUEST })
    //logger("2. ()()() inside listLeadDetails BEFORE GETTING LEAD details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //logger("3. ()()() inside listLeadDetails BEFORE GETTING LEAD details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //logger("4. ()()() inside listLeadDetails BEFORE GETTING LEAD details ********* ")
    const { data } = await axios.get(`/api/customers/${id}`, config)
    //logger("***** inside listLeadDetails and details are ********* ",data)
    dispatch({
      type: CUSTOMER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //logger("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: CUSTOMER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createCustomer = (customer) => async(dispatch, getState) => {
  //console .log("1. INside create Customer of action ----", customer)
  try {
    dispatch({
      type: CUSTOMER_CREATE_REQUEST,
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
    //console .log("2. INside create customer action Before inserting data  ----")
    const { data } = await axios.post('/api/customers', customer, config)
    //console .log("3. Inside create customer action and data inserted is ==== ", data)
    dispatch({
      type: CUSTOMER_CREATE_SUCCESS,
      payload: data,
    })
    console .log("4. INside create Lead Acion AFTER DISPATCH data  ----")
  } catch (error) {
    console .log("5. INside Error Function at Line # 128  ---- ", error)
    //type: CUSTOMER_CREATE_FAIL
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    console .log("6. Line # 137  ----", error.response.data.message)
    dispatch({
      type: CUSTOMER_CREATE_FAIL,
      payload: message,
      error: message,
    })
  }
}

//6. get all all master data for Job Card Screens
export const getAllMasterDataForCustomerMaster = () => async (dispatch, getState) => {

  try {
    dispatch({
      type: CUSTOMER_MASTER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/customers/masterdata`, config)

    
    dispatch({
      type: CUSTOMER_MASTER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    logger("Error occurred ---> ", error.response)
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: CUSTOMER_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

//7. update a single record action
export const updateCustomer = (customer) => async (dispatch, getState) => {

  try {
    dispatch({
      type: CUSTOMER_UPDATE_REQUEST,
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
      `/api/customers/${customer._id}`,
      customer,
      config
    )

    dispatch({
      type: CUSTOMER_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: CUSTOMER_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    logger("Error in Customer Action update ----> ", error.response.data)
    const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      if (message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      dispatch({
        type: CUSTOMER_UPDATE_FAIL,
        payload: message,
      })
  }
}