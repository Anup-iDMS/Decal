import axios from 'axios'
import { logout } from './../masters/userActions';
import { 
  INSPECTION_PARAM_CREATE_REQUEST,
	INSPECTION_PARAM_CREATE_SUCCESS,
	INSPECTION_PARAM_CREATE_FAIL,
	INSPECTION_PARAM_CREATE_RESET,

	INSPECTION_PARAM_DETAILS_REQUEST,
	INSPECTION_PARAM_DETAILS_SUCCESS,
	INSPECTION_PARAM_DETAILS_FAIL,
	INSPECTION_PARAM_DETAILS_RESET,

	INSPECTION_PARAM_UPDATE_REQUEST,
	INSPECTION_PARAM_UPDATE_SUCCESS,
	INSPECTION_PARAM_UPDATE_FAIL,
	INSPECTION_PARAM_UPDATE_RESET,

	INSPECTION_PARAM_DELETE_REQUEST,
	INSPECTION_PARAM_DELETE_SUCCESS,
	INSPECTION_PARAM_DELETE_FAIL,
	INSPECTION_PARAM_DELETE_RESET,

	INSPECTION_PARAM_LIST_REQUEST,
	INSPECTION_PARAM_LIST_SUCCESS,
	INSPECTION_PARAM_LIST_FAIL,
	INSPECTION_PARAM_LIST_RESET,
  
  INSPECTION_PARAM_MASTER_LIST_REQUEST,
  INSPECTION_PARAM_MASTER_LIST_SUCCESS,
  INSPECTION_PARAM_MASTER_LIST_FAIL,
  INSPECTION_PARAM_MASTER_LIST_RESET, 
} from './../../constants/qa/inspectionParameterConstants';


//1. create a inspectionParameter record action
export const createInspectionParameter = (inspectionParameter) => async(dispatch, getState) => {
  console.log("1. INside create InspectionParameter of action ----", inspectionParameter)
  try {
    dispatch({
      type: INSPECTION_PARAM_CREATE_REQUEST,
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
    console.log("2. INside create InspectionParameter action Before inserting data  ----")
    const { data } = await axios.post('/api/qa/inspectionparams', inspectionParameter, config)
    console.log("3. Inside create InspectionParameter action and data inserted is ==== ", data)
    dispatch({
      type: INSPECTION_PARAM_CREATE_SUCCESS,
      payload: data,
    })
    console.log("4. INside create InspectionParameter Acion AFTER DISPATCH data  ----")
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
export const getInspectionParameterDetails = (id) => async (dispatch, getState) => {
  try {
    console.log("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: INSPECTION_PARAM_DETAILS_REQUEST })
    //console.log("2. ()()() inside inspectionParameter Details BEFORE GETTING inspectionParameter details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //console.log("3. ()()() inside InspectionParameter Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //console.log("4. ()()() inside listInspectionParameterDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/qa/inspectionparams/${id}`, config)
    //console.log("***** inside listInspectionParameterDetails and details are ********* ",data)
    dispatch({
      type: INSPECTION_PARAM_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //console.log("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: INSPECTION_PARAM_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updateInspectionParameter = (inspectionParameter) => async (dispatch, getState) => {
  try {
    dispatch({
      type: INSPECTION_PARAM_UPDATE_REQUEST,
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
      `/api/qa/inspectionparams/${inspectionParameter._id}`,
      inspectionParameter,
      config
    )

    dispatch({
      type: INSPECTION_PARAM_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: INSPECTION_PARAM_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: INSPECTION_PARAM_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteInspectionParameter = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: INSPECTION_PARAM_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/qa/inspectionparams/${id}`, config)

    dispatch({
      type: INSPECTION_PARAM_DELETE_SUCCESS,
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
      type: INSPECTION_PARAM_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all inspectionParameter records
export const listAllInspectionParameters = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: INSPECTION_PARAM_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/qa/inspectionparams/all?pageNumber=${pageNumber}`, config)

    dispatch({
      type: INSPECTION_PARAM_LIST_SUCCESS,
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
      type: INSPECTION_PARAM_LIST_FAIL,
      payload: message,
    })
  }
}

//6. get all all master data for InspectionParameter Screens
export const getAllMasterDataForInspectionParameter = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: INSPECTION_PARAM_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/qa/inspectionparams/masterdata`, config)
    //console.log("3.~~~~~~~~~~~~~~~~~~~ Here inside InspectionParameter.............", data)
    dispatch({
      type: INSPECTION_PARAM_MASTER_LIST_SUCCESS,
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
      type: INSPECTION_PARAM_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}