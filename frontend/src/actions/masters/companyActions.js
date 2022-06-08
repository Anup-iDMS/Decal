import axios from 'axios'
import { logout } from './userActions'
import {
	COMPANY_CREATE_REQUEST,
	COMPANY_CREATE_SUCCESS,
	COMPANY_CREATE_FAIL,
	COMPANY_CREATE_RESET,

	COMPANY_DETAILS_REQUEST,
	COMPANY_DETAILS_SUCCESS,
	COMPANY_DETAILS_FAIL,
	COMPANY_DETAILS_RESET,

	COMPANY_UPDATE_REQUEST,
	COMPANY_UPDATE_SUCCESS,
	COMPANY_UPDATE_FAIL,
	COMPANY_UPDATE_RESET,

	COMPANY_DELETE_REQUEST,
	COMPANY_DELETE_SUCCESS,
	COMPANY_DELETE_FAIL,
	COMPANY_DELETE_RESET,

	COMPANY_LIST_REQUEST,
	COMPANY_LIST_SUCCESS,
	COMPANY_LIST_FAIL,
	COMPANY_LIST_RESET,
  
  COMPANY_MASTER_LIST_REQUEST,
  COMPANY_MASTER_LIST_SUCCESS,
  COMPANY_MASTER_LIST_FAIL,
  COMPANY_MASTER_LIST_RESET,
} from './../../constants/masters/companyConstants';

//1. create a company record action
export const createCompany = (company) => async(dispatch, getState) => {
  console.log("1. INside create Company of action ----", company)
  try {
    dispatch({
      type: COMPANY_CREATE_REQUEST,
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
    console.log("2. INside create Company action Before inserting data  ----")
    const { data } = await axios.post('/api/company', company, config)
    console.log("3. Inside create Company action and data inserted is ==== ", data)
    dispatch({
      type: COMPANY_CREATE_SUCCESS,
      payload: data,
    })
    console.log("4. INside create Company Acion AFTER DISPATCH data  ----")
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
export const getCompanyDetails = (id) => async (dispatch, getState) => {
  try {
    console.log("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: COMPANY_DETAILS_REQUEST })
    //console.log("2. ()()() inside company Details BEFORE GETTING company details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //console.log("3. ()()() inside Company Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //console.log("4. ()()() inside listCompanyDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/company/${id}`, config)
    //console.log("***** inside listCompanyDetails and details are ********* ",data)
    dispatch({
      type: COMPANY_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //console.log("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: COMPANY_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updateCompany = (company) => async (dispatch, getState) => {
  try {
    dispatch({
      type: COMPANY_UPDATE_REQUEST,
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
      `/api/company/${company._id}`,
      company,
      config
    )

    dispatch({
      type: COMPANY_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: COMPANY_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: COMPANY_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteCompany = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: COMPANY_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/company/${id}`, config)

    dispatch({
      type: COMPANY_DELETE_SUCCESS,
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
      type: COMPANY_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all company records
export const listAllCompanies = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: COMPANY_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/company/all?pageNumber=${pageNumber}`, config)

    dispatch({
      type: COMPANY_LIST_SUCCESS,
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
      type: COMPANY_LIST_FAIL,
      payload: message,
    })
  }
}

