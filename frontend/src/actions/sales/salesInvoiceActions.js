import axios from 'axios'
import { logger } from './../../util/ConsoleHelper';

import { 
	SALES_INVOICE_CREATE_REQUEST,
	SALES_INVOICE_CREATE_SUCCESS,
	// SALES_INVOICE_CREATE_FAIL,
	// SALES_INVOICE_CREATE_RESET,

	SALES_INVOICE_DETAILS_REQUEST,
	SALES_INVOICE_DETAILS_SUCCESS,
	SALES_INVOICE_DETAILS_FAIL,
	// SALES_INVOICE_DETAILS_RESET,

	SALES_INVOICE_UPDATE_REQUEST,
	SALES_INVOICE_UPDATE_SUCCESS,
	SALES_INVOICE_UPDATE_FAIL,
	// SALES_INVOICE_UPDATE_RESET,

	SALES_INVOICE_DELETE_REQUEST,
	SALES_INVOICE_DELETE_SUCCESS,
	SALES_INVOICE_DELETE_FAIL,
	// SALES_INVOICE_DELETE_RESET,

	SALES_INVOICE_LIST_REQUEST,
	SALES_INVOICE_LIST_SUCCESS,
	SALES_INVOICE_LIST_FAIL,
	// SALES_INVOICE_LIST_RESET,

  SALES_INVOICE_WITH_TAX_LIST_REQUEST,
  SALES_INVOICE_WITH_TAX_LIST_SUCCESS,
  SALES_INVOICE_WITH_TAX_LIST_FAIL,
  //SALES_INVOICE_WITH_TAX_LIST_RESET,

  SALES_INVOICE_MASTER_LIST_REQUEST,
  SALES_INVOICE_MASTER_LIST_SUCCESS,
  SALES_INVOICE_MASTER_LIST_FAIL,
  // SALES_INVOICE_MASTER_LIST_RESET,

  BACK_ORDER_LIST_REQUEST,
  BACK_ORDER_LIST_SUCCESS,
  BACK_ORDER_LIST_FAIL,
  // BACK_ORDER_LIST_RESET,

  // SI_DETAILS_LIST_REQUEST,
  // SI_DETAILS_LIST_SUCCESS,
  // SI_DETAILS_LIST_FAIL,
  // SI_DETAILS_LIST_RESET,

  BACK_ORDER_BY_JC_LIST_REQUEST,
  BACK_ORDER_BY_JC_LIST_SUCCESS,
  BACK_ORDER_BY_JC_LIST_FAIL,
  BACK_ORDER_BY_JC_LIST_RESET,

  SALES_INVOICE_JC_MASTER_LIST_REQUEST,
  SALES_INVOICE_JC_MASTER_LIST_SUCCESS,
  SALES_INVOICE_JC_MASTER_LIST_FAIL,
  SALES_INVOICE_JC_MASTER_LIST_RESET,
  
  SALES_INVOICE_OPEN_LIST_REQUEST, 
  SALES_INVOICE_OPEN_LIST_SUCCESS,
  SALES_INVOICE_OPEN_LIST_FAIL,
  SALES_INVOICE_OPEN_LIST_RESET,

  SALES_INVOICE_APPROVED_LIST_REQUEST,
  SALES_INVOICE_APPROVED_LIST_SUCCESS,
  SALES_INVOICE_APPROVED_LIST_FAIL,

  CUSTOMER_SALES_INVOICE_LIST_REQUEST,
  CUSTOMER_SALES_INVOICE_LIST_SUCCESS,
  CUSTOMER_SALES_INVOICE_LIST_FAIL,

  SI_DETAILS_LIST_REQUEST,
  SI_DETAILS_LIST_SUCCESS,
  SI_DETAILS_LIST_FAIL,

  SI_DISPATCH_DETAILS_LIST_REQUEST,
  SI_DISPATCH_DETAILS_LIST_SUCCESS,
  SI_DISPATCH_DETAILS_LIST_FAIL,

} from '../../constants/sales/salesInvoiceConstants';
import { logout } from '../masters/userActions';

//1. create a SalesInvoice record action
export const createSalesInvoice = (salesInvoice) => async(dispatch, getState) => {
   //console .log("1. INside create SalesInvoice of action ----", salesInvoice)
   try {
     dispatch({
       type: SALES_INVOICE_CREATE_REQUEST,
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
     //console .log("2. INside create SalesInvoice action Before inserting data  ----")
     const { data } = await axios.post('/api/salesinvoice', salesInvoice, config)
     //console .log("3. Inside create SalesInvoice action and data inserted is ==== ", data)
     dispatch({
       type: SALES_INVOICE_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create SalesInvoice Acion AFTER DISPATCH data  ----")
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
export const getSalesInvoiceDetails = (id) => async (dispatch, getState) => {
   try {
     console .log("1. +++ inside a function to get SalesInvoice details +++++")
     dispatch({ type: SALES_INVOICE_DETAILS_REQUEST })
     ////logger("2. ()()() inside salesInvoice Details BEFORE GETTING salesInvoice details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     ////logger("3. ()()() inside SalesInvoice Details BEFORE GETTING SalesInvoice details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listSalesInvoiceDetails BEFORE GETTING SalesInvoice details ********* ")
     const { data } = await axios.get(`/api/salesinvoice/${id}`, config)
     //logger("***** inside listSalesInvoiceDetails and details are ********* ",data)
     dispatch({
       type: SALES_INVOICE_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: SALES_INVOICE_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateSalesInvoice = (salesInvoice) => async (dispatch, getState) => {
   try {
     dispatch({
       type: SALES_INVOICE_UPDATE_REQUEST,
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
       `/api/salesinvoice/${salesInvoice._id}`,
       salesInvoice,
       config
     )
 
     dispatch({
       type: SALES_INVOICE_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: SALES_INVOICE_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: SALES_INVOICE_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteSalesInvoice = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: SALES_INVOICE_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/salesinvoice/${id}`, config)
 
     dispatch({
       type: SALES_INVOICE_DELETE_SUCCESS,
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
       type: SALES_INVOICE_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all module records
export const listAllSalesInvoices = (pageNumber = '') => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: SALES_INVOICE_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
    // console .log("!!!!!>>>> Inside SO Action SalesInvoice  list aaahe ==== ")
     const { data } = await axios.get(`/api/salesinvoice/all?pageNumber=${pageNumber}`, config)
     //console .log("!!!!!>>>> Inside SO Action SalesInvoice list aaahe ==== ", data)
     dispatch({
       type: SALES_INVOICE_LIST_SUCCESS,
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
       type: SALES_INVOICE_LIST_FAIL,
       payload: message,
     })
   }
}

//5.1 get all module records
export const listAllSalesInvoicesWithTax = (pageNumber = '', startDate, endDate) => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: SALES_INVOICE_WITH_TAX_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
    // console .log("!!!!!>>>> Inside SO Action SalesInvoice  list aaahe ==== ")
     const { data } = await axios.get(`/api/salesinvoice/withtax?pageNumber=${pageNumber}&startDate=${startDate}&endDate=${endDate}`, config)
     //console .log("!!!!!>>>> Inside SO Action SalesInvoice list aaahe ==== ", data)
     dispatch({
       type: SALES_INVOICE_WITH_TAX_LIST_SUCCESS,
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
       type: SALES_INVOICE_WITH_TAX_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for SalesInvoice Screens
export const getAllMasterDataForSalesInvoice = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SALES_INVOICE_MASTER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //logger("2. Here inside Action to get master data for Sales Invoice .............")
    const { data } = await axios.get(`/api/salesinvoice/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside SalesInvoice.............", data)
    dispatch({
      type: SALES_INVOICE_MASTER_LIST_SUCCESS,
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
      type: SALES_INVOICE_MASTER_LIST_FAIL,
      payload: message,
    })
  }
}

//7. get all module records
export const listAllSalesInvoicesForCustomer = (id = '') => async (dispatch, getState) => {
  //logger("-------------->>>>>>> START <<<<<<<<<----------------------")
   try {
     dispatch({
       type: CUSTOMER_SALES_INVOICE_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //console .log("!!!!!>>>> Inside SO Action SalesInvoice  list aaahe ==== ")
     const { data } = await axios.get(`/api/salesinvoice/customer/${id}`, config)
     //console .log("!!!!!>>>> Inside SO Action SalesInvoice list aaahe ==== ", data)
     dispatch({
       type: CUSTOMER_SALES_INVOICE_LIST_SUCCESS,
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
       type: CUSTOMER_SALES_INVOICE_LIST_FAIL,
       payload: message,
     })
   }
}

//8. get all all master data for Sales Invoice Screens
export const getSIDetailsByLine = (jcId, startDate, endDate) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SI_DETAILS_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.get(`/api/salesinvoice/invoicedetails/?jcId=${jcId}&startDate=${startDate}&endDate=${endDate}`, config)
    dispatch({
      type: SI_DETAILS_LIST_SUCCESS,
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
      type: SI_DETAILS_LIST_FAIL,
      payload: message,
    })
  }
}

//9. get all all master data for Sales Invoice Screens
export const getSIDetailsByDispatch = (customerId, startDate, endDate) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SI_DISPATCH_DETAILS_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.get(`/api/salesinvoice/invoicedetailsbydispatch/?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`, config)
    dispatch({
      type: SI_DISPATCH_DETAILS_LIST_SUCCESS,
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
      type: SI_DISPATCH_DETAILS_LIST_FAIL,
      payload: message,
    })
  }
}