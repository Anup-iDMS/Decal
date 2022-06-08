import axios from 'axios'
import {
  SUPPLIER_CREATE_REQUEST,
  SUPPLIER_CREATE_SUCCESS,
  SUPPLIER_CREATE_FAIL,
  //  SUPPLIER_CREATE_RESET,
  SUPPLIER_DETAILS_REQUEST,
  SUPPLIER_DETAILS_SUCCESS,
  SUPPLIER_DETAILS_FAIL,
  SUPPLIER_UPDATE_REQUEST,
  SUPPLIER_UPDATE_SUCCESS,
  SUPPLIER_UPDATE_FAIL,
  SUPPLIER_UPDATE_RESET,
  //  SUPPLIER_DELETE_REQUEST,
  //  SUPPLIER_DELETE_SUCCESS,
  //  SUPPLIER_DELETE_FAIL,
  SUPPLIER_LIST_REQUEST,
  SUPPLIER_LIST_SUCCESS,
  SUPPLIER_LIST_FAIL,
  SUPPLIER_MASTER_LIST_REQUEST,
  SUPPLIER_MASTER_LIST_SUCCESS,
  SUPPLIER_MASTER_LIST_FAIL,
  SUPPLIER_MASTER_LIST_RESET,
  //  SUPPLIER_LIST_RESET
} from './../../constants/masters/supplierConstants.js'

import { logout } from './userActions'
import { logger } from './../../util/ConsoleHelper'

export const suppliersList =
  (pageNumber = '') =>
  async (dispatch, getState) => {
    //logger("1. Here inside suppliersList.............")
    try {
      dispatch({
        type: SUPPLIER_LIST_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      //logger("2. Here inside suppliersList.............")
      const { data } = await axios.get(
        `/api/suppliers?pageNumber=${pageNumber}`,
        config
      )
      //logger("3. Here inside suppliersList.............", data)
      dispatch({
        type: SUPPLIER_LIST_SUCCESS,
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
        type: SUPPLIER_LIST_FAIL,
        payload: message,
      })
    }
  }

export const getSupplierDetails = (id) => async (dispatch, getState) => {
  try {
    //logger("1. +++ inside supplier Action and method getSupplierDetails +++++")
    dispatch({ type: SUPPLIER_DETAILS_REQUEST })
    //logger("2. ()()() inside getSupplierDetails BEFORE GETTING supplier details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //logger("3. ()()() inside getSupplierDetails BEFORE GETTING supplier details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //logger("4. ()()() inside getSupplierDetails BEFORE GETTING supplier details ********* ")
    const { data } = await axios.get(`/api/suppliers/${id}`, config)
    //logger("***** inside getSupplierDetails and details are ********* ",data)
    dispatch({
      type: SUPPLIER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //logger("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: SUPPLIER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createSupplier = (supplier) => async (dispatch, getState) => {
  //console .log("1. INside create Supplier of action ----", supplier)
  try {
    dispatch({
      type: SUPPLIER_CREATE_REQUEST,
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
    //console .log("2. INside create supplier action Before inserting data  ----")
    const { data } = await axios.post('/api/suppliers', supplier, config)
    //console .log("3. Inside create supplier action and data inserted is ==== ", data)
    dispatch({
      type: SUPPLIER_CREATE_SUCCESS,
      payload: data,
    })
    console.log('4. INside create Supplier Acion AFTER DISPATCH data  ----')
  } catch (error) {
    console.log('5. INside Error Function at Line # 128  ---- ', error)
    //type: SUPPLIER_CREATE_FAIL
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    console.log('6. Line # 137  ----', error.response.data.message)
    dispatch({
      type: SUPPLIER_CREATE_FAIL,
      payload: message,
      error: message,
    })
  }
}

//6. get all all master data for Supplier Master Screens
export const getAllMasterDataForSupplierMaster =
  () => async (dispatch, getState) => {
    try {
      dispatch({
        type: SUPPLIER_MASTER_LIST_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(`/api/suppliers/masterdata`, config)

      dispatch({
        type: SUPPLIER_MASTER_LIST_SUCCESS,
        payload: data,
      })
    } catch (error) {
      logger('Error occurred ---> ', error.response)
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      if (message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      dispatch({
        type: SUPPLIER_MASTER_LIST_FAIL,
        payload: message,
      })
    }
  }

//7. update a single record action
export const updateSupplier = (supplier) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SUPPLIER_UPDATE_REQUEST,
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
      `/api/suppliers/${supplier._id}`,
      supplier,
      config
    )

    dispatch({
      type: SUPPLIER_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: SUPPLIER_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    logger('Error in Supplier Action update ----> ', error.response.data)
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: SUPPLIER_UPDATE_FAIL,
      payload: message,
    })
  }
}
