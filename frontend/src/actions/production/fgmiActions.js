import axios from 'axios'
import { logout } from './../masters/userActions'
import { logger } from './../../util/ConsoleHelper';

import { 
	FGMI_CREATE_REQUEST,
	FGMI_CREATE_SUCCESS,
	// FGMI_CREATE_FAIL,
	// FGMI_CREATE_RESET,

	FGMI_DETAILS_REQUEST,
	FGMI_DETAILS_SUCCESS,
	FGMI_DETAILS_FAIL,
	// FGMI_DETAILS_RESET,

	FGMI_UPDATE_REQUEST,
	FGMI_UPDATE_SUCCESS,
	FGMI_UPDATE_FAIL,
	// FGMI_UPDATE_RESET,

	FGMI_DELETE_REQUEST,
	FGMI_DELETE_SUCCESS,
	FGMI_DELETE_FAIL,
	// FGMI_DELETE_RESET,

	FGMI_LIST_REQUEST,
	FGMI_LIST_SUCCESS,
	FGMI_LIST_FAIL,
	// FGMI_LIST_RESET,

   FGMI_MASTER_LIST_REQUEST,
   FGMI_MASTER_LIST_SUCCESS,
   FGMI_MASTER_LIST_FAIL,
  //  FGMI_MASTER_LIST_RESET,
  FGMI_BACTH_LIST_BY_JC_REQUEST,
  FGMI_BACTH_LIST_BY_JC_SUCCESS,
  FGMI_BACTH_LIST_BY_JC_FAIL,
  //FGM Correction
  FGMI_CORRECTION_UPDATE_REQUEST,
  FGMI_CORRECTION_UPDATE_SUCCESS,
  FGMI_CORRECTION_UPDATE_FAIL

} from './../../constants/production/fgmiConstants';

//1. create a FGMI record action
export const createFGMI = (fgmi) => async(dispatch, getState) => {
   //console .log("1. INside create FGMI of action ----", fgmi)
   try {
     dispatch({
       type: FGMI_CREATE_REQUEST,
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
     //console .log("2. INside create FGMI action Before inserting data  ----")
     const { data } = await axios.post('/api/fgmi', fgmi, config)
     //console .log("3. Inside create FGMI action and data inserted is ==== ", data)
     dispatch({
       type: FGMI_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create FGMI Acion AFTER DISPATCH data  ----")
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
export const getFGMIDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get FGMI details +++++")
     dispatch({ type: FGMI_DETAILS_REQUEST })
     //logger("2. ()()() inside fgmi Details BEFORE GETTING fgmi details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside FGMI Details BEFORE GETTING FGMI details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listFGMIDetails BEFORE GETTING FGMI details ********* ")
     const { data } = await axios.get(`/api/fgmi/${id}`, config)
     //logger("***** inside listFGMIDetails and details are ********* ",data)
     dispatch({
       type: FGMI_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: FGMI_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateFGMI = (fgmi) => async (dispatch, getState) => {
   try {
     dispatch({
       type: FGMI_UPDATE_REQUEST,
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
       `/api/fgmi/${fgmi._id}`,
       fgmi,
       config
     )
 
     dispatch({
       type: FGMI_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: FGMI_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: FGMI_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteFGMI = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: FGMI_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/fgmi/${id}`, config)
 
     dispatch({
       type: FGMI_DELETE_SUCCESS,
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
       type: FGMI_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all fgmi records
export const listAllFGMIs = (pageNumber = '') => async (dispatch, getState) => {
   try {
     dispatch({
       type: FGMI_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //console .log("!!!!!>>>> Inside SO Action sales order list aaahe ==== ")
     const { data } = await axios.get(`/api/fgmi/all?pageNumber=${pageNumber}`, config)
     //console .log("!!!!!>>>> Inside SO Action sales order list aaahe ==== ", data)
     dispatch({
       type: FGMI_LIST_SUCCESS,
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
       type: FGMI_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for Job Card Screens
export const getAllMasterDataForFGMI = () => async (dispatch, getState) => {
  //logger("*********** inside getAllMasterDataForFGMI ***********")
  try {
    dispatch({
      type: FGMI_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/fgmi/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Job Cards.............", data)
    
    dispatch({
      type: FGMI_MASTER_LIST_SUCCESS,
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
      type: FGMI_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

//7. get FGMI batches for JC ID
export const getFGMIBatchedByJCId = (jcId) => async (dispatch, getState) => {
  try {
    //console .log("1. +++ inside a function to get FGMI details +++++")
    dispatch({ type: FGMI_BACTH_LIST_BY_JC_REQUEST })
    //logger("2. ()()() inside fgmi Details BEFORE GETTING fgmi details ********* ")
    const {
      userLogin: { userInfo },
    } = getState()
    //logger("3. ()()() inside FGMI Details BEFORE GETTING FGMI details ********* ")
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //logger("4. ()()() inside listFGMIDetails BEFORE GETTING FGMI details ********* ")
    const { data } = await axios.get(`/api/fgmi/jc/?jcId=${jcId}`, config)
    //logger("***** inside listFGMIDetails and details are ********* ",data)
    dispatch({
      type: FGMI_BACTH_LIST_BY_JC_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //logger("Action file --- Error in getting data --------> ", error)
    dispatch({
      type: FGMI_BACTH_LIST_BY_JC_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      
    })
  }
}

//3. update a single record action
export const updateFGMICorrection = (fgmi) => async (dispatch, getState) => {
  logger("1. fgmiActions --> updateFGMICorrection --> ", fgmi)
  logger("1. fgmiActions --> updateFGMICorrection --> and fgmiId === ", fgmi.fgmiId)
  try {
    dispatch({
      type: FGMI_CORRECTION_UPDATE_REQUEST,
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
    logger("2. fgmiActions --> updateFGMICorrection --> ", fgmi.fgmiId)
    const { data } = await axios.put(
      `/api/fgmi/fgcorrection/${fgmi.fgmiId}`,
      fgmi,
      config
    )
    logger("3. fgmiActions --> updateFGMICorrection --> ", data)
    dispatch({
      type: FGMI_CORRECTION_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: FGMI_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    logger("4. fgmiActions --> updateFGMICorrection --> Error ", error.response)
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: FGMI_CORRECTION_UPDATE_FAIL,
      payload: message,
    })
  }
}
