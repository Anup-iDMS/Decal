import axios from 'axios'
import { logout } from './userActions'
import {
	AUTO_INCREMENT_CREATE_REQUEST,
	AUTO_INCREMENT_CREATE_SUCCESS,
	AUTO_INCREMENT_CREATE_FAIL,
	AUTO_INCREMENT_CREATE_RESET,

	AUTO_INCREMENT_DETAILS_REQUEST,
	AUTO_INCREMENT_DETAILS_SUCCESS,
	AUTO_INCREMENT_DETAILS_FAIL,
	AUTO_INCREMENT_DETAILS_RESET,

	AUTO_INCREMENT_UPDATE_REQUEST,
	AUTO_INCREMENT_UPDATE_SUCCESS,
	AUTO_INCREMENT_UPDATE_FAIL,
	AUTO_INCREMENT_UPDATE_RESET,

	AUTO_INCREMENT_DELETE_REQUEST,
	AUTO_INCREMENT_DELETE_SUCCESS,
	AUTO_INCREMENT_DELETE_FAIL,
	AUTO_INCREMENT_DELETE_RESET,

	AUTO_INCREMENT_LIST_REQUEST,
	AUTO_INCREMENT_LIST_SUCCESS,
	AUTO_INCREMENT_LIST_FAIL,
	AUTO_INCREMENT_LIST_RESET,
  
  AUTO_INCREMENT_MASTER_LIST_REQUEST,
  AUTO_INCREMENT_MASTER_LIST_SUCCESS,
  AUTO_INCREMENT_MASTER_LIST_FAIL,
  AUTO_INCREMENT_MASTER_LIST_RESET,
} from './../../constants/masters/autoIncrementConstants';

//1. create a autoIncrement record action
export const createAutoIncrement = (autoIncrement) => async(dispatch, getState) => {
  console.log("1. INside create AutoIncrement of action ----", autoIncrement)
  try {
    dispatch({
      type: AUTO_INCREMENT_CREATE_REQUEST,
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
    console.log("2. INside create AutoIncrement action Before inserting data  ----")
    const { data } = await axios.post('/api/autoincrement', autoIncrement, config)
    console.log("3. Inside create AutoIncrement action and data inserted is ==== ", data)
    dispatch({
      type: AUTO_INCREMENT_CREATE_SUCCESS,
      payload: data,
    })
    console.log("4. INside create AutoIncrement Acion AFTER DISPATCH data  ----")
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
export const getAutoIncrementDetails = (id) => async (dispatch, getState) => {
  try {
    console.log("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: AUTO_INCREMENT_DETAILS_REQUEST })
    //console.log("2. ()()() inside autoIncrement Details BEFORE GETTING autoIncrement details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //console.log("3. ()()() inside AutoIncrement Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //console.log("4. ()()() inside listAutoIncrementDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/autoincrement/${id}`, config)
    //console.log("***** inside listAutoIncrementDetails and details are ********* ",data)
    dispatch({
      type: AUTO_INCREMENT_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //console.log("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: AUTO_INCREMENT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updateAutoIncrement = (autoIncrement) => async (dispatch, getState) => {
  try {
    dispatch({
      type: AUTO_INCREMENT_UPDATE_REQUEST,
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
      `/api/autoincrement/${autoIncrement._id}`,
      autoIncrement,
      config
    )

    dispatch({
      type: AUTO_INCREMENT_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: AUTO_INCREMENT_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: AUTO_INCREMENT_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteAutoIncrement = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: AUTO_INCREMENT_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/autoincrement/${id}`, config)

    dispatch({
      type: AUTO_INCREMENT_DELETE_SUCCESS,
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
      type: AUTO_INCREMENT_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all autoIncrement records
export const listAllAutoIncrements = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: AUTO_INCREMENT_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/autoincrement/all?pageNumber=${pageNumber}`, config)

    dispatch({
      type: AUTO_INCREMENT_LIST_SUCCESS,
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
      type: AUTO_INCREMENT_LIST_FAIL,
      payload: message,
    })
  }
}
