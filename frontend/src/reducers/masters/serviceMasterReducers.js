import { 
   SERVICE_MASTER_CREATE_REQUEST,
	SERVICE_MASTER_CREATE_SUCCESS,
	SERVICE_MASTER_CREATE_FAIL,
	SERVICE_MASTER_CREATE_RESET,

	SERVICE_MASTER_DETAILS_REQUEST,
	SERVICE_MASTER_DETAILS_SUCCESS,
	SERVICE_MASTER_DETAILS_FAIL,
	SERVICE_MASTER_DETAILS_RESET,

	SERVICE_MASTER_UPDATE_REQUEST,
	SERVICE_MASTER_UPDATE_SUCCESS,
	SERVICE_MASTER_UPDATE_FAIL,
	SERVICE_MASTER_UPDATE_RESET,

	SERVICE_MASTER_DELETE_REQUEST,
	SERVICE_MASTER_DELETE_SUCCESS,
	SERVICE_MASTER_DELETE_FAIL,
	SERVICE_MASTER_DELETE_RESET,

	SERVICE_MASTER_LIST_REQUEST,
	SERVICE_MASTER_LIST_SUCCESS,
	SERVICE_MASTER_LIST_FAIL,
	SERVICE_MASTER_LIST_RESET,
  
   SERVICE_MASTER_MASTER_LIST_REQUEST,
   SERVICE_MASTER_MASTER_LIST_SUCCESS,
   SERVICE_MASTER_MASTER_LIST_FAIL,
   SERVICE_MASTER_MASTER_LIST_RESET, 
} 
from '../../constants/masters/serviceMasterConstants';

//1. create a serviceMaster record reducer
export const serviceMasterCreateReducer = (state={}, action) => {
  //console.log("Inside ServiceMaster create Reducer ####### ", action.type)
  switch (action.type) {
    case SERVICE_MASTER_CREATE_REQUEST:
      return {
        loading: true,
      }
    case SERVICE_MASTER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        serviceMaster: action.payload,
      }
    case SERVICE_MASTER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case SERVICE_MASTER_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const serviceMasterDetailsReducer = (state = { serviceMaster: {} }, action) => {
  //console.log("Inside ServiceMaster Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case SERVICE_MASTER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case SERVICE_MASTER_DETAILS_SUCCESS:
      return { loading: false, serviceMaster: action.payload }
    case SERVICE_MASTER_DETAILS_FAIL:
      return { loading: false, error: action.payload, serviceMaster:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const serviceMasterUpdateReducer = (state = { serviceMaster: {} }, action) => {
  switch (action.type) {
    case SERVICE_MASTER_UPDATE_REQUEST:
      return { loading: true }
    case SERVICE_MASTER_UPDATE_SUCCESS:
      return { loading: false, success: true, serviceMaster: action.payload }
    case SERVICE_MASTER_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case SERVICE_MASTER_UPDATE_RESET:
      return { serviceMaster: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const serviceMasterDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICE_MASTER_DELETE_REQUEST:
      return { loading: true }
    case SERVICE_MASTER_DELETE_SUCCESS:
      return { loading: false, success: true }
    case SERVICE_MASTER_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all serviceMaster records reducer
export const allServiceMasterListReducer = (state = { serviceMasters: [] }, action) => {
  switch (action.type) {
    case SERVICE_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
    case SERVICE_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        serviceMasters: action.payload.serviceMasters,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case SERVICE_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case SERVICE_MASTER_LIST_RESET:
      return { serviceMasters: [] }
    default:
      return state
  }
}

//6. get all ServiceMaster records reducer
export const masterDataForServiceMasterReducer = (state = { masterdataForServiceMaster: {} }, action) => {
  //console.log("Inside masterdataForServiceMasterReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case SERVICE_MASTER_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
      case SERVICE_MASTER_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        autoIncrementeServiceMasterNo: action.payload.autoIncrementeServiceMasterNo,
        hsnsacs: action.payload.hsnsacs,
      }
      case SERVICE_MASTER_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case SERVICE_MASTER_MASTER_LIST_RESET:
        return { masterdataForServiceMaster: { } }
      default:
        return state
  }
}