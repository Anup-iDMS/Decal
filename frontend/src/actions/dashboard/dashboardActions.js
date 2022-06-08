import axios from 'axios';
import { logout } from '../masters/userActions';
import { 
   DASHBOARD_DETAILS_REQUEST,
   DASHBOARD_DETAILS_SUCCESS,
   DASHBOARD_DETAILS_FAIL,
   DASHBOARD_DETAILS_RESET,
   DASHBOARD_CHART_REQUEST,
   DASHBOARD_CHART_SUCCESS,
   DASHBOARD_CHART_FAIL,
   PRODUCTION_CHART_REQUEST,
   PRODUCTION_CHART_SUCCESS,
   PRODUCTION_CHART_FAIL,
   QA_DASHBOARD_REQUEST,
   QA_DASHBOARD_SUCCESS,
   QA_DASHBOARD_FAIL,
   SALES_DASHBOARD_REQUEST,
   SALES_DASHBOARD_SUCCESS,
   SALES_DASHBOARD_FAIL,
   PPM_DASHBOARD_REQUEST,
   PPM_DASHBOARD_SUCCESS,
   PPM_DASHBOARD_FAIL,
} from './../../constants/dashboard/dashboardConstants';

import { logger } from './../../util/ConsoleHelper';

//1. get all all Dashboard data
export const getDashboardData = () => async (dispatch, getState) => {
   try {
     dispatch({
       type: DASHBOARD_DETAILS_REQUEST,
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
     const { data } = await axios.get(`/api/dashboard`, config)
     //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside SalesInvoice.............", data)
     dispatch({
       type: DASHBOARD_DETAILS_SUCCESS,
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
       type: DASHBOARD_DETAILS_FAIL,
       payload: message,
     })
   }
}

//2. get all Dashboard Chart data
export const getDashboardChartData = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DASHBOARD_CHART_REQUEST,
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
    const { data } = await axios.get(`/api/dashboard/charts`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside SalesInvoice.............", data)
    dispatch({
      type: DASHBOARD_CHART_SUCCESS,
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
      type: DASHBOARD_CHART_FAIL,
      payload: message,
    })
  }
}

//3. get all Dashboard pRODUCTION data
export const getProductionDashboardChartData = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCTION_CHART_REQUEST,
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
    const { data } = await axios.get(`/api/dashboard/production`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside SalesInvoice.............", data)
    dispatch({
      type: PRODUCTION_CHART_SUCCESS,
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
      type: PRODUCTION_CHART_FAIL,
      payload: message,
    })
  }
}

//4. get all Dashboard Sales data
export const getSalesDashboardChartData = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SALES_DASHBOARD_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.get(`/api/dashboard/sales`, config)
    dispatch({
      type: SALES_DASHBOARD_SUCCESS,
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
      type: SALES_DASHBOARD_FAIL,
      payload: message,
    })
  }
}

//5. get all Dashboard Sales data
export const getQADashboardChartData = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: QA_DASHBOARD_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.get(`/api/dashboard/qa`, config)
    dispatch({
      type: QA_DASHBOARD_SUCCESS,
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
      type: QA_DASHBOARD_FAIL,
      payload: message,
    })
  }
}

//6. get all PPM Dashboard data
export const getPPMDashboardData = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PPM_DASHBOARD_REQUEST,
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
    const { data } = await axios.get(`/api/dashboard/ppm`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside SalesInvoice.............", data)
    dispatch({
      type: PPM_DASHBOARD_SUCCESS,
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
      type: PPM_DASHBOARD_FAIL,
      payload: message,
    })
  }
}
