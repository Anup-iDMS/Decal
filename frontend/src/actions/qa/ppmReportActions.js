import axios from 'axios'
import { logout } from '../masters/userActions';
import { 
   PPM_REPORT_CREATE_REQUEST,
	PPM_REPORT_CREATE_SUCCESS,
	PPM_REPORT_CREATE_FAIL,
	PPM_REPORT_CREATE_RESET,

	PPM_REPORT_DETAILS_REQUEST,
	PPM_REPORT_DETAILS_SUCCESS,
	PPM_REPORT_DETAILS_FAIL,
	PPM_REPORT_DETAILS_RESET,

	PPM_REPORT_UPDATE_REQUEST,
	PPM_REPORT_UPDATE_SUCCESS,
	PPM_REPORT_UPDATE_FAIL,
	PPM_REPORT_UPDATE_RESET,
} from '../../constants/qa/ppmReportConstants';

//1. create a ppmReport record action
export const createPPMReport = (ppmReport) => async(dispatch, getState) => {
   console.log("1. INside create PPMReport of action ----", ppmReport)
   try {
     dispatch({
       type: PPM_REPORT_CREATE_REQUEST,
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
     console.log("2. INside create PPMReport action Before inserting data  ----")
     const { data } = await axios.post('/api/ppmreport', ppmReport, config)
     console.log("3. Inside create PPMReport action and data inserted is ==== ", data)
     dispatch({
       type: PPM_REPORT_CREATE_SUCCESS,
       payload: data,
     })
     console.log("4. INside create PPMReport Acion AFTER DISPATCH data  ----")
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
 export const getPPMReportDetails = (id) => async (dispatch, getState) => {
   try {
     //console.log("1. +++ inside a function to get MODULE details +++++")
     dispatch({ type: PPM_REPORT_DETAILS_REQUEST })
     //console.log("2. ()()() inside ppmReport Details BEFORE GETTING ppmReport details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //console.log("3. ()()() inside PPMReport Details BEFORE GETTING MODULE details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //console.log("4. ()()() inside listPPMReportDetails BEFORE GETTING MODULE details ********* ")
     const { data } = await axios.get(`/api/ppmreport`, config)
     //console.log("***** inside listPPMReportDetails and details are ********* ",data)
     dispatch({
       type: PPM_REPORT_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //console.log("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: PPM_REPORT_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
 }
 
 //3. update a single record action
 export const updatePPMReport = (ppmReport) => async (dispatch, getState) => {
   try {
     dispatch({
       type: PPM_REPORT_UPDATE_REQUEST,
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
       `/api/ppmreport/${ppmReport._id}`,
       ppmReport,
       config
     )
 
     dispatch({
       type: PPM_REPORT_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: PPM_REPORT_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: PPM_REPORT_UPDATE_FAIL,
       payload: message,
     })
   }
 }