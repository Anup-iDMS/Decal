import axios from 'axios'
import { logout } from './../masters/userActions'
import { logger } from './../../util/ConsoleHelper';

import { 
	SALES_ORDER_CREATE_REQUEST,
	SALES_ORDER_CREATE_SUCCESS,
	// SALES_ORDER_CREATE_FAIL,
	// SALES_ORDER_CREATE_RESET,

	SALES_ORDER_DETAILS_REQUEST,
	SALES_ORDER_DETAILS_SUCCESS,
	SALES_ORDER_DETAILS_FAIL,
	// SALES_ORDER_DETAILS_RESET,

	SALES_ORDER_UPDATE_REQUEST,
	SALES_ORDER_UPDATE_SUCCESS,
	SALES_ORDER_UPDATE_FAIL,
	// SALES_ORDER_UPDATE_RESET,

	SALES_ORDER_DELETE_REQUEST,
	SALES_ORDER_DELETE_SUCCESS,
	SALES_ORDER_DELETE_FAIL,
	// SALES_ORDER_DELETE_RESET,

	SALES_ORDER_LIST_REQUEST,
	SALES_ORDER_LIST_SUCCESS,
	SALES_ORDER_LIST_FAIL,
	// SALES_ORDER_LIST_RESET,

  SALES_ORDER_MASTER_LIST_REQUEST,
  SALES_ORDER_MASTER_LIST_SUCCESS,
  SALES_ORDER_MASTER_LIST_FAIL,
  // SALES_ORDER_MASTER_LIST_RESET,

  BACK_ORDER_LIST_REQUEST,
  BACK_ORDER_LIST_SUCCESS,
  BACK_ORDER_LIST_FAIL,
  // BACK_ORDER_LIST_RESET,

  SO_DETAILS_LIST_REQUEST,
  SO_DETAILS_LIST_SUCCESS,
  SO_DETAILS_LIST_FAIL,
  // SO_DETAILS_LIST_RESET,

  CANCEL_SO_DETAILS_LIST_REQUEST,
  CANCEL_SO_DETAILS_LIST_SUCCESS,
  CANCEL_SO_DETAILS_LIST_FAIL,

  BACK_ORDER_BY_JC_LIST_REQUEST,
  BACK_ORDER_BY_JC_LIST_SUCCESS,
  BACK_ORDER_BY_JC_LIST_FAIL,
  BACK_ORDER_BY_JC_LIST_RESET,

  SALES_ORDER_JC_MASTER_LIST_REQUEST,
  SALES_ORDER_JC_MASTER_LIST_SUCCESS,
  SALES_ORDER_JC_MASTER_LIST_FAIL,
  SALES_ORDER_JC_MASTER_LIST_RESET,

  OPEN_CUSTOMER_SO_LIST_REQUEST,
  OPEN_CUSTOMER_SO_LIST_SUCCESS,
  OPEN_CUSTOMER_SO_LIST_FAIL,
  OPEN_CUSTOMER_SO_LIST_RESET,

  OPEN_SALES_ORDER_REQUEST,
  OPEN_SALES_ORDER_SUCCESS,
  OPEN_SALES_ORDER_FAIL,
  OPEN_SALES_ORDER_RESET,

  CANCEL_SO_LINE_UPDATE_REQUEST,
  CANCEL_SO_LINE_UPDATE_SUCCESS,
  CANCEL_SO_LINE_UPDATE_FAIL,
  CANCEL_SO_LINE_UPDATE_RESET

} from './../../constants/sales/salesOrderConstants';

//1. create a SalesOrder record action
export const createSalesOrder = (salesOrder) => async(dispatch, getState) => {
   //console .log("1. INside create SalesOrder of action ----", salesOrder)
   try {
     dispatch({
       type: SALES_ORDER_CREATE_REQUEST,
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
     //console .log("2. INside create SalesOrder action Before inserting data  ----")
     const { data } = await axios.post('/api/salesorders', salesOrder, config)
     //console .log("3. Inside create SalesOrder action and data inserted is ==== ", data)
     dispatch({
       type: SALES_ORDER_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create SalesOrder Acion AFTER DISPATCH data  ----")
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
export const getSalesOrderDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get SALES_ORDER details +++++")
     dispatch({ type: SALES_ORDER_DETAILS_REQUEST })
     //logger("2. ()()() inside salesOrder Details BEFORE GETTING salesOrder details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside SalesOrder Details BEFORE GETTING SALES_ORDER details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listSalesOrderDetails BEFORE GETTING SALES_ORDER details ********* ")
     const { data } = await axios.get(`/api/salesorders/${id}`, config)
     //logger("***** inside listSalesOrderDetails and details are ********* ",data)
     dispatch({
       type: SALES_ORDER_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: SALES_ORDER_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateSalesOrder = (salesOrder) => async (dispatch, getState) => {
   try {
     dispatch({
       type: SALES_ORDER_UPDATE_REQUEST,
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
       `/api/salesorders/${salesOrder._id}`,
       salesOrder,
       config
     )
 
     dispatch({
       type: SALES_ORDER_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: SALES_ORDER_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: SALES_ORDER_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteSalesOrder = (id) => async (dispatch, getState) => {
  console.log("========== inside action and id is ????????????? ", id)
   try {
     dispatch({
       type: SALES_ORDER_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/salesorders/${id}`, config)
 
     dispatch({
       type: SALES_ORDER_DELETE_SUCCESS,
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
       type: SALES_ORDER_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all module records
export const listAllSalesOrders = (pageNumber = '') => async (dispatch, getState) => {
   try {
     dispatch({
       type: SALES_ORDER_LIST_REQUEST,
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
     const { data } = await axios.get(`/api/salesorders/all?pageNumber=${pageNumber}`, config)
     //console .log("!!!!!>>>> Inside SO Action sales order list aaahe ==== ", data)
     dispatch({
       type: SALES_ORDER_LIST_SUCCESS,
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
       type: SALES_ORDER_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for Sales Order Screens
export const getAllMasterDataForSalesOrder = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SALES_ORDER_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/salesorders/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Sales order.............", data)
    dispatch({
      type: SALES_ORDER_MASTER_LIST_SUCCESS,
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
      type: SALES_ORDER_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

//6.1 get all all master data for Sales Order Screens
export const getAllJCMasterDataForSalesOrder = () => async (dispatch, getState) => {
 // logger("-------------------- here to get all JC records ----------- ")
  try {
    dispatch({
      type: SALES_ORDER_JC_MASTER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/salesorders/jcmasterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Sales order.............", data)
    dispatch({
      type: SALES_ORDER_JC_MASTER_LIST_SUCCESS,
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
      type: SALES_ORDER_JC_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

//7. get all all Sales Orders by SO
export const getBackOrdersBySO = (jcId, startDate, endDate) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BACK_ORDER_LIST_REQUEST,
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
    const { data } = await axios.get(`/api/salesorders/backorderbyso/?jcId=${jcId}&startDate=${startDate}&endDate=${endDate}`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Sales order.............", data)
    dispatch({
      type: BACK_ORDER_LIST_SUCCESS,
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
      type: BACK_ORDER_LIST_FAIL,
      payload: message,
    })
  }
}

//8. get all all master data for Sales Order Screens
export const getSODetailsByLine = () => async (dispatch, getState) => {
  logger("2. Here inside Action to get master data for JC .............")
  try {
    dispatch({
      type: SO_DETAILS_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.get(`/api/salesorders/details`, config)
    logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Sales order.............", data)
    dispatch({
      type: SO_DETAILS_LIST_SUCCESS,
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
      type: SO_DETAILS_LIST_FAIL,
      payload: message,
    })
  }
}

//8.1. get all Canceled Sales Order
export const getCancelSODetailsByLine = () => async (dispatch, getState) => {
  logger("2. Here inside Action to get master data for JC .............")
  try {
    dispatch({
      type: CANCEL_SO_DETAILS_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.get(`/api/salesorders/cancelso`, config)
    logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Sales order.............", data)
    dispatch({
      type: CANCEL_SO_DETAILS_LIST_SUCCESS,
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
      type: CANCEL_SO_DETAILS_LIST_FAIL,
      payload: message,
    })
  }
}


//9. get all all master data for Sales Order Screens
export const getBackOrdersByJC = (jcId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BACK_ORDER_BY_JC_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    logger("2. Here inside Action to get master data for JC ............. ", jcId)
    const { data } = await axios.get(`/api/salesorders/backorderbyjc/?jcId=${jcId}`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Sales order.............", data)
    dispatch({
      type: BACK_ORDER_BY_JC_LIST_SUCCESS,
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
      type: BACK_ORDER_BY_JC_LIST_FAIL,
      payload: message,
    })
  }
}

//10. get all Open Sales Orders for a Customer
export const getCustomerOpenSalesOrders = (customerId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: OPEN_CUSTOMER_SO_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    logger("2. Here inside Action to get OPEN_CUSTOMER_SO_LIST_REQUEST .............")
    const { data } = await axios.get(`/api/salesorders/opensos/?customerId=${customerId}`, config)
    logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Sales order.............", data)
    dispatch({
      type: OPEN_CUSTOMER_SO_LIST_SUCCESS,
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
      type: OPEN_CUSTOMER_SO_LIST_FAIL,
      payload: message,
    })
  }
}

//11. get all Open Sales Order
export const getBalancedQtyBySO = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: OPEN_SALES_ORDER_REQUEST,
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
    const { data } = await axios.get(`/api/salesorders/balancedqtybyso`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside Sales order.............", data)
    dispatch({
      type: OPEN_SALES_ORDER_SUCCESS,
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
      type: OPEN_SALES_ORDER_FAIL,
      payload: message,
    })
  }
}

//12. update a single record action
export const updateSalesOrderCancelQty = (id, lineNumber, jcId, balancedQty, canceledReason) => async (dispatch, getState) => {
  console.log("Have I reached here ", id)
  console.log("Have I reached here ", jcId)
  console.log("Have I reached here balancedQty ", balancedQty)
  console.log("Have I reached here lineNumber ", lineNumber)
  try {
    dispatch({
      type: CANCEL_SO_LINE_UPDATE_REQUEST,
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
    console.log("--- i have reacted heere 598 ----- ")
    const { data } = await axios.get(
      `/api/salesorders/cancelsolineqty/?id=${id}&lineNumber=${lineNumber}&jcId=${jcId}&balancedQty=${balancedQty}&canceledReason=${canceledReason}`,
      config
    )
    console.log("--- i have reacted heere 603 ----- ")
    dispatch({
      type: CANCEL_SO_LINE_UPDATE_SUCCESS,
      payload: data,
    })
    //dispatch({ type: SALES_ORDER_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    console.log("Error is ========== ", error)
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      //dispatch(logout())
    }
    dispatch({
      type: CANCEL_SO_LINE_UPDATE_FAIL,
      payload: message,
    })
  }
}