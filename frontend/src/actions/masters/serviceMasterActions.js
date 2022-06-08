import axios from 'axios'
import { logout } from './../masters/userActions';
import { 
  SERVICE_MASTER_CREATE_REQUEST,
	SERVICE_MASTER_CREATE_SUCCESS,
	SERVICE_MASTER_CREATE_FAIL,
	SERVICE_MASTER_CREATE_RESET,

	SERVICE_MASTER_DETAILS_REQUEST,
	SERVICE_MASTER_DETAILS_SUCCESS,
	SERVICE_MASTER_DETAILS_FAIL,
	SERVICE_MASTER_DETAILS_RESET,

	SERVICE_MASTER_UPDATE_REQUEST,
	SERVICE_MASTER_UPDATE_SUCCESS,
	SERVICE_MASTER_UPDATE_FAIL,
	SERVICE_MASTER_UPDATE_RESET,

	SERVICE_MASTER_DELETE_REQUEST,
	SERVICE_MASTER_DELETE_SUCCESS,
	SERVICE_MASTER_DELETE_FAIL,
	SERVICE_MASTER_DELETE_RESET,

	SERVICE_MASTER_LIST_REQUEST,
	SERVICE_MASTER_LIST_SUCCESS,
	SERVICE_MASTER_LIST_FAIL,
	SERVICE_MASTER_LIST_RESET,
  
  SERVICE_MASTER_MASTER_LIST_REQUEST,
  SERVICE_MASTER_MASTER_LIST_SUCCESS,
  SERVICE_MASTER_MASTER_LIST_FAIL,
  SERVICE_MASTER_MASTER_LIST_RESET, 
} from './../../constants/masters/serviceMasterConstants';


//1. create a serviceMaster record action
export const createServiceMaster = (serviceMaster) => async(dispatch, getState) => {
  console.log("1. INside create ServiceMaster of action ----", serviceMaster)
  try {
    dispatch({
      type: SERVICE_MASTER_CREATE_REQUEST,
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
    console.log("2. INside create ServiceMaster action Before inserting data  ----")
    const { data } = await axios.post('/api/servicemaster', serviceMaster, config)
    console.log("3. Inside create ServiceMaster action and data inserted is ==== ", data)
    dispatch({
      type: SERVICE_MASTER_CREATE_SUCCESS,
      payload: data,
    })
    console.log("4. INside create ServiceMaster Acion AFTER DISPATCH data  ----")
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
export const getServiceMasterDetails = (id) => async (dispatch, getState) => {
  try {
    console.log("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: SERVICE_MASTER_DETAILS_REQUEST })
    //console.log("2. ()()() inside serviceMaster Details BEFORE GETTING serviceMaster details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //console.log("3. ()()() inside ServiceMaster Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //console.log("4. ()()() inside listServiceMasterDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/servicemaster/${id}`, config)
    //console.log("***** inside listServiceMasterDetails and details are ********* ",data)
    dispatch({
      type: SERVICE_MASTER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //console.log("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: SERVICE_MASTER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updateServiceMaster = (serviceMaster) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVICE_MASTER_UPDATE_REQUEST,
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
      `/api/servicemaster/${serviceMaster._id}`,
      serviceMaster,
      config
    )

    dispatch({
      type: SERVICE_MASTER_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: SERVICE_MASTER_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: SERVICE_MASTER_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteServiceMaster = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVICE_MASTER_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/servicemaster/${id}`, config)

    dispatch({
      type: SERVICE_MASTER_DELETE_SUCCESS,
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
      type: SERVICE_MASTER_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all serviceMaster records
export const listAllServiceMasters = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVICE_MASTER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/servicemaster/all?pageNumber=${pageNumber}`, config)

    dispatch({
      type: SERVICE_MASTER_LIST_SUCCESS,
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
      type: SERVICE_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

//6. get all all master data for ServiceMaster Screens
export const getAllMasterDataForServiceMaster = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVICE_MASTER_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/servicemaster/masterdata`, config)
    //console.log("3.~~~~~~~~~~~~~~~~~~~ Here inside ServiceMaster.............", data)
    dispatch({
      type: SERVICE_MASTER_MASTER_LIST_SUCCESS,
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
      type: SERVICE_MASTER_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}