import axios from 'axios'
import { logout } from './../masters/userActions';
import { 
  PDIR_CREATE_REQUEST,
	PDIR_CREATE_SUCCESS,
	PDIR_CREATE_FAIL,
	PDIR_CREATE_RESET,

	PDIR_DETAILS_REQUEST,
	PDIR_DETAILS_SUCCESS,
	PDIR_DETAILS_FAIL,
	PDIR_DETAILS_RESET,

	PDIR_UPDATE_REQUEST,
	PDIR_UPDATE_SUCCESS,
	PDIR_UPDATE_FAIL,
	PDIR_UPDATE_RESET,

	PDIR_DELETE_REQUEST,
	PDIR_DELETE_SUCCESS,
	PDIR_DELETE_FAIL,
	PDIR_DELETE_RESET,

	PDIR_LIST_REQUEST,
	PDIR_LIST_SUCCESS,
	PDIR_LIST_FAIL,
	PDIR_LIST_RESET,
  
  PDIR_MASTER_LIST_REQUEST,
  PDIR_MASTER_LIST_SUCCESS,
  PDIR_MASTER_LIST_FAIL,
  PDIR_MASTER_LIST_RESET, 
} from './../../constants/qa/pdirConstants';


//1. create a pditTemplate record action
export const createPDIR = (pditTemplate) => async(dispatch, getState) => {
  console.log("1. INside create PDIR of action ----", pditTemplate)
  try {
    dispatch({
      type: PDIR_CREATE_REQUEST,
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
    console.log("2. INside create PDIR action Before inserting data  ----")
    const { data } = await axios.post('/api/qa/pdir', pditTemplate, config)
    console.log("3. Inside create PDIR action and data inserted is ==== ", data)
    dispatch({
      type: PDIR_CREATE_SUCCESS,
      payload: data,
    })
    console.log("4. INside create PDIR Acion AFTER DISPATCH data  ----")
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
export const getPDIRDetails = (id) => async (dispatch, getState) => {
  try {
    console.log("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: PDIR_DETAILS_REQUEST })
    //console.log("2. ()()() inside pditTemplate Details BEFORE GETTING pditTemplate details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //console.log("3. ()()() inside PDIR Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //console.log("4. ()()() inside listPDIRDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/qa/pdir/${id}`, config)
    //console.log("***** inside listPDIRDetails and details are ********* ",data)
    dispatch({
      type: PDIR_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //console.log("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: PDIR_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updatePDIR = (pditTemplate) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PDIR_UPDATE_REQUEST,
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
      `/api/qa/pdir/${pditTemplate._id}`,
      pditTemplate,
      config
    )

    dispatch({
      type: PDIR_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: PDIR_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PDIR_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deletePDIR = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PDIR_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/qa/pdir/${id}`, config)

    dispatch({
      type: PDIR_DELETE_SUCCESS,
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
      type: PDIR_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all pditTemplate records
export const listAllPDIRs = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: PDIR_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/qa/pdir/all?pageNumber=${pageNumber}`, config)

    dispatch({
      type: PDIR_LIST_SUCCESS,
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
      type: PDIR_LIST_FAIL,
      payload: message,
    })
  }
}

//6. get all all master data for PDIR Screens
export const getAllMasterDataForPDIR = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PDIR_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/qa/pdir/masterdata`, config)
    //console.log("3.~~~~~~~~~~~~~~~~~~~ Here inside PDIR.............", data)
    dispatch({
      type: PDIR_MASTER_LIST_SUCCESS,
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
      type: PDIR_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}