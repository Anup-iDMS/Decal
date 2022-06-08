import axios from 'axios'
import { logout } from './../masters/userActions';
import { 
  APP_PARAMETER_CREATE_REQUEST,
	APP_PARAMETER_CREATE_SUCCESS,
	APP_PARAMETER_CREATE_FAIL,
	APP_PARAMETER_CREATE_RESET,

	APP_PARAMETER_DETAILS_REQUEST,
	APP_PARAMETER_DETAILS_SUCCESS,
	APP_PARAMETER_DETAILS_FAIL,
	APP_PARAMETER_DETAILS_RESET,

	APP_PARAMETER_UPDATE_REQUEST,
	APP_PARAMETER_UPDATE_SUCCESS,
	APP_PARAMETER_UPDATE_FAIL,
	APP_PARAMETER_UPDATE_RESET,

	APP_PARAMETER_DELETE_REQUEST,
	APP_PARAMETER_DELETE_SUCCESS,
	APP_PARAMETER_DELETE_FAIL,
	APP_PARAMETER_DELETE_RESET,

	APP_PARAMETER_LIST_REQUEST,
	APP_PARAMETER_LIST_SUCCESS,
	APP_PARAMETER_LIST_FAIL,
	APP_PARAMETER_LIST_RESET,
  
  APP_PARAMETER_MASTER_LIST_REQUEST,
  APP_PARAMETER_MASTER_LIST_SUCCESS,
  APP_PARAMETER_MASTER_LIST_FAIL,
  APP_PARAMETER_MASTER_LIST_RESET, 
} from './../../constants/masters/appParameterConstants';


//1. create a appParameter record action
export const createAppParameter = (appParameter) => async(dispatch, getState) => {
  console.log("1. INside create AppParameter of action ----", appParameter)
  try {
    dispatch({
      type: APP_PARAMETER_CREATE_REQUEST,
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
    console.log("2. INside create AppParameter action Before inserting data  ----")
    const { data } = await axios.post('/api/appparameters', appParameter, config)
    console.log("3. Inside create AppParameter action and data inserted is ==== ", data)
    dispatch({
      type: APP_PARAMETER_CREATE_SUCCESS,
      payload: data,
    })
    console.log("4. INside create AppParameter Acion AFTER DISPATCH data  ----")
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
export const getAppParameterDetails = (id) => async (dispatch, getState) => {
  try {
    console.log("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: APP_PARAMETER_DETAILS_REQUEST })
    //console.log("2. ()()() inside appParameter Details BEFORE GETTING appParameter details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //console.log("3. ()()() inside AppParameter Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //console.log("4. ()()() inside listAppParameterDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/appparameters/${id}`, config)
    //console.log("***** inside listAppParameterDetails and details are ********* ",data)
    dispatch({
      type: APP_PARAMETER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //console.log("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: APP_PARAMETER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updateAppParameter = (appParameter) => async (dispatch, getState) => {
  try {
    dispatch({
      type: APP_PARAMETER_UPDATE_REQUEST,
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
      `/api/appparameters/${appParameter._id}`,
      appParameter,
      config
    )

    dispatch({
      type: APP_PARAMETER_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: APP_PARAMETER_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: APP_PARAMETER_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteAppParameter = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: APP_PARAMETER_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/appparameters/${id}`, config)

    dispatch({
      type: APP_PARAMETER_DELETE_SUCCESS,
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
      type: APP_PARAMETER_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all appParameter records
export const listAllAppParameters = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: APP_PARAMETER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/appparameters/all?pageNumber=${pageNumber}`, config)

    dispatch({
      type: APP_PARAMETER_LIST_SUCCESS,
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
      type: APP_PARAMETER_LIST_FAIL,
      payload: message,
    })
  }
}

//6. get all all master data for AppParameter Screens
export const getAllMasterDataForAppParameter = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: APP_PARAMETER_MASTER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //console.log("2. Here inside Action to get master data for JC .............")
    const { data } = await axios.get(`/api/appparameters/masterdata`, config)
    //console.log("3.~~~~~~~~~~~~~~~~~~~ Here inside AppParameter.............", data)
    dispatch({
      type: APP_PARAMETER_MASTER_LIST_SUCCESS,
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
      type: APP_PARAMETER_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}