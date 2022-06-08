import axios from 'axios'
import { logger } from './../../util/ConsoleHelper';

import { 
	DISPATCH_DETAILS_CREATE_REQUEST,
	DISPATCH_DETAILS_CREATE_SUCCESS,
	DISPATCH_DETAILS_CREATE_FAIL,
	// DISPATCH_DETAILS_CREATE_RESET,

	DISPATCH_DETAILS_DETAILS_REQUEST,
	DISPATCH_DETAILS_DETAILS_SUCCESS,
	DISPATCH_DETAILS_DETAILS_FAIL,
	// DISPATCH_DETAILS_DETAILS_RESET,

	DISPATCH_DETAILS_UPDATE_REQUEST,
	DISPATCH_DETAILS_UPDATE_SUCCESS,
	DISPATCH_DETAILS_UPDATE_FAIL,
	// DISPATCH_DETAILS_UPDATE_RESET,

	DISPATCH_DETAILS_DELETE_REQUEST,
	DISPATCH_DETAILS_DELETE_SUCCESS,
	DISPATCH_DETAILS_DELETE_FAIL,
	// DISPATCH_DETAILS_DELETE_RESET,

	DISPATCH_DETAILS_LIST_REQUEST,
	DISPATCH_DETAILS_LIST_SUCCESS,
	DISPATCH_DETAILS_LIST_FAIL,
	// DISPATCH_DETAILS_LIST_RESET,

  DISPATCH_DETAILS_MASTER_LIST_REQUEST,
  DISPATCH_DETAILS_MASTER_LIST_SUCCESS,
  DISPATCH_DETAILS_MASTER_LIST_FAIL,
  // DISPATCH_DETAILS_MASTER_LIST_RESET,
} from '../../constants/production/dispatchDetailsConstants';
import { logout } from '../masters/userActions';

//1. create a DispatchDetails record action
/*
export const createDispatchDetails = (dispatchDetails) => async(dispatch, getState) => {

   try {
     dispatch({
       type: DISPATCH_DETAILS_CREATE_REQUEST,
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

     const { data } = await axios.post('/api/dispatchdetails', dispatchDetails, config)
     dispatch({
       type: DISPATCH_DETAILS_CREATE_SUCCESS,
       payload: data,
     })

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
*/

//2. get a single record action
/*
export const getDispatchDetailsDetails = (id) => async (dispatch, getState) => {
   try {

      dispatch({ type: DISPATCH_DETAILS_DETAILS_REQUEST })

      const {
         userLogin: { userInfo },
      } = getState()

      const config = {
         headers: {
            Authorization: `Bearer ${userInfo.token}`,
         },
      }
     const { data } = await axios.get(`/api/dispatchdetails/${id}`, config)

     dispatch({
       type: DISPATCH_DETAILS_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {

      dispatch({
         type: DISPATCH_DETAILS_DETAILS_FAIL,
         payload:
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message
         
      })
   }
}
*/
//1. Create new Dispatch Details and update Delivery Note Record
export const updateDeliveryNoteAndCreateDispatchDetails = (dispatchDetails) => async (dispatch, getState) => {
   try {
     dispatch({
       type: DISPATCH_DETAILS_CREATE_REQUEST,
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
       `/api/dispatchdetails/updatedispatch/${dispatchDetails.id}`,
       dispatchDetails,
       config
     )
 
     dispatch({
       type: DISPATCH_DETAILS_CREATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: DISPATCH_DETAILS_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: DISPATCH_DETAILS_CREATE_FAIL,
       payload: message,
     })
   }
}

//3. update a single record action
export const updateDispatchDetails = (dispatchDetails) => async (dispatch, getState) => {
   try {
     dispatch({
       type: DISPATCH_DETAILS_UPDATE_REQUEST,
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
       `/api/dispatchdetails/${dispatchDetails._id}`,
       dispatchDetails,
       config
     )
 
     dispatch({
       type: DISPATCH_DETAILS_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: DISPATCH_DETAILS_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: DISPATCH_DETAILS_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
/*
export const deleteDispatchDetails = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: DISPATCH_DETAILS_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/dispatchdetails/${id}`, config)
 
     dispatch({
       type: DISPATCH_DETAILS_DELETE_SUCCESS,
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
       type: DISPATCH_DETAILS_DELETE_FAIL,
       payload: message,
     })
   }
}
*/

//5. get all module records
export const listAllDispatchDetails = (pageNumber = '') => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: DISPATCH_DETAILS_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/dispatchdetails/all?pageNumber=${pageNumber}`, config)
     dispatch({
       type: DISPATCH_DETAILS_LIST_SUCCESS,
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
       type: DISPATCH_DETAILS_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for DispatchDetails Screens
export const getAllMasterDataForDispatchDetails = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DISPATCH_DETAILS_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/dispatchdetails/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside DispatchDetails.............", data)
    dispatch({
      type: DISPATCH_DETAILS_MASTER_LIST_SUCCESS,
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
      type: DISPATCH_DETAILS_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}