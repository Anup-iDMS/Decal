import axios from 'axios'
import { logout } from './userActions'
import {
	ISSUE_CREATE_REQUEST,
	ISSUE_CREATE_SUCCESS,
	ISSUE_CREATE_FAIL,
	ISSUE_CREATE_RESET,

	ISSUE_DETAILS_REQUEST,
	ISSUE_DETAILS_SUCCESS,
	ISSUE_DETAILS_FAIL,
	ISSUE_DETAILS_RESET,

	ISSUE_UPDATE_REQUEST,
	ISSUE_UPDATE_SUCCESS,
	ISSUE_UPDATE_FAIL,
	ISSUE_UPDATE_RESET,

	ISSUE_DELETE_REQUEST,
	ISSUE_DELETE_SUCCESS,
	ISSUE_DELETE_FAIL,
	ISSUE_DELETE_RESET,

	ISSUE_LIST_REQUEST,
	ISSUE_LIST_SUCCESS,
	ISSUE_LIST_FAIL,
	ISSUE_LIST_RESET,
  
  ISSUE_MASTER_LIST_REQUEST,
  ISSUE_MASTER_LIST_SUCCESS,
  ISSUE_MASTER_LIST_FAIL,
  ISSUE_MASTER_LIST_RESET,
} from './../../constants/masters/issueConstants';

import { logger } from './../../util/ConsoleHelper';

//1. create a issue record action
export const createIssue = (issue) => async(dispatch, getState) => {
  logger("1. INside create Issue of action ----", issue)
  try {
    dispatch({
      type: ISSUE_CREATE_REQUEST,
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
    logger("2. INside create Issue action Before inserting data  ----")
    const { data } = await axios.post('/api/issues', issue, config)
    logger("3. Inside create Issue action and data inserted is ==== ", data)
    dispatch({
      type: ISSUE_CREATE_SUCCESS,
      payload: data,
    })
    logger("4. INside create Issue Acion AFTER DISPATCH data  ----")
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
export const getIssueDetails = (id) => async (dispatch, getState) => {
  try {
    logger("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: ISSUE_DETAILS_REQUEST })
    //logger("2. ()()() inside issue Details BEFORE GETTING issue details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //logger("3. ()()() inside Issue Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //logger("4. ()()() inside listIssueDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/issues/${id}`, config)
    //logger("***** inside listIssueDetails and details are ********* ",data)
    dispatch({
      type: ISSUE_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //logger("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: ISSUE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updateIssue = (issue) => async (dispatch, getState) => {
  console.log("Inside Action update issue with details ", issue)
  try {
    dispatch({
      type: ISSUE_UPDATE_REQUEST,
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
      `/api/issues/${issue._id}`,
      issue,
      config
    )

    dispatch({
      type: ISSUE_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: ISSUE_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ISSUE_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteIssue = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ISSUE_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/issues/${id}`, config)

    dispatch({
      type: ISSUE_DELETE_SUCCESS,
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
      type: ISSUE_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all issue records
export const listAllIssues = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: ISSUE_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/issues/all?pageNumber=${pageNumber}`, config)

    dispatch({
      type: ISSUE_LIST_SUCCESS,
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
      type: ISSUE_LIST_FAIL,
      payload: message,
    })
  }
}

//6. get all all master data for Issue Screens
export const getAllMasterDataForIssue = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ISSUE_MASTER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //logger("2. Here inside Action to get master data for JC .............")
    const { data } = await axios.get(`/api/issues/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Issue.............", data)
    dispatch({
      type: ISSUE_MASTER_LIST_SUCCESS,
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
      type: ISSUE_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}