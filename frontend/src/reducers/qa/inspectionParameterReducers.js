import { 
   INSPECTION_PARAM_CREATE_REQUEST,
	INSPECTION_PARAM_CREATE_SUCCESS,
	INSPECTION_PARAM_CREATE_FAIL,
	INSPECTION_PARAM_CREATE_RESET,

	INSPECTION_PARAM_DETAILS_REQUEST,
	INSPECTION_PARAM_DETAILS_SUCCESS,
	INSPECTION_PARAM_DETAILS_FAIL,
	INSPECTION_PARAM_DETAILS_RESET,

	INSPECTION_PARAM_UPDATE_REQUEST,
	INSPECTION_PARAM_UPDATE_SUCCESS,
	INSPECTION_PARAM_UPDATE_FAIL,
	INSPECTION_PARAM_UPDATE_RESET,

	INSPECTION_PARAM_DELETE_REQUEST,
	INSPECTION_PARAM_DELETE_SUCCESS,
	INSPECTION_PARAM_DELETE_FAIL,
	INSPECTION_PARAM_DELETE_RESET,

	INSPECTION_PARAM_LIST_REQUEST,
	INSPECTION_PARAM_LIST_SUCCESS,
	INSPECTION_PARAM_LIST_FAIL,
	INSPECTION_PARAM_LIST_RESET,
  
  INSPECTION_PARAM_MASTER_LIST_REQUEST,
  INSPECTION_PARAM_MASTER_LIST_SUCCESS,
  INSPECTION_PARAM_MASTER_LIST_FAIL,
  INSPECTION_PARAM_MASTER_LIST_RESET, 
 } from '../../constants/qa/inspectionParameterConstants';

//1. create a inspectionParameter record reducer
export const inspectionParameterCreateReducer = (state={}, action) => {
  //console.log("Inside InspectionParameter create Reducer ####### ", action.type)
  switch (action.type) {
    case INSPECTION_PARAM_CREATE_REQUEST:
      return {
        loading: true,
      }
    case INSPECTION_PARAM_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        inspectionParameter: action.payload,
      }
    case INSPECTION_PARAM_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case INSPECTION_PARAM_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const inspectionParameterDetailsReducer = (state = { inspectionParameter: {} }, action) => {
  //console.log("Inside InspectionParameter Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case INSPECTION_PARAM_DETAILS_REQUEST:
      return { ...state, loading: true }
    case INSPECTION_PARAM_DETAILS_SUCCESS:
      return { loading: false, inspectionParameter: action.payload }
    case INSPECTION_PARAM_DETAILS_FAIL:
      return { loading: false, error: action.payload, inspectionParameter:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const inspectionParameterUpdateReducer = (state = { inspectionParameter: {} }, action) => {
  switch (action.type) {
    case INSPECTION_PARAM_UPDATE_REQUEST:
      return { loading: true }
    case INSPECTION_PARAM_UPDATE_SUCCESS:
      return { loading: false, success: true, inspectionParameter: action.payload }
    case INSPECTION_PARAM_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case INSPECTION_PARAM_UPDATE_RESET:
      return { inspectionParameter: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const inspectionParameterDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case INSPECTION_PARAM_DELETE_REQUEST:
      return { loading: true }
    case INSPECTION_PARAM_DELETE_SUCCESS:
      return { loading: false, success: true }
    case INSPECTION_PARAM_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all inspectionParameter records reducer
export const allInspectionParameterListReducer = (state = { inspectionParameters: [] }, action) => {
  switch (action.type) {
    case INSPECTION_PARAM_LIST_REQUEST:
      return {
        loading: true,
      }
    case INSPECTION_PARAM_LIST_SUCCESS:
      return {
        loading: false,
        inspectionParameters: action.payload.inspectionparams,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case INSPECTION_PARAM_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case INSPECTION_PARAM_LIST_RESET:
      return { inspectionParameters: [] }
    default:
      return state
  }
}

//6. get all InspectionParameter records reducer
export const masterDataForInspectionParameterReducer = (state = { masterdataForInspectionParameter: {} }, action) => {
  //console.log("Inside masterdataForInspectionParameterReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case INSPECTION_PARAM_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
      case INSPECTION_PARAM_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        autoIncrementedInspectionParameterNo: action.payload.autoIncrementedInspectionParameterNo,
      }
      case INSPECTION_PARAM_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case INSPECTION_PARAM_MASTER_LIST_RESET:
        return { masterdataForInspectionParameter: { } }
      default:
        return state
  }
}