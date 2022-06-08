import { 
   APP_PARAMETER_CREATE_REQUEST,
	APP_PARAMETER_CREATE_SUCCESS,
	APP_PARAMETER_CREATE_FAIL,
	APP_PARAMETER_CREATE_RESET,

	APP_PARAMETER_DETAILS_REQUEST,
	APP_PARAMETER_DETAILS_SUCCESS,
	APP_PARAMETER_DETAILS_FAIL,
	APP_PARAMETER_DETAILS_RESET,

	APP_PARAMETER_UPDATE_REQUEST,
	APP_PARAMETER_UPDATE_SUCCESS,
	APP_PARAMETER_UPDATE_FAIL,
	APP_PARAMETER_UPDATE_RESET,

	APP_PARAMETER_DELETE_REQUEST,
	APP_PARAMETER_DELETE_SUCCESS,
	APP_PARAMETER_DELETE_FAIL,
	APP_PARAMETER_DELETE_RESET,

	APP_PARAMETER_LIST_REQUEST,
	APP_PARAMETER_LIST_SUCCESS,
	APP_PARAMETER_LIST_FAIL,
	APP_PARAMETER_LIST_RESET,
  
  APP_PARAMETER_MASTER_LIST_REQUEST,
  APP_PARAMETER_MASTER_LIST_SUCCESS,
  APP_PARAMETER_MASTER_LIST_FAIL,
  APP_PARAMETER_MASTER_LIST_RESET, 
 } from '../../constants/masters/appParameterConstants';

//1. create a appParameter record reducer
export const appParameterCreateReducer = (state={}, action) => {
  //console.log("Inside AppParameter create Reducer ####### ", action.type)
  switch (action.type) {
    case APP_PARAMETER_CREATE_REQUEST:
      return {
        loading: true,
      }
    case APP_PARAMETER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        createAppParam: action.payload,
      }
    case APP_PARAMETER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case APP_PARAMETER_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const appParameterDetailsReducer = (state = { appParameter: {} }, action) => {
  //console.log("Inside AppParameter Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case APP_PARAMETER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case APP_PARAMETER_DETAILS_SUCCESS:
      return { loading: false, appParameter: action.payload }
    case APP_PARAMETER_DETAILS_FAIL:
      return { loading: false, error: action.payload, appParameter:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const appParameterUpdateReducer = (state = { appParameter: {} }, action) => {
  switch (action.type) {
    case APP_PARAMETER_UPDATE_REQUEST:
      return { loading: true }
    case APP_PARAMETER_UPDATE_SUCCESS:
      return { loading: false, success: true, appParameter: action.payload }
    case APP_PARAMETER_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case APP_PARAMETER_UPDATE_RESET:
      return { appParameter: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const appParameterDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case APP_PARAMETER_DELETE_REQUEST:
      return { loading: true }
    case APP_PARAMETER_DELETE_SUCCESS:
      return { loading: false, success: true }
    case APP_PARAMETER_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all appParameter records reducer
export const allAppParameterListReducer = (state = { appParameters: [] }, action) => {
  switch (action.type) {
    case APP_PARAMETER_LIST_REQUEST:
      return {
        loading: true,
      }
    case APP_PARAMETER_LIST_SUCCESS:
      return {
        loading: false,
        appParameters: action.payload.appParameters,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case APP_PARAMETER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case APP_PARAMETER_LIST_RESET:
      return { appParameters: [] }
    default:
      return state
  }
}

//6. get all AppParameter records reducer
export const masterDataForAppParameterReducer = (state = { masterdataForAppParameter: {} }, action) => {
  //console.log("Inside masterdataForAppParameterReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case APP_PARAMETER_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
      case APP_PARAMETER_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        autoIncrementedAppParameterNo: action.payload.autoIncrementedAppParameterNo,
      }
      case APP_PARAMETER_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case APP_PARAMETER_MASTER_LIST_RESET:
        return { masterdataForAppParameter: { } }
      default:
        return state
  }
}