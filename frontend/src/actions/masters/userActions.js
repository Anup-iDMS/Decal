import axios from 'axios';
import { logger } from './../../util/ConsoleHelper';

import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,

  USER_MASTER_DATA_REQUEST,
  USER_MASTER_DATA_SUCCESS,
  USER_MASTER_DATA_FAIL,
  USER_MASTER_DATA_RESET,

  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,

  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,

  /** role management constants */
  ROLE_CREATE_REQUEST,
  ROLE_CREATE_SUCCESS,
  ROLE_CREATE_FAIL,
  ROLE_CREATE_RESET,

  ROLE_DETAILS_REQUEST,
  ROLE_DETAILS_SUCCESS,
  ROLE_DETAILS_FAIL,
  ROLE_DETAILS_RESET,

  ROLE_UPDATE_REQUEST,
  ROLE_UPDATE_SUCCESS,
  ROLE_UPDATE_FAIL,
  ROLE_UPDATE_RESET,

  ROLE_DELETE_REQUEST,
  ROLE_DELETE_SUCCESS,
  ROLE_DELETE_FAIL,
  ROLE_DELETE_RESET,

  ROLE_LIST_REQUEST,
  ROLE_LIST_SUCCESS,
  ROLE_LIST_FAIL,
  ROLE_LIST_RESET,

  /** MENU MANAGEMENT */
  MENU_CREATE_REQUEST,
	MENU_CREATE_SUCCESS,
	MENU_CREATE_FAIL,
	MENU_CREATE_RESET,

	MENU_DETAILS_REQUEST,
	MENU_DETAILS_SUCCESS,
	MENU_DETAILS_FAIL,
	MENU_DETAILS_RESET,

	MENU_UPDATE_REQUEST,
	MENU_UPDATE_SUCCESS,
	MENU_UPDATE_FAIL,
	MENU_UPDATE_RESET,

	MENU_DELETE_REQUEST,
	MENU_DELETE_SUCCESS,
	MENU_DELETE_FAIL,
	MENU_DELETE_RESET,

	MENU_LIST_REQUEST,
	MENU_LIST_SUCCESS,
	MENU_LIST_FAIL,
	MENU_LIST_RESET,

  SUBMENU_LIST_REQUEST,
  SUBMENU_LIST_SUCCESS,
  SUBMENU_LIST_FAIL,
  SUBMENU_LIST_RESET,

  MENU_MASTER_DATA_REQUEST,
  MENU_MASTER_DATA_SUCCESS,
  MENU_MASTER_DATA_FAIL,
} from '../../constants/masters/userConstants'

//1. create a User record action
export const createUser = (user) => async(dispatch, getState) => {
  //console .log("1. INside create User of action ----", user)
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
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
    //console .log("2. INside create User action Before inserting data  ----")
    const { data } = await axios.post('/api/users', user, config)
    //console .log("3. Inside create User action and data inserted is ==== ", data)
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    })
    //console .log("4. INside create User Acion AFTER DISPATCH data  ----")
  } catch (error) {
    const message =
    dispatch({
     type: USER_REGISTER_FAIL,
     payload:
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message,
   })
  }
}

export const login = (email, password) => async(dispatch) => {
  //console .log("1. Inside user action and details are --- ", dispatch)
  try {
    dispatch({
      type: USER_LOGIN_REQUEST
    })
    //logger("3. Before user login success....")
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    //logger("4. Before user login fetch data....")
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    )

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })
    //logger("5. Afterfetching date ", data)
    localStorage.setItem('userInfo', JSON.stringify(data))

  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
 
  dispatch({ type: USER_LOGOUT })
  //dispatch({ type: USER_DETAILS_RESET })

  document.location.href = '/'
}

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/users/${id}`, config)

    dispatch({
      type: USER_DETAILS_SUCCESS,
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
      type: USER_DETAILS_FAIL,
      payload: message,
    })
  }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
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

    const { data } = await axios.put(`/api/users/${user._id}`, user, config)

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    })
    // dispatch({
    //   type: USER_LOGIN_SUCCESS,
    //   payload: data,
    // })
    // localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: message,
    })
  }
}

//6. get all all master data for User Screens
export const getAllMasterDataForUser = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_MASTER_DATA_REQUEST,
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
    const { data } = await axios.get(`/api/users/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside User.............", data)
    dispatch({
      type: USER_MASTER_DATA_SUCCESS,
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
      type: USER_MASTER_DATA_FAIL,
      payload: message,
    })
  }
}

//5. get all role records
export const listAllUsers = (pageNumber = '') => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: USER_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     console .log("!!!!!>>>> Inside SO Action User  list aaahe ==== ")
     const { data } = await axios.get(`/api/users/all?pageNumber=${pageNumber}`, config)
     console .log("!!!!!>>>> Inside SO Action User list aaahe ==== ", data)
     dispatch({
       type: USER_LIST_SUCCESS,
       payload: data,
     })
   } catch (error) {
     logger("Inside eror ----------- ", error.response.data)
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: USER_LIST_FAIL,
       payload: message,
     })
   }
}


//1. create a role record action
export const createRole = (role) => async(dispatch, getState) => {
  logger("1. INside create Role of action ----", role)
  try {
    dispatch({
      type: ROLE_CREATE_REQUEST,
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
    logger("2. INside create Role action Before inserting data  ----")
    const { data } = await axios.post('/api/users/role', role, config)
    logger("3. Inside create Role action and data inserted is ==== ", data)
    dispatch({
      type: ROLE_CREATE_SUCCESS,
      payload: data,
    })
    logger("4. INside create Role Acion AFTER DISPATCH data  ----")
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
export const getRoleDetails = (id) => async (dispatch, getState) => {
  try {
    logger("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: ROLE_DETAILS_REQUEST })
    //logger("2. ()()() inside role Details BEFORE GETTING role details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //logger("3. ()()() inside Role Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //logger("4. ()()() inside listRoleDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/users/role/${id}`, config)
    //logger("***** inside listRoleDetails and details are ********* ",data)
    dispatch({
      type: ROLE_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //logger("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: ROLE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updateRole = (role) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ROLE_UPDATE_REQUEST,
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
      `/api/users/role/${role._id}`,
      role,
      config
    )

    dispatch({
      type: ROLE_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: ROLE_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ROLE_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteRole = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ROLE_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/users/role/${id}`, config)

    dispatch({
      type: ROLE_DELETE_SUCCESS,
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
      type: ROLE_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all role records
export const listAllRoles = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: ROLE_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/users/role/all`, config)

    dispatch({
      type: ROLE_LIST_SUCCESS,
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
      type: ROLE_LIST_FAIL,
      payload: message,
    })
  }
}
/** MENU MANAGEMENT */

//1. create a menuItem record action
export const createMenuItem = (menuItem) => async(dispatch, getState) => {
  logger("1. INside create MenuItem of action ----", menuItem)
  try {
    dispatch({
      type: MENU_CREATE_REQUEST,
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
    logger("2. INside create MenuItem action Before inserting data  ----")
    const { data } = await axios.post('/api/users/menuitems', menuItem, config)
    logger("3. Inside create MenuItem action and data inserted is ==== ", data)
    dispatch({
      type: MENU_CREATE_SUCCESS,
      payload: data,
    })
    logger("4. INside create MenuItem Acion AFTER DISPATCH data  ----")
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
export const getMenuItemDetails = (id) => async (dispatch, getState) => {
  try {
    logger("1. +++ inside a function to get MODULE details +++++")
    dispatch({ type: MENU_DETAILS_REQUEST })
    //logger("2. ()()() inside menuItem Details BEFORE GETTING menuItem details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //logger("3. ()()() inside MenuItem Details BEFORE GETTING MODULE details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //logger("4. ()()() inside listMenuItemDetails BEFORE GETTING MODULE details ********* ")
    const { data } = await axios.get(`/api/users/menuitems/${id}`, config)
    //logger("***** inside listMenuItemDetails and details are ********* ",data)
    dispatch({
      type: MENU_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //logger("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: MENU_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
		
    })
  }
}

//3. update a single record action
export const updateMenuItem = (menuItem) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MENU_UPDATE_REQUEST,
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
      `/api/users/menuitems/${menuItem._id}`,
      menuItem,
      config
    )

    dispatch({
      type: MENU_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: MENU_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: MENU_UPDATE_FAIL,
      payload: message,
    })
  }
}

//4. delete a single record action
export const deleteMenuItem = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MENU_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/users/menuitems/${id}`, config)

    dispatch({
      type: MENU_DELETE_SUCCESS,
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
      type: MENU_DELETE_FAIL,
      payload: message,
    })
  }
}

//5. get all menuItem records
export const listAllMenuItems = (pageNumber = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: MENU_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/users/menuitems/all`, config)

    dispatch({
      type: MENU_LIST_SUCCESS,
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
      type: MENU_LIST_FAIL,
      payload: message,
    })
  }
}

//6. get all all master data for Menu Screens
export const getAllMasterDataForMenu = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: MENU_MASTER_DATA_REQUEST,
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
    const { data } = await axios.get(`/api/users/menuitems/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Menu.............", data)
    dispatch({
      type: MENU_MASTER_DATA_SUCCESS,
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
      type: MENU_MASTER_DATA_FAIL,
      payload: message,
    })
  }
}

//7. get all submenuItem records
export const listAllSubMenuItems = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SUBMENU_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

     const { data } = await axios.get(`/api/users/menuitems/submenu/${id}`, config)

    dispatch({
      type: SUBMENU_LIST_SUCCESS,
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
      type: SUBMENU_LIST_FAIL,
      payload: message,
    })
  }
}
