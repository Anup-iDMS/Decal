import axios from 'axios'
import { logout } from './../masters/userActions';
import { 
  PDIR_TEMPLATE_CREATE_REQUEST,
	PDIR_TEMPLATE_CREATE_SUCCESS,
	PDIR_TEMPLATE_CREATE_FAIL,
	PDIR_TEMPLATE_CREATE_RESET,

	PDIR_TEMPLATE_DETAILS_REQUEST,
	PDIR_TEMPLATE_DETAILS_SUCCESS,
	PDIR_TEMPLATE_DETAILS_FAIL,
	PDIR_TEMPLATE_DETAILS_RESET,

	PDIR_TEMPLATE_UPDATE_REQUEST,
	PDIR_TEMPLATE_UPDATE_SUCCESS,
	PDIR_TEMPLATE_UPDATE_FAIL,
	PDIR_TEMPLATE_UPDATE_RESET,

	PDIR_TEMPLATE_DELETE_REQUEST,
	PDIR_TEMPLATE_DELETE_SUCCESS,
	PDIR_TEMPLATE_DELETE_FAIL,
	PDIR_TEMPLATE_DELETE_RESET,

	PDIR_TEMPLATE_LIST_REQUEST,
	PDIR_TEMPLATE_LIST_SUCCESS,
	PDIR_TEMPLATE_LIST_FAIL,
	PDIR_TEMPLATE_LIST_RESET,
  
  PDIR_TEMPLATE_MASTER_LIST_REQUEST,
  PDIR_TEMPLATE_MASTER_LIST_SUCCESS,
  PDIR_TEMPLATE_MASTER_LIST_FAIL,
  PDIR_TEMPLATE_MASTER_LIST_RESET, 
} from './../../constants/qa/pdirTemplateConstants';


//1. create a pditTemplate record action
export const createPDIRTemplate = (pditTemplate) => async(dispatch, getState) => {
  console.log("1. INside create PDIRTemplate of action ----", pditTemplate)
  try {
    dispatch({
      type: PDIR_TEMPLATE_CREATE_REQUEST,
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
    console.log("2. INside create PDIRTemplate action Before inserting data  ----")
    const { data } = await axios.post('/api/qa/pdirtemplates', pditTemplate, config)
    console.log("3. Inside create PDIRTemplate action and data inserted is ==== ", data)
    dispatch({
      type: PDIR_TEMPLATE_CREATE_SUCCESS,
      payload: data,
    })
    console.log("4. INside create PDIRTemplate Acion AFTER DISPATCH data  ----")
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
export const getPDIRTemplateDetails = (id) => async (dispatch, getState) => {
  try {
    console.log("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: PDIR_TEMPLATE_DETAILS_REQUEST })
    //console.log("2. ()()() inside pditTemplate Details BEFORE GETTING pditTemplate details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //console.log("3. ()()() inside PDIRTemplate Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //console.log("4. ()()() inside listPDIRTemplateDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/qa/pdirtemplates/${id}`, config)
    //console.log("***** inside listPDIRTemplateDetails and details are ********* ",data)
    dispatch({
      type: PDIR_TEMPLATE_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //console.log("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: PDIR_TEMPLATE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updatePDIRTemplate = (pditTemplate) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PDIR_TEMPLATE_UPDATE_REQUEST,
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
      `/api/qa/pdirtemplates/${pditTemplate._id}`,
      pditTemplate,
      config
    )

    dispatch({
      type: PDIR_TEMPLATE_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: PDIR_TEMPLATE_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PDIR_TEMPLATE_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deletePDIRTemplate = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PDIR_TEMPLATE_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/qa/pdirtemplates/${id}`, config)

    dispatch({
      type: PDIR_TEMPLATE_DELETE_SUCCESS,
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
      type: PDIR_TEMPLATE_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all pditTemplate records
export const listAllPDIRTemplates = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: PDIR_TEMPLATE_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/qa/pdirtemplates/all?pageNumber=${pageNumber}`, config)

    dispatch({
      type: PDIR_TEMPLATE_LIST_SUCCESS,
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
      type: PDIR_TEMPLATE_LIST_FAIL,
      payload: message,
    })
  }
}

//6. get all all master data for PDIRTemplate Screens
export const getAllMasterDataForPDIRTemplate = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PDIR_TEMPLATE_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/qa/pdirtemplates/masterdata`, config)
    //console.log("3.~~~~~~~~~~~~~~~~~~~ Here inside PDIRTemplate.............", data)
    dispatch({
      type: PDIR_TEMPLATE_MASTER_LIST_SUCCESS,
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
      type: PDIR_TEMPLATE_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}