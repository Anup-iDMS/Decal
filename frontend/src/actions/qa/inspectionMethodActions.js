import axios from 'axios'
import { logout } from './../masters/userActions';
import { 
  INSPECTION_METHOD_CREATE_REQUEST,
	INSPECTION_METHOD_CREATE_SUCCESS,
	INSPECTION_METHOD_CREATE_FAIL,
	INSPECTION_METHOD_CREATE_RESET,

	INSPECTION_METHOD_DETAILS_REQUEST,
	INSPECTION_METHOD_DETAILS_SUCCESS,
	INSPECTION_METHOD_DETAILS_FAIL,
	INSPECTION_METHOD_DETAILS_RESET,

	INSPECTION_METHOD_UPDATE_REQUEST,
	INSPECTION_METHOD_UPDATE_SUCCESS,
	INSPECTION_METHOD_UPDATE_FAIL,
	INSPECTION_METHOD_UPDATE_RESET,

	INSPECTION_METHOD_DELETE_REQUEST,
	INSPECTION_METHOD_DELETE_SUCCESS,
	INSPECTION_METHOD_DELETE_FAIL,
	INSPECTION_METHOD_DELETE_RESET,

	INSPECTION_METHOD_LIST_REQUEST,
	INSPECTION_METHOD_LIST_SUCCESS,
	INSPECTION_METHOD_LIST_FAIL,
	INSPECTION_METHOD_LIST_RESET,
  
  INSPECTION_METHOD_MASTER_LIST_REQUEST,
  INSPECTION_METHOD_MASTER_LIST_SUCCESS,
  INSPECTION_METHOD_MASTER_LIST_FAIL,
  INSPECTION_METHOD_MASTER_LIST_RESET, 
} from './../../constants/qa/inspectionMethodConstants';


//1. create a inspectionMethod record action
export const createInspectionMethod = (inspectionMethod) => async(dispatch, getState) => {
  console.log("1. INside create InspectionMethod of action ----", inspectionMethod)
  try {
    dispatch({
      type: INSPECTION_METHOD_CREATE_REQUEST,
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
    console.log("2. INside create InspectionMethod action Before inserting data  ----")
    const { data } = await axios.post('/api/qa/inspectionmethods', inspectionMethod, config)
    console.log("3. Inside create InspectionMethod action and data inserted is ==== ", data)
    dispatch({
      type: INSPECTION_METHOD_CREATE_SUCCESS,
      payload: data,
    })
    console.log("4. INside create InspectionMethod Acion AFTER DISPATCH data  ----")
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
export const getInspectionMethodDetails = (id) => async (dispatch, getState) => {
  try {
    console.log("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: INSPECTION_METHOD_DETAILS_REQUEST })
    //console.log("2. ()()() inside inspectionMethod Details BEFORE GETTING inspectionMethod details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //console.log("3. ()()() inside InspectionMethod Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //console.log("4. ()()() inside listInspectionMethodDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/qa/inspectionmethods/${id}`, config)
    //console.log("***** inside listInspectionMethodDetails and details are ********* ",data)
    dispatch({
      type: INSPECTION_METHOD_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //console.log("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: INSPECTION_METHOD_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updateInspectionMethod = (inspectionMethod) => async (dispatch, getState) => {
  try {
    dispatch({
      type: INSPECTION_METHOD_UPDATE_REQUEST,
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
      `/api/qa/inspectionmethods/${inspectionMethod._id}`,
      inspectionMethod,
      config
    )

    dispatch({
      type: INSPECTION_METHOD_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: INSPECTION_METHOD_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: INSPECTION_METHOD_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteInspectionMethod = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: INSPECTION_METHOD_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/qa/inspectionmethods/${id}`, config)

    dispatch({
      type: INSPECTION_METHOD_DELETE_SUCCESS,
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
      type: INSPECTION_METHOD_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all inspectionMethod records
export const listAllInspectionMethods = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: INSPECTION_METHOD_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/qa/inspectionmethods/all?pageNumber=${pageNumber}`, config)

    dispatch({
      type: INSPECTION_METHOD_LIST_SUCCESS,
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
      type: INSPECTION_METHOD_LIST_FAIL,
      payload: message,
    })
  }
}

//6. get all all master data for InspectionMethod Screens
export const getAllMasterDataForInspectionMethod = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: INSPECTION_METHOD_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/qa/inspectionmethods/masterdata`, config)
    //console.log("3.~~~~~~~~~~~~~~~~~~~ Here inside InspectionMethod.............", data)
    dispatch({
      type: INSPECTION_METHOD_MASTER_LIST_SUCCESS,
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
      type: INSPECTION_METHOD_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}