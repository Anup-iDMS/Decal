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

 //1. create a ppmReport record reducer
export const ppmReportCreateReducer = (state={}, action) => {
   //console.log("Inside InspectionMethod create Reducer ####### ", action.type)
   switch (action.type) {
     case PPM_REPORT_CREATE_REQUEST:
       return {
         loading: true,
       }
     case PPM_REPORT_CREATE_SUCCESS:
       return {
         loading: false,
         success: true,
         ppmReport: action.payload,
       }
     case PPM_REPORT_CREATE_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
     case PPM_REPORT_CREATE_RESET:
       return {}
     default:
       return state
   }
}
 
//2. get a single record reducer
export const ppmReportDetailsReducer = (state = { ppmReport: {} }, action) => {
//console.log("Inside InspectionMethod Recucer and action is &&&&&&& ", action.type)
switch (action.type) {
   case PPM_REPORT_DETAILS_REQUEST:
      return { ...state, loading: true }
   case PPM_REPORT_DETAILS_SUCCESS:
      return { loading: false, ppmReport: action.payload }
   case PPM_REPORT_DETAILS_FAIL:
      return { loading: false, error: action.payload, ppmReport:{} }
   default:
      return state
}
}

//3. update a single record reducer
export const ppmReportUpdateReducer = (state = { ppmReport: {} }, action) => {
switch (action.type) {
   case PPM_REPORT_UPDATE_REQUEST:
      return { loading: true }
   case PPM_REPORT_UPDATE_SUCCESS:
      return { loading: false, success: true, ppmReport: action.payload }
   case PPM_REPORT_UPDATE_FAIL:
      return { loading: false, error: action.payload }
   case PPM_REPORT_UPDATE_RESET:
      return { ppmReport: {} }
   default:
      return state
}
}