import { 
   INSPECTION_METHOD_CREATE_REQUEST,
	INSPECTION_METHOD_CREATE_SUCCESS,
	INSPECTION_METHOD_CREATE_FAIL,
	INSPECTION_METHOD_CREATE_RESET,

	INSPECTION_METHOD_DETAILS_REQUEST,
	INSPECTION_METHOD_DETAILS_SUCCESS,
	INSPECTION_METHOD_DETAILS_FAIL,
	INSPECTION_METHOD_DETAILS_RESET,

	INSPECTION_METHOD_UPDATE_REQUEST,
	INSPECTION_METHOD_UPDATE_SUCCESS,
	INSPECTION_METHOD_UPDATE_FAIL,
	INSPECTION_METHOD_UPDATE_RESET,

	INSPECTION_METHOD_DELETE_REQUEST,
	INSPECTION_METHOD_DELETE_SUCCESS,
	INSPECTION_METHOD_DELETE_FAIL,
	INSPECTION_METHOD_DELETE_RESET,

	INSPECTION_METHOD_LIST_REQUEST,
	INSPECTION_METHOD_LIST_SUCCESS,
	INSPECTION_METHOD_LIST_FAIL,
	INSPECTION_METHOD_LIST_RESET,
  
  INSPECTION_METHOD_MASTER_LIST_REQUEST,
  INSPECTION_METHOD_MASTER_LIST_SUCCESS,
  INSPECTION_METHOD_MASTER_LIST_FAIL,
  INSPECTION_METHOD_MASTER_LIST_RESET, 
 } from '../../constants/qa/inspectionMethodConstants';

//1. create a inspectionMethod record reducer
export const inspectionMethodCreateReducer = (state={}, action) => {
  //console.log("Inside InspectionMethod create Reducer ####### ", action.type)
  switch (action.type) {
    case INSPECTION_METHOD_CREATE_REQUEST:
      return {
        loading: true,
      }
    case INSPECTION_METHOD_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        inspectionMethod: action.payload,
      }
    case INSPECTION_METHOD_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case INSPECTION_METHOD_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const inspectionMethodDetailsReducer = (state = { inspectionMethod: {} }, action) => {
  //console.log("Inside InspectionMethod Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case INSPECTION_METHOD_DETAILS_REQUEST:
      return { ...state, loading: true }
    case INSPECTION_METHOD_DETAILS_SUCCESS:
      return { loading: false, inspectionMethod: action.payload }
    case INSPECTION_METHOD_DETAILS_FAIL:
      return { loading: false, error: action.payload, inspectionMethod:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const inspectionMethodUpdateReducer = (state = { inspectionMethod: {} }, action) => {
  switch (action.type) {
    case INSPECTION_METHOD_UPDATE_REQUEST:
      return { loading: true }
    case INSPECTION_METHOD_UPDATE_SUCCESS:
      return { loading: false, success: true, inspectionMethod: action.payload }
    case INSPECTION_METHOD_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case INSPECTION_METHOD_UPDATE_RESET:
      return { inspectionMethod: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const inspectionMethodDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case INSPECTION_METHOD_DELETE_REQUEST:
      return { loading: true }
    case INSPECTION_METHOD_DELETE_SUCCESS:
      return { loading: false, success: true }
    case INSPECTION_METHOD_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all inspectionMethod records reducer
export const allInspectionMethodListReducer = (state = { inspectionMethods: [] }, action) => {
  switch (action.type) {
    case INSPECTION_METHOD_LIST_REQUEST:
      return {
        loading: true,
      }
    case INSPECTION_METHOD_LIST_SUCCESS:
      return {
        loading: false,
        inspectionMethods: action.payload.inspectionmethods,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case INSPECTION_METHOD_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case INSPECTION_METHOD_LIST_RESET:
      return { inspectionMethods: [] }
    default:
      return state
  }
}

//6. get all InspectionMethod records reducer
export const masterDataForInspectionMethodReducer = (state = { masterdataForInspectionMethod: {} }, action) => {
  //console.log("Inside masterdataForInspectionMethodReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case INSPECTION_METHOD_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
      case INSPECTION_METHOD_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        autoIncrementedInspectionMethodNo: action.payload.autoIncrementedInspectionMethodNo,
      }
      case INSPECTION_METHOD_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case INSPECTION_METHOD_MASTER_LIST_RESET:
        return { masterdataForInspectionMethod: { } }
      default:
        return state
  }
}